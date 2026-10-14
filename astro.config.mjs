// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time, so links in the sitemap and
// share previews always point at the real domain. Set SITE_URL to override (e.g. a custom domain).
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [sitemap()],
  // The stylesheet is small; inlining it removes a render-blocking request.
  build: { inlineStylesheets: 'always' },
  // Fetch a page when a link is hovered or tapped, so the page transition starts right away.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Code blocks in write-ups use the same light/dark themes as the source viewer.
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' } } },
  vite: {
    plugins: [tailwindcss()],
    // three.js is imported lazily, so the dev server can't discover it up front. Without this,
    // the first visit to a 3D page can get a 504 "Outdated Optimize Dep" and the viewer never loads.
    optimizeDeps: {
      include: [
        'three',
        'three/examples/jsm/loaders/GLTFLoader.js',
        'three/examples/jsm/controls/OrbitControls.js',
        'three/examples/jsm/environments/RoomEnvironment.js',
        'three/examples/jsm/libs/meshopt_decoder.module.js',
        'three/examples/jsm/lines/LineSegments2.js',
        'three/examples/jsm/lines/LineSegmentsGeometry.js',
        'three/examples/jsm/lines/LineMaterial.js',
      ],
    },
    // The 3D viewer (three.js) is ~170 KB gzipped and only loads on pages with a model.
    build: { chunkSizeWarningLimit: 1200 },
  },
});
