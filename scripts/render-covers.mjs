// Renders the card/cover images for projects: 3D models through the site's own viewer (edge
// lines, contact shadow, default angle) and drawings from page 1 of their PDF, as 1200×800
// transparent PNGs that match the existing covers.
//
//   npm run covers                    render covers that don't exist yet
//   npm run covers -- v1003 c1001     only these projects (Markdown file names)
//   npm run covers -- --force         re-render even if the cover already exists
//
// Uses the dev server (started in the background if it isn't running) and headless Chromium
// (first time on a new computer: npx playwright install chromium).
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
const W = 1200, H = 800;
const force = process.argv.includes('--force');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--')).map((a) => a.toLowerCase());

// Every project with a model or a drawing PDF, and where its cover goes.
const projects = [];
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return walk(path);
    if (!/\.mdx?$/.test(e.name)) return;
    const front = readFileSync(path, 'utf8').split(/^---\s*$/m)[1] ?? '';
    const field = (k) => front.match(new RegExp(`^${k}:\\s*(.+?)\\s*$`, 'm'))?.[1].replace(/^['"]|['"]$/g, '');
    const name = basename(path).replace(/\.mdx?$/, '');
    const model = field('model'), pdf = field('pdf'), cover = field('cover');
    if (!model && !pdf) return;
    if (only.length && !only.includes(name.toLowerCase())) return;
    const out = resolve(dirname(path), cover ?? `./images/${name}.png`);
    projects.push({ name, path, model, pdf, out, coverSet: Boolean(cover) });
  });
walk('src/content/projects');

const todo = projects.filter((p) => force || !existsSync(p.out));
if (!todo.length) {
  console.log(only.length ? 'No matching projects with a model or drawing.' : 'Every cover exists. Use --force to re-render.');
  process.exit(0);
}

const up = () => fetch(BASE).then((r) => r.ok, () => false);
if (!(await up())) {
  console.log('Starting the dev server in the background…');
  execSync('npx astro dev --background', { stdio: 'inherit' });
  for (let i = 0; i < 60 && !(await up()); i++) await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.error('  page error:', e.message));

for (const p of todo) {
  // A plain same-origin page, so the dev server can serve the site's modules to it.
  await page.goto(`${BASE}/robots.txt`);
  await page.evaluate(({ W, H }) => {
    document.documentElement.style.background = 'transparent';
    document.body.style.cssText = 'margin:0;background:transparent';
    document.body.innerHTML = `<div id="stage" style="width:${W}px;height:${H}px;display:grid;place-items:center"></div>`;
  }, { W, H });

  if (p.model) {
    await page.evaluate(async (src) => {
      const { createCadViewer } = await import('/src/lib/cad-viewer.ts');
      const stage = document.getElementById('stage');
      stage.style.display = 'block';
      await createCadViewer(stage, { src, autoRotate: false, zoom: false, pan: false }).loaded;
    }, p.model);
    await page.waitForTimeout(1500); // shaders compile asynchronously and the camera eases into place
  } else {
    await page.evaluate(async ({ pdf, W, H }) => {
      const pdfjs = await import('/node_modules/pdfjs-dist/build/pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.mjs';
      const sheet = await (await pdfjs.getDocument({ url: pdf }).promise).getPage(1);
      // The sheet fills most of the frame, on white, with a soft drop shadow.
      const size = sheet.getViewport({ scale: 1 });
      const scale = Math.min((W * 0.78) / size.width, (H * 0.9) / size.height);
      const view = sheet.getViewport({ scale: scale * 2 }); // render at 2× for crisp linework
      const canvas = document.createElement('canvas');
      canvas.width = view.width;
      canvas.height = view.height;
      canvas.style.cssText = `width:${view.width / 2}px;height:${view.height / 2}px;background:#fff;box-shadow:6px 8px 18px rgb(0 0 0 / 0.22)`;
      document.getElementById('stage').append(canvas);
      await sheet.render({ canvas, canvasContext: canvas.getContext('2d'), viewport: view }).promise;
    }, { pdf: p.pdf, W, H });
  }

  mkdirSync(dirname(p.out), { recursive: true });
  await page.locator('#stage').screenshot({ path: p.out, omitBackground: true });
  console.log(`✓ ${relative('.', p.out)}`);
  if (!p.coverSet) console.log(`  add to ${relative('.', p.path)}:  cover: ./${relative(dirname(p.path), p.out).replace(/\\/g, '/')}`);
}

await browser.close();
