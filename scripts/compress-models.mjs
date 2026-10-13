// Compresses every .glb in public/models/ that isn't compressed yet (safe to re-run).
//   npm run compress-models
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { isCompressed, optimizeGlb } from './lib/optimize-glb.mjs';

const dir = 'public/models';
let before = 0, after = 0, done = 0;
for (const name of readdirSync(dir).filter((f) => f.endsWith('.glb'))) {
  const path = join(dir, name);
  const input = readFileSync(path);
  if (isCompressed(input)) continue;
  const output = await optimizeGlb(input);
  writeFileSync(path, output);
  before += input.length;
  after += output.length;
  done++;
  console.log(`${name.padEnd(28)} ${(input.length / 1024).toFixed(0).padStart(5)} KB → ${(output.length / 1024).toFixed(0).padStart(4)} KB`);
}
console.log(done ? `Compressed ${done} model(s): ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB` : 'All models already compressed.');
