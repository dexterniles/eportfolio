// Minimal binary glTF (.glb) writer. Each part becomes one mesh primitive with its own material.
// part: { name, color: [r,g,b], metallic?, roughness?, positions: number[], normals: number[], indices: number[] }

const pad4 = (b, fill = 0) => Buffer.concat([b, Buffer.alloc((4 - (b.length % 4)) % 4, fill)]);
const f32 = (a) => Buffer.from(new Float32Array(a).buffer);
const u32 = (a) => Buffer.from(new Uint32Array(a).buffer);

export function buildGlb(parts) {
  const chunks = [];
  const bufferViews = [];
  const accessors = [];
  let offset = 0;
  const addView = (buf, target) => {
    const padded = pad4(buf);
    bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: buf.length, target });
    chunks.push(padded);
    offset += padded.length;
    return bufferViews.length - 1;
  };

  const meshes = [];
  const materials = [];
  parts.forEach((p, i) => {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let j = 0; j < p.positions.length; j++) {
      const k = j % 3;
      if (p.positions[j] < min[k]) min[k] = p.positions[j];
      if (p.positions[j] > max[k]) max[k] = p.positions[j];
    }
    accessors.push({ bufferView: addView(f32(p.positions), 34962), componentType: 5126, count: p.positions.length / 3, type: 'VEC3', min, max });
    accessors.push({ bufferView: addView(f32(p.normals), 34962), componentType: 5126, count: p.normals.length / 3, type: 'VEC3' });
    accessors.push({ bufferView: addView(u32(p.indices), 34963), componentType: 5125, count: p.indices.length, type: 'SCALAR' });
    materials.push({
      name: `${p.name} material`,
      doubleSided: true,
      pbrMetallicRoughness: {
        baseColorFactor: [...p.color, 1],
        metallicFactor: p.metallic ?? 0.3,
        roughnessFactor: p.roughness ?? 0.5,
      },
    });
    meshes.push({ name: p.name, primitives: [{ attributes: { POSITION: i * 3, NORMAL: i * 3 + 1 }, indices: i * 3 + 2, material: i }] });
  });

  const bin = Buffer.concat(chunks);
  const gltf = {
    asset: { version: '2.0', generator: 'eportfolio scripts/lib/glb.mjs' },
    scene: 0,
    scenes: [{ nodes: parts.map((_, i) => i) }],
    nodes: parts.map((p, i) => ({ name: p.name, mesh: i })),
    meshes,
    materials,
    buffers: [{ byteLength: bin.length }],
    bufferViews,
    accessors,
  };

  const json = pad4(Buffer.from(JSON.stringify(gltf)), 0x20);
  const chunk = (type, data) => {
    const h = Buffer.alloc(8);
    h.writeUInt32LE(data.length, 0);
    h.writeUInt32LE(type, 4);
    return Buffer.concat([h, data]);
  };
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // "glTF"
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + json.length + 8 + bin.length, 8);
  return Buffer.concat([header, chunk(0x4e4f534a, json), chunk(0x004e4942, bin)]);
}
