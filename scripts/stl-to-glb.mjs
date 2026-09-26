// Convert an STL export (SolidWorks or Fusion 360) into a .glb for the 3D viewer.
//
//   npm run stl2glb -- <input.stl> <output.glb> [hex color] [--z-up]
//   npm run stl2glb -- ~/Desktop/bracket.STL public/models/bracket.glb "#b8c0cc"
//
// SolidWorks exports Y-up, which matches the viewer. If a model shows up lying on its side
// (common with Z-up Fusion 360 setups), run it again with --z-up. Size doesn't matter, the viewer auto-frames.
import { readFileSync, writeFileSync } from 'node:fs';
import { buildGlb } from './lib/glb.mjs';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const zUp = process.argv.includes('--z-up');
const [input, output, hex = '#b8c0cc'] = args;
if (!input || !output) {
  console.error('Usage: npm run stl2glb -- <input.stl> <output.glb> [hex color] [--z-up]');
  process.exit(1);
}

const buf = readFileSync(input);
const tris = []; // flat list of 9 numbers per triangle

const isBinary = buf.length >= 84 && 84 + buf.readUInt32LE(80) * 50 === buf.length;
if (isBinary) {
  const n = buf.readUInt32LE(80);
  for (let i = 0; i < n; i++) {
    const o = 84 + i * 50 + 12; // skip the stored normal, it's often wrong
    for (let k = 0; k < 9; k++) tris.push(buf.readFloatLE(o + k * 4));
  }
} else {
  const text = buf.toString('utf8');
  for (const m of text.matchAll(/vertex\s+(\S+)\s+(\S+)\s+(\S+)/g)) tris.push(+m[1], +m[2], +m[3]);
}
if (tris.length === 0) {
  console.error('No triangles found. Is this an STL file?');
  process.exit(1);
}

// Z-up to glTF's Y-up: (x, y, z) -> (x, z, -y)
if (zUp) {
  for (let i = 0; i < tris.length; i += 3) {
    const y = tris[i + 1];
    tris[i + 1] = tris[i + 2];
    tris[i + 2] = -y;
  }
}

const positions = [];
const normals = [];
const indices = [];
for (let i = 0; i < tris.length; i += 9) {
  const [ax, ay, az, bx, by, bz, cx, cy, cz] = tris.slice(i, i + 9);
  const ux = bx - ax, uy = by - ay, uz = bz - az;
  const vx = cx - ax, vy = cy - ay, vz = cz - az;
  let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  const len = Math.hypot(nx, ny, nz) || 1;
  nx /= len; ny /= len; nz /= len;
  const base = positions.length / 3;
  positions.push(ax, ay, az, bx, by, bz, cx, cy, cz);
  normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
  indices.push(base, base + 1, base + 2);
}

const h = hex.replace('#', '');
const color = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
writeFileSync(output, buildGlb([{ name: 'Model', color, metallic: 0.4, roughness: 0.45, positions, normals, indices }]));
console.log(`Wrote ${output} (${tris.length / 9} triangles)`);
