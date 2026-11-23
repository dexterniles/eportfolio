# Site improvements

What's still to do on the site. Check items off as they ship, with a dated note; finished items
are cleared out from time to time (the last cleanup was Nov 23 2026). What was done and why is in
the Git history (`git log`).

## CAD111 midterm portfolio (Week 8 grading matrix)

The Portfolio page is grouped by SolidWorks skill, with a 3–4 sentence reflection per group
(SolidWorks terms highlighted) and the competency tags from the first Portfolio assignment.
Assemblies must show exploded and collapsed views. Still open:

- [ ] **Final pass with Dexter on the reflections.** They're first drafts: check the features
      named in each group against what was actually used, including group E's (3D Sketch, Sketch
      Fillets, Swept Boss/Base, and Linear Pattern for the oven rack). Also confirm the C1000 mates.
      (Confirmed Nov 8: the arbor press uses SolidWorks' Rack and Pinion mechanical mate.)
- [ ] **Waiting on exports:** the metric drawing template, and other special models
      (configurations, design tables).
- [ ] **Template fixes in SolidWorks** (from the Nov 23 upload), then re-export the PDFs to the inbox:
  - The B template's revision table is empty and its REV box is blank; the A template has
    revision A (11/8/2026).
  - The A template's revision A row has no description (e.g. "Initial release").
  - Optional: the tolerance note says "ANSI Y14.5"; the current name is ASME Y14.5.
- [ ] **Drawings (later, Dexter's call):** CAD111-0002 to -0004. On the existing drawings, the
      SolidWorks fixes: re-save them on the new IPS template (it already has a revision table and
      spells "MATERIAL" right; the current sheets say "MATERAIL"), all-caps text, a section or detail
      view on CAD111-0001, and balloons on the C1000 exploded view.

## Content

- [ ] **Write-ups for 33 project pages.** Each has a `# Write-up still to add: …` line in its front
      matter: 29 CAD111 models, both assemblies, and both templates. Most CAD111 pages are a viewer
      and a spec table, which is the main reason they feel thinner than the CIS158 pages.

## Site

- [ ] **One layout for every project page.** Title, main media (3D model, drawing, or terminal),
      a facts box (the CAD spec table, or a CIS158 project's language, files, and unit), then the
      write-up under the same headings (Overview · How I built it · What I learned), then
      attachments. From the Nov 23 review; keep the current look.
- [ ] **Matching card covers.** Put CIS158's terminal covers on the same panel as the CAD renders,
      so cards on the two course pages look like a set.
- [ ] **Per-project share previews.** Use each project's cover as its link-preview image instead
      of the site-wide card.
- [ ] **Multi-sheet drawings on iPhone.** Embedded PDFs show only page 1 on iPhone. Fine for
      one-sheet drawings; switch to a page-by-page image view if a multi-sheet drawing is added.

## Tabled

- **Terminal covers and the C sample-run recorder** (`npm run transcript`). Rebuild them if new C
  projects come up; compiling them on this PC needs gcc and make (WSL). The current C project header
  images are 1200 px wide and slightly soft on 2×+ displays, and sharper ones need this tool.
- **three.js r187** (held back Nov 9): Context7's docs only go to r186, and three.js can break
  APIs in any release, so upgrade with the r187 migration notes.
- **TypeScript 7** (held back Nov 9): a new major version; confirm `@astrojs/check` and Astro's
  tooling work with it before upgrading.
