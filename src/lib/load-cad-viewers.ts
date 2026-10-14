// Starts every 3D viewer on the page once it has finished loading and gone idle, so text and
// images appear first. three.js is only downloaded on pages that have a viewer.
//
// Markup: <div data-cad-viewer data-src="/models/x.glb" ...options> (see the data-* reads below).
// Each element gets `cadViewer` (the controller) and fires a `cad-viewer-ready` event.
import type { CadViewer } from './cad-viewer';

export type CadViewerElement = HTMLElement & { cadViewer?: CadViewer };

let started = false;

export function loadCadViewersWhenIdle() {
  if (started) return;
  started = true;

  const start = async () => {
    const { createCadViewer } = await import('./cad-viewer');
    document.querySelectorAll<CadViewerElement>('[data-cad-viewer]').forEach((el) => {
      if (el.cadViewer) return;
      const d = el.dataset;
      const num = (v: string | undefined) => (v === undefined ? undefined : Number(v));
      const bar = el.querySelector<HTMLElement>('[data-progress]');
      const viewer = createCadViewer(el, {
        src: d.src!,
        zoom: d.zoom !== 'false',
        pan: d.pan !== 'false',
        autoRotate: d.autoRotate !== 'false',
        rotateSpeed: num(d.rotateSpeed),
        rotateDelay: num(d.rotateDelay),
        theta: num(d.theta),
        phi: num(d.phi),
        edges: d.edges !== 'false',
        onProgress: (p) => {
          if (!bar) return;
          bar.style.width = `${p * 100}%`;
          bar.parentElement!.style.opacity = p >= 1 ? '0' : '1';
        },
      });
      el.cadViewer = viewer;
      viewer.loaded
        .then(() => {
          el.dataset.loaded = 'true';
          el.dispatchEvent(new CustomEvent('cad-viewer-ready', { detail: viewer }));
        })
        .catch((err) => {
          console.error('3D model failed to load', d.src, err);
          el.dataset.loaded = 'error';
        });
    });
  };

  const whenIdle = (fn: () => void) =>
    'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 300);
  if (document.readyState === 'complete') whenIdle(start);
  else addEventListener('load', () => whenIdle(start), { once: true });
}
