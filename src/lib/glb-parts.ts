// Reads an assembly's part list straight from its .glb at build time, so the color key under the
// 3D viewer is in the page's HTML (no layout shift when the model loads). The part number, color,
// and description live in each node's `extras`, written by scripts/step-to-glb.mjs. The glTF JSON
// chunk isn't compressed, so this is a cheap read.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface GlbPart {
  part: string;
  color: string;
  count: number;
  label?: string;
  vendor?: string;
}

/** Parts of a multi-part model in /public (e.g. "/models/a1000.glb"); empty for a single part. */
export function readGlbParts(src: string): GlbPart[] {
  let json: { nodes?: { extras?: Partial<GlbPart> }[] };
  try {
    const glb = readFileSync(join(process.cwd(), 'public', src));
    json = JSON.parse(glb.subarray(20, 20 + glb.readUInt32LE(12)).toString('utf8'));
  } catch {
    return [];
  }
  const parts = new Map<string, GlbPart>();
  for (const { extras } of json.nodes ?? []) {
    if (!extras?.part || !extras.color) continue;
    const known = parts.get(extras.part);
    if (known) known.count++;
    else parts.set(extras.part, { part: extras.part, color: extras.color, count: 1, label: extras.label, vendor: extras.vendor });
  }
  if (parts.size < 2) return [];
  return [...parts.values()].sort((a, b) => a.part.localeCompare(b.part, undefined, { numeric: true }));
}
