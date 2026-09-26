// Builds public/og.png, the 1200×630 preview card shown when the site link is shared.
// Re-run after changing your name, program, or photo:  npm run og
import sharp from 'sharp';
import { site } from '../src/site.config.ts';

const W = 1200, H = 630;
const paper = '#0b1f3f', line = '#6cd0ff', ink = '#e4efff', muted = '#9db4d6', hi = '#ffb454';

const photo = await sharp('src/assets/dexter-niles.jpg')
  .resize(300, 375, { fit: 'cover', position: 'top' })
  .jpeg({ quality: 88 })
  .toBuffer();

const grid = [];
for (let x = 0; x <= W; x += 24) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${line}" stroke-opacity="${x % 120 ? 0.06 : 0.13}"/>`);
for (let y = 0; y <= H; y += 24) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${line}" stroke-opacity="${y % 120 ? 0.06 : 0.13}"/>`);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const [first, ...rest] = site.name.split(' ');
const px = 110, py = 128; // photo position

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="${paper}"/>
  ${grid.join('')}
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${line}" stroke-width="2"/>
  <rect x="32" y="32" width="${W - 64}" height="${H - 64}" fill="none" stroke="${line}" stroke-opacity="0.5"/>

  <!-- crop marks around the photo -->
  <path d="M${px - 10} ${py + 14} V${py - 10} H${px + 14}" fill="none" stroke="${line}" stroke-width="3"/>
  <path d="M${px + 310} ${py + 361} V${py + 385} H${px + 286}" fill="none" stroke="${line}" stroke-width="3"/>
  <!-- FIG. 1 dimension line -->
  <g stroke="${line}" stroke-width="2">
    <line x1="${px}" y1="${py + 405}" x2="${px}" y2="${py + 421}"/>
    <line x1="${px + 300}" y1="${py + 405}" x2="${px + 300}" y2="${py + 421}"/>
    <line x1="${px}" y1="${py + 413}" x2="${px + 112}" y2="${py + 413}"/>
    <line x1="${px + 188}" y1="${py + 413}" x2="${px + 300}" y2="${py + 413}"/>
  </g>
  <text x="${px + 150}" y="${py + 418}" text-anchor="middle" font-family="Menlo, monospace" font-size="15" letter-spacing="3" fill="${line}">FIG. 1</text>

  <text x="500" y="200" font-family="Menlo, monospace" font-size="18" letter-spacing="3" fill="${muted}">ENGINEERING TRANSFER · MECHANICAL</text>
  <text x="496" y="300" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="92" fill="${ink}">${esc(first)}</text>
  <text x="496" y="395" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="92" fill="${line}">${esc(rest.join(' '))}</text>
  <text x="500" y="450" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" fill="${muted}">e-Portfolio · CAD · Projects</text>

  <rect x="500" y="490" width="248" height="44" rx="4" fill="none" stroke="${hi}" stroke-width="2"/>
  <text x="624" y="519" text-anchor="middle" font-family="Menlo, monospace" font-size="16" letter-spacing="2" fill="${hi}">${esc(site.school.toUpperCase().replace(' COMMUNITY COLLEGE', ' CC'))}</text>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: photo, left: px, top: py }])
  .png({ compressionLevel: 9 })
  .toFile('public/og.png');
console.log('Wrote public/og.png');
