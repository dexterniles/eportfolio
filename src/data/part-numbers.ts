// The official CAD111 part number list: every part number and its name, compiled from the course's
// assignment drawings, assembly BOMs, and assignment text (CAD111_Part_Number_List.pdf, Nov 2026).
// Use these names for page titles ("A1003 · Pinion Shaft"). The assembly parts key also uses them for
// parts without a page of their own (the downloaded frame, purchased hardware).
//
// Projects without a part number (the oven rack, the light switch cover, the SolidWorks tutorials)
// just use their names.

export interface PartNumber {
  part: string;
  name: string;
  note?: string; // from the list's discrepancy notes
}

export interface PartFamily {
  assembly: string; // the family's assembly or group, e.g. "A1000: Arbor Press"
  parts: PartNumber[];
}

export const partFamilies: PartFamily[] = [
  {
    assembly: 'A1000: Arbor Press',
    parts: [
      { part: 'A1000', name: 'Arbor Press' },
      {
        part: 'A1001',
        name: 'Arbor Press Frame (downloaded model)',
        note: 'Supplied by the instructor (a downloaded model is allowed), so it has no drawing and no page of its own. The name comes from the A1000 BOM.',
      },
      { part: 'A1002', name: 'Ram' },
      { part: 'A1003', name: 'Pinion Shaft' },
      { part: 'A1004', name: 'Face Plate' },
      { part: 'A1005', name: 'Press Plate' },
      { part: 'A1006', name: 'Lever Arm' },
      { part: 'A1007', name: 'Collar' },
      { part: 'A1008', name: 'Handle Cap' },
      { part: 'A1009', name: 'Gibb Plate' },
      { part: 'A1010', name: '1/4-20UNC-2A x 1/2L Flanged Thumbscrew' },
      { part: 'A1011', name: 'Ø1/4 x 7/8L Half Groove Dowel Pin' },
      { part: 'A1012', name: '1/4-20UNC-2A x 7/8L Hex Head Cap Screw' },
      { part: 'A1013', name: '#10-32 x 5/8 Hex Socket Flat Point Set Screw' },
      { part: 'A1014', name: '#10-32 x 3/16 Hex Socket Flat Point Set Screw' },
      { part: 'A1015', name: '#10-32 Hex Jam Nut' },
    ],
  },
  {
    assembly: 'C1000: Clamp - 4"',
    parts: [
      { part: 'C1000', name: 'Clamp - 4"' },
      { part: 'C1001', name: 'C-Clamp' },
      { part: 'C1002', name: 'C-Clamp - Screw' },
      { part: 'C1003', name: 'C-Clamp - Anvil' },
      { part: 'C1004', name: 'C-Clamp - Pin' },
    ],
  },
  {
    assembly: 'CS1000: Corkscrew',
    parts: [
      { part: 'CS1000', name: 'Cork Screw' },
      { part: 'CS1001', name: 'Housing' },
      { part: 'CS1002', name: 'Shaft' },
      {
        part: 'CS1003',
        name: 'Handle',
        note: 'Qty 1, the top handle. CS1003 and CS1004 are both "Handle" in the CS1000 BOM; consider "Top" and "Side" to tell them apart.',
      },
      { part: 'CS1004', name: 'Handle', note: 'Qty 2, the side levers. See CS1003.' },
      { part: 'CS1005', name: 'Screw' },
      { part: 'CS1006', name: 'Pin Cap' },
      { part: 'CS1007', name: 'Pin' },
    ],
  },
  {
    assembly: 'V1000: Machinist Vice',
    parts: [
      { part: 'V1000', name: 'Machinist Vice' },
      {
        part: 'V1001',
        name: 'Vice Base',
        note: 'The drawing\'s title field is blank and its DWG. NO. reads "V1001 NEW"; the name comes from the V1000 BOM.',
      },
      { part: 'V1002', name: 'Movable Jaw' },
      { part: 'V1003', name: 'Jaw Plate', note: 'Rev A and Rev B.' },
      { part: 'V1004', name: 'Screw (Vise Screw)' },
      {
        part: 'V1005',
        name: 'Threaded Bushing',
        note: 'The part drawing is titled "Collar" but the V1000 BOM says "Threaded Bushing"; use one name in both places.',
      },
      { part: 'V1006', name: 'C Clip' },
      { part: 'V1007', name: 'Pin' },
      { part: 'V1008', name: 'Balls' },
      {
        part: 'V1009',
        name: 'Jaw Guides',
        note: 'The part drawing is titled "Slide Key" but the V1000 BOM says "Jaw Guides"; use one name in both places.',
      },
      { part: 'V1010', name: '#12-24UNC-2A x 3/4L Flat Point Set Screw' },
      { part: 'V1011', name: '1/4-20 Flat Head Countersink Machine Screw (82°, McMaster-Carr)' },
      { part: 'V1012', name: '#000 Taper Pin x 1/2" Long (McMaster-Carr)' },
    ],
  },
  {
    assembly: 'CAD111 standalone parts',
    parts: [
      { part: 'CAD111-0001', name: 'Block' },
      { part: 'CAD111-0002', name: 'Block' },
      { part: 'CAD111-0003', name: 'Plate 56mm x 22mm' },
      { part: 'CAD111-0004', name: 'Arm' },
      { part: 'CAD111-0005', name: 'Block' },
      { part: 'CAD111-0006', name: 'L Bracket (Rev B)' },
    ],
  },
];

const byPart = new Map(partFamilies.flatMap((f) => f.parts).map((p) => [p.part, p]));

/** The official name for a part number ("A1003" → "Pinion Shaft"), or undefined if it isn't on the list. */
export const partName = (part: string) => byPart.get(part.toUpperCase())?.name;
