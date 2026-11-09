# Site improvements

Tracking list for the site, started in the October 2026 review. Check items off as they ship,
and add notes (date, what changed) under each one.

**Baseline (Lighthouse, live site, Oct 13 2026):** every page scores 100 for Performance,
Best Practices, and SEO, with LCP of 1.0–1.4 s. Accessibility is 100 everywhere except
CIS158 code pages at 97 (see item 10). Pages added since then haven't been measured.

**Next up (Nov 8 2026):** **17 (CAD111 midterm portfolio)**: drawings, templates, more parts, special models.

*Oct 13 2026: dropped "Preview image while 3D models load". Model compression made models
load fast enough that a placeholder image isn't needed.*

## Coursework assignments

- [x] **16. Portfolio page (CAD111 "update your e-Portfolio" assignment)**
  Best work in 3+ groups of 3+ examples, each with a narrative tied to the industry
  competencies and Bristol course outcomes.
  - *Done Oct 31 2026:* `/portfolio` page, built from `src/content/showcase/` (one Markdown file
    per group) and `src/data/competencies.ts`. Groups: Parametric Part Modeling, Components
    Designed to Fit, Engineering Drawings & Documentation. It's linked from the header and from a
    home-page teaser, and featured projects link back to their group. Added the C1000 assembly
    and CAD111-0001 drawings, and an Assembly row on every arbor press, vise, corkscrew, and
    C-clamp part. Submitted as https://dexterniles.vercel.app/portfolio.
- [ ] **17. CAD111 midterm portfolio (Week 8 grading matrix)**
  Regroup the Portfolio page by SolidWorks skill, with a 3–4 sentence reflection per group
  (SolidWorks terms highlighted), while keeping the competency tags from item 16. Assemblies
  must show exploded and collapsed views. Plan agreed Nov 8 2026:
  - [x] Skill groups: Sketching & Simple Features (14), Complex Features (7), Assemblies (1),
        Drawings & Templates (3). Configurations / 3D Sketching / Reverse Engineering waits on exports.
  - [x] Reflections with highlighted terms (highlighter tint), plus a one-line "why it matters" per group.
        **First drafts: features named in them still need checking against what was actually used.**
  - [x] Relax the 3-per-group rule to "at least 3 groups with 3+" (checked at build time)
  - [x] `npm run step2glb`: STEP AP214 → multi-part GLB via occt-import-js, one palette color per part
        number, hardware simplified (A1000: 84k → 44k triangles, 456 KB)
  - [x] Viewer: Explode/Collapse toggle (E key), dashed explode lines, per-part `explode:` and `view:`
        front matter, color key / BOM with part and McMaster-Carr links, hover to highlight
  - [x] A1000 Arbor Press assembly page (CAD111 → Assemblies), exploded cover
  - [x] C1000 C-Clamp assembly page (Nov 8): explodes like the drawing (screw out, pin up), with the
        C1000 drawing shown under the model; C1001–C1004 link to it
  - [x] `step2glb --split`: designed parts written as single-part models from the assembly (`--skip`
        for parts that aren't Dexter's). Added A1002–A1004 and A1006–A1008 pages (Rack, Pinion,
        Faceplate, Handle, Collar, Handle Knob) to the Simple and Complex Features groups. A1001 (Frame)
        was supplied by the instructor: no page of its own, credited in the A1000 parts key
  - [x] Drawing Templates section in CAD111 (hidden until templates are added)
  - [x] Light switch cover (SW28-W06-3DP03): recreated from a McMaster-Carr switch plate with
        Dexter's own sunburst decoration, and the oven rack (SW21W04SW03A, 3D sketch). New group
        **E · 3D Sketching & Reverse Engineering** (Nov 8)
  - [ ] Waiting on exports: A/B/metric templates, other special models (configurations, design
        tables). Received Nov 8: A1000 and C1000 STEP, light switch and oven rack STLs.
        `SW23A-W05-3DP02.STL` (a ghost figure) was uploaded by mistake for the oven rack; it's back
        in `inbox/models/`, not on the site
  - [ ] Later (Dexter's call, Nov 8): drawings (CAD111-0002 to -0004, and the SolidWorks fixes:
        revision "A" plus a revision block, the "MATERAIL" typo, all-caps text, a section or detail
        view on CAD111-0001, balloons on the C1000 exploded view)
  - Not doing: the V-series (V1001, V1002, V1004, V1005, V1009) and CS1001–CS1005 parts and the
    CS1000 / V1000 assemblies. Not built in class
  - [ ] Final pass with Dexter: part names A1002, A1003, A1006–A1008 (guessed from the model; fine for
        now), the C1000 mates, and the features named in the reflections (including group E's: 3D
        Sketch, Sketch Fillets, Swept Boss/Base, and Linear Pattern for the oven rack).
        Confirmed Nov 8: the arbor press uses SolidWorks' Rack and Pinion mechanical mate

## Tier 1: Big wins

- [x] **1. Vercel Analytics + Speed Insights**
  Visitor counts, referrers, and devices (no cookies, no consent banner), plus real
  load times from actual visitors.
  - *Done Oct 13 2026:* `@vercel/analytics` and `@vercel/speed-insights` added to
    `src/layouts/Base.astro`, so every page reports. Data starts flowing once both are enabled
    in the Vercel dashboard (project → Analytics → Enable, and Speed Insights → Enable).
- [x] **2. Smaller 3D model files**
  Compress `.glb` files (gltf-transform: meshopt + quantization).
  - *Done Oct 13 2026:* all 21 models compressed, **1,713 KB → 429 KB (−75%)**; Pressure Plate
    795 → 191 KB. `npm run stl2glb` compresses by default (`--no-compress` to skip), and
    `npm run compress-models` compresses anything in `public/models/` that isn't yet. The viewer
    decodes them with three.js's meshopt decoder (`src/lib/cad-viewer.ts`).
- [x] **3. Hide empty sections**
  Only show a course section (and its chip on the home card) once it has work.
  - *Done Oct 13 2026:* course pages and home cards only list sections with projects; section
    letters stay consecutive. Sections reappear automatically when work is added.
- [x] **4. Move content tools into the repo**
  The cover renders, terminal covers, and C sample-run recorder only existed in Claude's
  temporary scratchpad.
  - *Done Oct 31 2026 (covers):* the scratchpad tools were lost in the move to a new PC, so
    `npm run covers` (`scripts/render-covers.mjs`) was rebuilt with Playwright and pdf.js. It
    renders model covers through the site's own 3D viewer and drawing covers from page 1 of the
    PDF, as 1200×800 transparent PNGs that match the originals.
  - *Tabled:* terminal covers and the C sample-run recorder (`npm run transcript`). No new C
    projects are planned, and compiling them on this PC needs gcc and make (WSL).

## Tier 2: Medium

- [ ] **5. Per-project share previews**
  Use each project's cover as its link-preview image instead of the site-wide card.
- [x] **6. Smooth page transitions**
  - *Done Oct 13 2026:* the browser's built-in cross-page transitions (`@view-transition` in
    `global.css`) instead of Astro's client router, so every page still loads normally and
    nothing needs re-initializing. Off for reduced motion. Links prefetch on hover.
- [ ] **7. Organize the CAD111 Models grid**
  28 models in one run on the CAD111 page (Nov 8 2026). Group by assignment or skill with small
  headings, or add filter chips. (Item 17's skill groups cover this on the Portfolio page; the
  course page is the full archive.)
- [x] **8. Cache models and drawings**
  - *Done Nov 8 2026:* `vercel.json` sends `Cache-Control: public, max-age=86400` for `/models/*` and
    `/drawings/*`, so browsers keep them for a day (they were `max-age=0`). A model replaced at the
    same path can take up to a day to refresh for a returning visitor.
- [x] **9. SolidWorks-style edge lines**
  - *Done Oct 13 2026:* the `<model-viewer>` library was replaced by `src/lib/cad-viewer.ts`
    (three.js): feature edges at a 30° crease angle as fixed-width lines, studio lighting,
    soft contact shadow, turntable auto-spin, reset / pause / fullscreen / edges buttons, and
    keyboard controls (arrows, +/−, 0). Viewer JS 279 → 168 KB gzipped.
  - *Follow-up done Oct 13 2026:* silhouette lines on curved surfaces, recomputed as the part turns.
  - *Follow-up done Oct 22 2026:* touch rotation fixed on phones.

## Tier 3: Minor polish

- [x] **10. Code comment contrast in dark mode**
  Comments were 3.8:1 against the required 4.5:1 (the 97 accessibility score).
  - *Done Nov 8 2026:* dark-mode comments lightened from `#768390` to `#8b98a6` in `global.css`:
    measured 4.96:1 on the code background (light mode is 4.82:1).
- [x] **11. Footer tagline**
  "All dimensions in inches unless noted" contradicted the millimeter spec tables.
  - *Done Nov 8 2026:* now "do not scale drawing", the standard title-block note.
- [ ] **12. Spec table units**
  Pressure Plate is mm only; later parts show mm and inches; the CAD111-0001 drawing is in
  inches. Pick one style.
- [x] **13. Remove leftover code**
  The `placeholder` field and badge (no project uses it) and the `initials` setting in
  `src/site.config.ts` (unused since the logo replaced it).
  - *Done Nov 8 2026:* removed the `placeholder` schema field, the card badge, the project-page
    banner, and the home-page filter, plus the `initials` setting. No visible change.
- [ ] **14. Part names**
  CAD111-0001 to -0006 still have descriptive names (Stepped Channel Block, …).
  - *C-clamp parts done Oct 31 2026:* C1001–C1003 renamed from the C1000 assembly drawing's bill of
    materials (C-Clamp, C-Clamp - Screw, Clamp - Anvil).
- [ ] **15. Multi-sheet drawings on iPhone**
  Embedded PDFs show only page 1 on iPhone. Fine for one-sheet drawings; switch to a
  page-by-page image view if multi-sheet drawings are added.

## Maintenance log

- *Oct 31 2026:* moved development to a new Windows PC (Node.js LTS installed). `npm audit fix`
  cleared 6 vulnerabilities in build tools (patch and minor updates only).
- *Nov 8 2026:* docs refreshed (README, this list, HOW-TO-ADD-WORK, inbox README). `CLAUDE.md`
  now imports `AGENTS.md` (`@AGENTS.md`). Removed `.gitkeep` files from folders that have content.
