// Convert a STEP assembly (SolidWorks: File → Save As → STEP AP214) into a multi-part .glb for the
// 3D viewer: every placed component keeps its own position, so the viewer can explode it, and each
// part number gets its own color from scripts/lib/palette.mjs (purchased hardware shares one).
//
//   npm run step2glb -- <input.step> <output.glb> [--color A1005=#d8a24a] [--hardware-error 0.02] [--no-compress]
//   npm run step2glb -- "cad/A1000 - Assembly.STEP" public/models/a1000.glb
//
// Purchased hardware (vendor models often have real threads) is simplified to within
// --hardware-error of its own size (default 2%), which keeps the file small; at the size an
// assembly shows on screen, thread detail is smaller than a pixel. Designed parts aren't touched.
//
// --split <dir> also writes each designed part on its own (<dir>/<part>.glb, the same look as an
// STL-converted part), so parts that only live inside an assembly get their own model without a
// separate export. Parts that already have a model are skipped unless --force is given, and
// --skip leaves out parts that aren't yours (e.g. ones supplied by an instructor); the sizes
// printed are for the spec table on each part's page.
//   npm run step2glb -- "cad/A1000 - Assembly.STEP" public/models/a1000.glb --split public/models --skip A1001
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { MeshoptSimplifier } from 'meshoptimizer';
import { buildGlb } from './lib/glb.mjs';
import { optimizeGlb } from './lib/optimize-glb.mjs';
import { HARDWARE, PALETTE, hexToRgb } from './lib/palette.mjs';

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(name);
  return i === -1 ? undefined : argv.splice(i, 2)[1];
};
const colorOverrides = [];
for (let c; (c = flag('--color')); ) colorOverrides.push(c.split('='));
const hardwareError = Number(flag('--hardware-error') ?? 0.02);
const splitDir = flag('--split');
const skip = new Set((flag('--skip') ?? '').toUpperCase().split(',').filter(Boolean));
const force = argv.includes('--force');
const compress = !argv.includes('--no-compress');
const [input, output] = argv.filter((a) => !a.startsWith('--'));
if (!input || !output) {
  console.error('Usage: npm run step2glb -- <input.step> <output.glb> [--color PART=#hex] [--split <dir> [--skip PART,PART] [--force]] [--hardware-error 0.02] [--no-compress]');
  process.exit(1);
}

const occt = await createRequire(import.meta.url)('occt-import-js')();
const result = occt.ReadStepFile(new Uint8Array(readFileSync(input)), {
  linearUnit: 'millimeter',
  linearDeflectionType: 'bounding_box_ratio', // detail scales with each part's size
  linearDeflection: 0.001,
  angularDeflection: 0.5,
});
if (!result.success) {
  console.error('Could not read the STEP file.');
  process.exit(1);
}

// SolidWorks component names: "A1005", "a1009", "A1004 - Faceplate" (part + description), or
// "A1010_91744A537" (part + McMaster-Carr number, i.e. purchased hardware).
function identify(name) {
  const m = name.trim().match(/^([A-Za-z]*\d[\w-]*?)(?:_(\w+)|\s+-\s+(.+))?$/);
  if (!m) return { part: name.trim() || 'Part' };
  return { part: m[1].toUpperCase(), ...(m[2] && { vendor: m[2] }), ...(m[3] && { label: m[3] }) };
}

// Every node that holds meshes is one placed component (an instance). Its meshes are already in
// assembly coordinates, so they're merged as-is.
const instances = [];
(function walk(node) {
  if (node.meshes.length) {
    const positions = [], normals = [], indices = [];
    for (const mi of node.meshes) {
      const mesh = result.meshes[mi];
      const base = positions.length / 3;
      // Plain loops: spreading arrays this large into push() overflows the call stack.
      for (const v of mesh.attributes.position.array) positions.push(v);
      for (const v of mesh.attributes.normal.array) normals.push(v);
      for (const i of mesh.index.array) indices.push(base + i);
    }
    instances.push({ ...identify(node.name), positions, normals, indices });
  }
  node.children.forEach(walk);
})(result.root);

// Simplify purchased hardware, then drop the vertices the simplified triangles no longer use.
await MeshoptSimplifier.ready;
for (const p of instances.filter((q) => q.vendor)) {
  const [kept] = MeshoptSimplifier.simplify(new Uint32Array(p.indices), new Float32Array(p.positions), 3, 0, hardwareError);
  const remap = new Map();
  const positions = [], normals = [];
  p.indices = Array.from(kept, (i) => {
    if (!remap.has(i)) {
      remap.set(i, remap.size);
      positions.push(p.positions[i * 3], p.positions[i * 3 + 1], p.positions[i * 3 + 2]);
      normals.push(p.normals[i * 3], p.normals[i * 3 + 1], p.normals[i * 3 + 2]);
    }
    return remap.get(i);
  });
  p.positions = positions;
  p.normals = normals;
}

// Colors: designed parts take the palette in part-number order; hardware shares one gray.
const designed = [...new Set(instances.filter((p) => !p.vendor).map((p) => p.part))].sort();
const colors = new Map(designed.map((part, i) => [part, PALETTE[i % PALETTE.length]]));
for (const [part, hex] of colorOverrides) colors.set(part.toUpperCase(), hex);
const colorOf = (p) => colors.get(p.part) ?? HARDWARE;

const raw = buildGlb(
  instances.map((p) => ({
    name: p.part,
    color: hexToRgb(colorOf(p)),
    metallic: p.vendor ? 0.6 : 0.3,
    roughness: p.vendor ? 0.4 : 0.5,
    positions: p.positions,
    normals: p.normals,
    indices: p.indices,
    extras: { part: p.part, ...(p.vendor && { vendor: p.vendor }), ...(p.label && { label: p.label }), color: colorOf(p) },
  })),
);
const glb = compress ? await optimizeGlb(raw) : raw;
writeFileSync(output, glb);

const counts = new Map();
instances.forEach((p) => counts.set(p.part, (counts.get(p.part) ?? 0) + 1));
const triangles = instances.reduce((n, p) => n + p.indices.length / 3, 0);
console.log(`Wrote ${output}: ${counts.size} parts, ${instances.length} placed, ${triangles} triangles, ${(glb.length / 1024).toFixed(0)} KB${compress ? ` (from ${(raw.length / 1024).toFixed(0)} KB)` : ''}`);
for (const [part, n] of [...counts].sort()) {
  const p = instances.find((q) => q.part === part);
  console.log(`  ${colorOf(p)}  ${part.padEnd(8)} ×${n}${p.vendor ? `  McMaster-Carr ${p.vendor}` : ''}${p.label ? `  ${p.label}` : ''}`);
}

// --split: each designed part on its own, from its first placed copy.
if (splitDir) {
  console.log(`\nSingle parts in ${splitDir}:`);
  for (const part of designed) {
    const p = instances.find((q) => q.part === part);
    const out = join(splitDir, `${part.toLowerCase()}.glb`);
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    p.positions.forEach((v, i) => {
      min[i % 3] = Math.min(min[i % 3], v);
      max[i % 3] = Math.max(max[i % 3], v);
    });
    const mm = min.map((v, k) => max[k] - v);
    const size = `${mm.map((v) => v.toFixed(1)).join(' × ')} mm (${mm.map((v) => (v / 25.4).toFixed(2)).join(' × ')} in)`;
    if (skip.has(part)) {
      console.log(`  ${part.padEnd(8)} skipped (--skip)`);
      continue;
    }
    if (existsSync(out) && !force) {
      console.log(`  ${part.padEnd(8)} skipped, ${out} exists  ·  ${size}`);
      continue;
    }
    // Same color and finish as scripts/stl-to-glb.mjs, so it matches the other single-part models.
    const single = buildGlb([{ name: 'Model', color: hexToRgb('#b8c0cc'), metallic: 0.4, roughness: 0.45, positions: p.positions, normals: p.normals, indices: p.indices }]);
    writeFileSync(out, compress ? await optimizeGlb(single) : single);
    console.log(`  ${part.padEnd(8)} wrote ${out}  ·  ${size}`);
  }
}
