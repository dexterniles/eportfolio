// Builds public/og.png, the 1200×630 preview card shown when the site link is shared.
// Re-run after changing your name or program, or to feature a different model:  npm run og
import sharp from 'sharp';
import { site } from '../src/site.config.ts';

// Any transparent cover render works here.
const FEATURED = 'src/content/projects/cad111/models/images/pressure-plate.png';

const W = 1200, H = 630;
const paper = '#0b1f3f', line = '#6cd0ff', ink = '#e4efff', muted = '#9db4d6', hi = '#ffb454';

// Render area on the right side of the card
const rx = 600, ry = 120, rw = 540, rh = 360;
const render = await sharp(await sharp(FEATURED).trim().toBuffer()).resize(rw, rh, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

const grid = [];
for (let x = 0; x <= W; x += 24) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${line}" stroke-opacity="${x % 120 ? 0.06 : 0.13}"/>`);
for (let y = 0; y <= H; y += 24) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${line}" stroke-opacity="${y % 120 ? 0.06 : 0.13}"/>`);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const [first, ...rest] = site.name.split(' ');
const dimY = ry + rh + 30;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="${paper}"/>
  ${grid.join('')}
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${line}" stroke-width="2"/>
  <rect x="32" y="32" width="${W - 64}" height="${H - 64}" fill="none" stroke="${line}" stroke-opacity="0.5"/>

  <!-- FIG. 1 dimension line under the model -->
  <g stroke="${line}" stroke-width="2">
    <line x1="${rx + 40}" y1="${dimY - 8}" x2="${rx + 40}" y2="${dimY + 8}"/>
    <line x1="${rx + rw - 40}" y1="${dimY - 8}" x2="${rx + rw - 40}" y2="${dimY + 8}"/>
    <line x1="${rx + 40}" y1="${dimY}" x2="${rx + rw / 2 - 40}" y2="${dimY}"/>
    <line x1="${rx + rw / 2 + 40}" y1="${dimY}" x2="${rx + rw - 40}" y2="${dimY}"/>
  </g>
  <text x="${rx + rw / 2}" y="${dimY + 5}" text-anchor="middle" font-family="Menlo, monospace" font-size="15" letter-spacing="3" fill="${line}">FIG. 1</text>

  <text x="96" y="190" font-family="Menlo, monospace" font-size="18" letter-spacing="3" fill="${muted}">ENGINEERING TRANSFER · MECHANICAL</text>
  <text x="92" y="295" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="100" fill="${ink}">${esc(first)}</text>
  <text x="92" y="395" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="100" fill="${line}">${esc(rest.join(' '))}</text>
  <text x="96" y="450" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" fill="${muted}">e-Portfolio · CAD · Projects</text>

  <rect x="96" y="490" width="248" height="44" rx="4" fill="none" stroke="${hi}" stroke-width="2"/>
  <text x="220" y="519" text-anchor="middle" font-family="Menlo, monospace" font-size="16" letter-spacing="2" fill="${hi}">${esc(site.school.toUpperCase().replace(' COMMUNITY COLLEGE', ' CC'))}</text>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: render, left: rx, top: ry }])
  .png({ compressionLevel: 9 })
  .toFile('public/og.png');
console.log('Wrote public/og.png');
