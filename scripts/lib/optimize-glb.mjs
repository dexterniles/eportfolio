// Shrinks a .glb for the web: removes duplicate data, then applies meshopt compression
// (which reorders and quantizes the geometry first). Visually identical, typically 70-85% smaller.
// The site's viewer decodes it with model-viewer's built-in meshopt decoder.
import { Logger, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';

let io;
async function getIO() {
  if (!io) {
    await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
    io = new NodeIO()
      .registerExtensions(ALL_EXTENSIONS)
      .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
  }
  return io;
}

/** True if the .glb is already meshopt-compressed. */
export function isCompressed(glb) {
  return Buffer.from(glb).includes('EXT_meshopt_compression');
}

/** Returns a compressed copy of a .glb buffer. */
export async function optimizeGlb(glb) {
  const io = await getIO();
  const doc = await io.readBinary(new Uint8Array(glb));
  doc.setLogger(new Logger(Logger.Verbosity.WARN)); // only surface real problems
  await doc.transform(dedup(), prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  return Buffer.from(await io.writeBinary(doc));
}
