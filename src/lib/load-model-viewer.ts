// Loads the 3D viewer (model-viewer + three.js) once the page has finished loading and gone idle,
// so text and images appear first and the page stays responsive while it starts up.
// Shared by the project-page viewer and the home-page hero model.

let started = false;

export function loadModelViewerWhenIdle() {
  if (started) return;
  started = true;

  // Our models are meshopt-compressed (see scripts/lib/optimize-glb.mjs). model-viewer only
  // enables its built-in meshopt decoder when a decoder location is set before it loads;
  // it loads that URL as a script, then uses the decoder already bundled with it.
  const w = window as unknown as { ModelViewerElement?: Record<string, unknown> };
  w.ModelViewerElement = { ...w.ModelViewerElement, meshoptDecoderLocation: '/vendor/meshopt-decoder-ready.js' };

  const load = () => import('@google/model-viewer');
  const whenIdle = (fn: () => void) =>
    'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 300);
  if (document.readyState === 'complete') whenIdle(load);
  else addEventListener('load', () => whenIdle(load), { once: true });
}
