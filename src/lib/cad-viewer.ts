// A small three.js viewer for CAD parts: studio lighting, a soft contact shadow, and
// SolidWorks-style "shaded with edges" feature lines. Used by the project-page viewer
// and the home-page hero model (see src/lib/load-cad-viewers.ts).
import {
  ACESFilmicToneMapping,
  Box3,
  DirectionalLight,
  EdgesGeometry,
  Group,
  type InterleavedBufferAttribute,
  Mesh,
  MeshStandardMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShadowMaterial,
  Sphere,
  SRGBColorSpace,
  Vector3,
  PCFShadowMap,
  WebGLRenderer,
  type Material,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

export interface CadViewerOptions {
  src: string;
  zoom?: boolean; // scroll/pinch zoom
  pan?: boolean; // right-drag pan
  autoRotate?: boolean;
  rotateSpeed?: number; // degrees per second
  rotateDelay?: number; // ms to wait after interaction before spinning again
  theta?: number; // starting azimuth, degrees (0 = front)
  phi?: number; // starting polar angle, degrees (90 = level)
  edges?: boolean;
  edgeWidth?: number; // edge line width in CSS pixels
  onProgress?: (fraction: number) => void;
}

export interface CadViewer {
  loaded: Promise<void>;
  reset(): void;
  setAutoRotate(on: boolean): void;
  setEdges(on: boolean): void;
  rotateBy(degrees: number): void;
  zoomBy(factor: number): void;
  readonly turntableAngle: number;
}

// Feature edges: faces meeting at more than this angle get a line. Matches the
// 30° crease angle the STL converter uses to split smooth vs sharp shading.
const EDGE_ANGLE = 30;
const EDGE_COLOR = 0x0f1726;
const DEG = Math.PI / 180;

// Silhouette lines: where a curved surface turns away from the viewer (the sides of a
// cylinder), SolidWorks draws an outline even though there's no feature edge there. Those
// lines depend on the view, so they're recomputed whenever the part or camera moves: any
// smooth edge between a triangle facing the camera and one facing away is on the silhouette.
interface Silhouette {
  mesh: Mesh;
  lines: LineSegments2;
  verts: Float32Array; // welded vertex positions (x,y,z)
  normals: Float32Array; // per-triangle normal
  planeD: Float32Array; // per-triangle plane offset (normal · vertex)
  edges: Uint32Array; // candidate edges: vertA, vertB, triangle1, triangle2
  facing: Uint8Array;
  out: Float32Array; // segment buffer written into the line geometry
}

function buildSilhouette(mesh: Mesh, material: LineMaterial): Silhouette | null {
  const pos = mesh.geometry.getAttribute('position');
  const index = mesh.geometry.getIndex();
  const triCount = (index ? index.count : pos.count) / 3;
  if (!triCount) return null;

  // Weld vertices by position: the STL converter splits vertices at sharp creases, which
  // would otherwise hide which triangles share an edge.
  mesh.geometry.computeBoundingBox();
  const size = mesh.geometry.boundingBox!.getSize(new Vector3()).length() || 1;
  const eps = size * 1e-6;
  const weld = new Map<string, number>();
  const remap = new Uint32Array(pos.count);
  const verts: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const key = `${Math.round(x / eps)},${Math.round(y / eps)},${Math.round(z / eps)}`;
    let id = weld.get(key);
    if (id === undefined) {
      id = verts.length / 3;
      weld.set(key, id);
      verts.push(x, y, z);
    }
    remap[i] = id;
  }

  const normals = new Float32Array(triCount * 3);
  const planeD = new Float32Array(triCount);
  const a = new Vector3(), b = new Vector3(), c = new Vector3();
  const edgeFaces = new Map<number, number[]>();
  const vertCount = verts.length / 3;
  for (let t = 0; t < triCount; t++) {
    const tri = [0, 1, 2].map((k) => remap[index ? index.getX(t * 3 + k) : t * 3 + k]);
    a.fromArray(verts, tri[0] * 3);
    b.fromArray(verts, tri[1] * 3);
    c.fromArray(verts, tri[2] * 3);
    const normal = b.sub(a).cross(c.sub(a)).normalize(); // (b - a) × (c - a)
    if (normal.lengthSq() < 0.5) continue; // degenerate sliver
    normal.toArray(normals, t * 3);
    planeD[t] = normal.dot(a);
    for (let k = 0; k < 3; k++) {
      const v1 = tri[k], v2 = tri[(k + 1) % 3];
      if (v1 === v2) continue;
      const key = Math.min(v1, v2) * vertCount + Math.max(v1, v2);
      const list = edgeFaces.get(key);
      if (list) list.push(t);
      else edgeFaces.set(key, [t]);
    }
  }

  // Keep edges shared by exactly two triangles that meet smoothly (sharper ones already
  // have a permanent feature line).
  const cosLimit = Math.cos(EDGE_ANGLE * DEG);
  const edges: number[] = [];
  for (const [key, faces] of edgeFaces) {
    if (faces.length !== 2) continue;
    const [f1, f2] = faces;
    const dot = normals[f1 * 3] * normals[f2 * 3] + normals[f1 * 3 + 1] * normals[f2 * 3 + 1] + normals[f1 * 3 + 2] * normals[f2 * 3 + 2];
    if (dot < cosLimit || dot > 0.999999) continue; // sharp (feature line) or flat (never a silhouette)
    edges.push(Math.floor(key / vertCount), key % vertCount, f1, f2);
  }
  if (!edges.length) return null;

  const geometry = new LineSegmentsGeometry();
  const out = new Float32Array((edges.length / 4) * 6);
  geometry.setPositions(out);
  geometry.instanceCount = 0;
  const lines = new LineSegments2(geometry, material);
  lines.frustumCulled = false; // its contents change every frame
  lines.raycast = () => {};
  mesh.add(lines);
  return {
    mesh,
    lines,
    verts: new Float32Array(verts),
    normals,
    planeD,
    edges: new Uint32Array(edges),
    facing: new Uint8Array(triCount),
    out,
  };
}

const camLocal = new Vector3();
function updateSilhouette(s: Silhouette, cameraWorld: Vector3) {
  camLocal.copy(cameraWorld);
  s.mesh.worldToLocal(camLocal);
  const { normals, planeD, facing, edges, verts, out } = s;
  for (let t = 0; t < facing.length; t++) {
    facing[t] = normals[t * 3] * camLocal.x + normals[t * 3 + 1] * camLocal.y + normals[t * 3 + 2] * camLocal.z > planeD[t] ? 1 : 0;
  }
  let n = 0;
  for (let e = 0; e < edges.length; e += 4) {
    if (facing[edges[e + 2]] === facing[edges[e + 3]]) continue;
    const va = edges[e] * 3, vb = edges[e + 1] * 3;
    out[n++] = verts[va];
    out[n++] = verts[va + 1];
    out[n++] = verts[va + 2];
    out[n++] = verts[vb];
    out[n++] = verts[vb + 1];
    out[n++] = verts[vb + 2];
  }
  const geometry = s.lines.geometry;
  const buffer = (geometry.getAttribute('instanceStart') as InterleavedBufferAttribute).data;
  buffer.clearUpdateRanges();
  buffer.addUpdateRange(0, n);
  buffer.needsUpdate = true;
  geometry.instanceCount = n / 6;
}

export function createCadViewer(container: HTMLElement, options: CadViewerOptions): CadViewer {
  const opts = {
    zoom: true,
    pan: true,
    autoRotate: true,
    rotateSpeed: 18,
    rotateDelay: 2000,
    theta: 35,
    phi: 68,
    edges: true,
    edgeWidth: 1.25,
    // Unset options (undefined) must not overwrite the defaults above.
    ...Object.fromEntries(Object.entries(options).filter(([, v]) => v !== undefined)),
  } as Required<Omit<CadViewerOptions, 'onProgress'>> & Pick<CadViewerOptions, 'onProgress'>;

  // --- renderer -------------------------------------------------------------
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping ?? ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  // --- scene: neutral studio environment + one shadow-casting light --------
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const key = new DirectionalLight(0xffffff, 0.9);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 8; // soft, contact-style shadow edge
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key, key.target);

  const ground = new Mesh(new PlaneGeometry(1, 1), new ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const turntable = new Group(); // auto-rotate spins the part, so lighting stays put
  scene.add(turntable);

  const camera = new PerspectiveCamera(30, 1, 0.001, 100);
  camera.position.set(0, 0, 1); // never start on the orbit target: a zero-length orbit makes OrbitControls produce NaNs
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = opts.zoom;
  controls.enablePan = opts.pan;
  canvas.style.touchAction = 'pan-y'; // let vertical swipes scroll the page on phones

  // "Fat" lines: plain WebGL lines are always 1 device pixel, which is hair-thin on Retina
  // screens. LineMaterial draws edges at a fixed width in CSS pixels on any display.
  const edgeMaterial = new LineMaterial({ color: EDGE_COLOR, linewidth: opts.edgeWidth, transparent: true, opacity: 0.9 });
  const edgeLines: LineSegments2[] = [];
  const silhouettes: Silhouette[] = [];
  let edgesOn = opts.edges;

  // --- framing --------------------------------------------------------------
  const home = { position: new Vector3(), target: new Vector3() };
  let radius = 1;
  let framed = false;

  function frame() {
    const box = new Box3().setFromObject(turntable);
    const sphere = box.getBoundingSphere(new Sphere());
    radius = sphere.radius || 1;
    const center = sphere.center;
    // Fit the bounding sphere into the narrower of the vertical/horizontal field of view,
    // so a spinning part never clips (matters for the near-square hero viewer).
    const vFov = camera.fov * DEG;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (camera.aspect || 1));
    const distance = (radius / Math.sin(Math.min(vFov, hFov) / 2)) * 0.92;
    const theta = opts.theta * DEG;
    const phi = opts.phi * DEG;
    home.target.copy(center);
    home.position.set(
      center.x + distance * Math.sin(phi) * Math.sin(theta),
      center.y + distance * Math.cos(phi),
      center.z + distance * Math.sin(phi) * Math.cos(theta),
    );
    camera.near = distance / 100;
    camera.far = distance * 10;
    camera.updateProjectionMatrix();
    controls.minDistance = distance * 0.35;
    controls.maxDistance = distance * 3;
    framed = true;

    // Shadow catcher just under the part, light from above-front.
    ground.position.set(center.x, box.min.y - radius * 0.002, center.z);
    ground.scale.setScalar(radius * 4);
    key.position.set(center.x + radius * 0.25, center.y + radius * 5, center.z + radius * 0.5);
    key.target.position.copy(center);
    const s = key.shadow.camera;
    s.left = s.bottom = -radius * 2.2;
    s.right = s.top = radius * 2.2;
    s.near = radius * 0.5;
    s.far = radius * 10;
    s.updateProjectionMatrix();
    reset();
  }

  function reset() {
    camera.position.copy(home.position);
    controls.target.copy(home.target);
    turntable.rotation.y = 0;
    if (framed) controls.update();
    requestRender();
  }

  // --- loading --------------------------------------------------------------
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const loaded = new Promise<void>((resolve, reject) => {
    loader.load(
      opts.src,
      (gltf) => {
        const model = gltf.scene;
        // Collect meshes first: edge lines (LineSegments2) are meshes too, so adding them
        // while traversing would make the traversal visit and outline its own edges forever.
        const meshes: Mesh[] = [];
        model.traverse((obj) => {
          if ((obj as Mesh).isMesh) meshes.push(obj as Mesh);
        });
        meshes.forEach((mesh) => {
          mesh.castShadow = true;
          // Nudge faces back so edge lines draw cleanly on top of them.
          for (const m of ([] as Material[]).concat(mesh.material)) {
            m.polygonOffset = true;
            m.polygonOffsetFactor = 1;
            m.polygonOffsetUnits = 1;
            if (m instanceof MeshStandardMaterial) m.envMapIntensity = 1;
          }
          const edgeGeometry = new LineSegmentsGeometry().fromEdgesGeometry(new EdgesGeometry(mesh.geometry, EDGE_ANGLE));
          const lines = new LineSegments2(edgeGeometry, edgeMaterial);
          lines.raycast = () => {};
          lines.visible = opts.edges;
          mesh.add(lines);
          edgeLines.push(lines);
          const silhouette = buildSilhouette(mesh, edgeMaterial);
          if (silhouette) {
            silhouette.lines.visible = opts.edges;
            edgeLines.push(silhouette.lines);
            silhouettes.push(silhouette);
          }
        });
        // Center the part on the turntable axis.
        const box = new Box3().setFromObject(model);
        const c = box.getCenter(new Vector3());
        model.position.x -= c.x;
        model.position.z -= c.z;
        turntable.add(model);
        frame();
        // Compile shaders in the background (where supported) instead of freezing the page
        // on the first frame; render either way.
        renderer
          .compileAsync(scene, camera)
          .catch(() => {})
          .finally(() => {
            requestRender();
            opts.onProgress?.(1);
            resolve();
          });
      },
      (e) => {
        if (e.lengthComputable && e.total) opts.onProgress?.(Math.min(0.95, e.loaded / e.total));
      },
      (err) => reject(err),
    );
  });

  // --- render state (declared before anything can request a render) --------
  let autoRotate = opts.autoRotate;
  let lastInteraction = -Infinity;
  let visible = false;
  let rafId = 0;
  let last = performance.now();
  let dirty = true;

  // --- sizing ---------------------------------------------------------------
  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    edgeMaterial.resolution.set(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    requestRender();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  // --- animation: only while on screen --------------------------------------
  controls.addEventListener('start', () => (lastInteraction = Infinity));
  controls.addEventListener('end', () => (lastInteraction = performance.now()));
  controls.addEventListener('change', () => (dirty = true));

  function tick(now: number) {
    rafId = 0;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const spinning = autoRotate && now - lastInteraction > opts.rotateDelay;
    if (spinning) {
      turntable.rotation.y += opts.rotateSpeed * DEG * dt;
      dirty = true;
    }
    if (framed) controls.update(); // applies damping; fires 'change' while still moving
    if (dirty) {
      if (edgesOn && silhouettes.length) {
        scene.updateMatrixWorld();
        silhouettes.forEach((s) => updateSilhouette(s, camera.position));
      }
      renderer.render(scene, camera);
      dirty = false;
    }
    if (visible) rafId = requestAnimationFrame(tick);
  }
  function requestRender() {
    dirty = true;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      last = performance.now();
      requestRender();
    }
  }).observe(container);

  return {
    loaded,
    reset,
    setAutoRotate(on) {
      autoRotate = on;
      lastInteraction = -Infinity;
      requestRender();
    },
    setEdges(on) {
      edgesOn = on;
      edgeLines.forEach((l) => (l.visible = on));
      requestRender();
    },
    rotateBy(degrees) {
      turntable.rotation.y += degrees * DEG;
      lastInteraction = performance.now();
      requestRender();
    },
    zoomBy(factor) {
      if (!opts.zoom) return;
      const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
      const len = Math.min(Math.max(offset.length(), controls.minDistance), controls.maxDistance);
      camera.position.copy(controls.target).add(offset.setLength(len));
      controls.update();
      requestRender();
    },
    get turntableAngle() {
      return turntable.rotation.y / DEG;
    },
  };
}
