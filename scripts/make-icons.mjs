// Builds the browser-tab icon, iPhone/Android home-screen icons, and web manifest from the
// themable master logo. Re-run after changing the logo:  npm run icons
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const master = readFileSync('src/assets/logo/dn-logo-master-themable.svg', 'utf8');

// Brand colors (from the logo files)
const NAVY = '#0b1f3f', BLUE = '#3b82f6', WHITE = '#ffffff', LIGHT_BLUE = '#9cc2ff';

// Swap the master's CSS variables for fixed colors.
const colored = (primary, accent) =>
  master
    .replace(/fill="var\(--dn-frame, var\(--dn-primary, #[0-9a-f]+\)\)"/i, `fill="${primary}"`)
    .replace(/fill="var\(--dn-primary, #[0-9a-f]+\)"/i, `fill="${primary}"`)
    .replace(/fill="var\(--dn-accent, #[0-9a-f]+\)"/i, `fill="${accent}"`);

// 1) Tab icon (SVG): navy on light tab bars, white on dark ones.
const favicon = master
  .replace(/fill="var\(--dn-frame, var\(--dn-primary, #[0-9a-f]+\)\)"/i, 'class="p"')
  .replace(/fill="var\(--dn-primary, #[0-9a-f]+\)"/i, 'class="p"')
  .replace(/fill="var\(--dn-accent, #[0-9a-f]+\)"/i, 'class="a"')
  .replace(
    /(<svg[^>]*>)/,
    `$1\n  <style>.p{fill:${NAVY}}.a{fill:${BLUE}}@media (prefers-color-scheme:dark){.p{fill:${WHITE}}.a{fill:${LIGHT_BLUE}}}</style>`,
  );
writeFileSync('public/favicon.svg', favicon);

// Logo on a solid square background, logo taking `scale` of the width.
async function tile(size, bg, primary, accent, scale) {
  const inner = Math.round(size * scale);
  const logo = await sharp(Buffer.from(colored(primary, accent)), { density: 600 }).resize(inner, inner).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: logo, left: Math.round((size - inner) / 2), top: Math.round((size - inner) / 2) }])
    .png({ compressionLevel: 9 });
}

// 2) PNG tab-icon backup for browsers without SVG favicons: navy logo on white, readable on any tab bar.
await (await tile(32, WHITE, NAVY, BLUE, 0.94)).toFile('public/favicon-32.png');

// 3) iPhone home screen (iOS fills transparency with black, so use a solid brand background).
await (await tile(180, NAVY, WHITE, LIGHT_BLUE, 0.7)).toFile('public/apple-touch-icon.png');

// 4) Android / installable icons (logo inside the 80% "maskable" safe zone).
await (await tile(192, NAVY, WHITE, LIGHT_BLUE, 0.7)).toFile('public/icon-192.png');
await (await tile(512, NAVY, WHITE, LIGHT_BLUE, 0.7)).toFile('public/icon-512.png');

writeFileSync(
  'public/site.webmanifest',
  JSON.stringify(
    {
      name: 'Dexter Niles · e-Portfolio',
      short_name: 'Dexter Niles',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
      theme_color: NAVY,
      background_color: NAVY,
      display: 'browser',
    },
    null,
    2,
  ) + '\n',
);

console.log('Wrote favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest');
