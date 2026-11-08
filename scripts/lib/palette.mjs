// Part colors for multi-part assemblies. Muted engineering colors that read on both the light
// (drafting paper) and dark (blueprint) themes and under the dark edge lines. Parts take them
// in part-number order; purchased hardware (screws, nuts, washers) all share HARDWARE.
export const PALETTE = [
  '#7f9cc4', // steel blue
  '#d8a24a', // amber
  '#4fa39a', // teal
  '#c06c55', // brick
  '#94b071', // sage
  '#9584c2', // violet
  '#cbb27f', // sand
  '#c98aa3', // rose
  '#6fb3cf', // sky
  '#a9a35a', // olive
];
export const HARDWARE = '#a3abb6';

export const hexToRgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.replace('#', '').slice(i, i + 2), 16) / 255);
