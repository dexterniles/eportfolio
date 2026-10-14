# Site improvements

Tracking list from the October 2026 review. Check items off as they ship, and add notes
(commit, date, what changed) under each one.

**Baseline (Lighthouse, live site, Oct 13 2026):** every page scores 100 for Performance,
Best Practices, and SEO, with LCP of 1.0–1.4 s. Accessibility is 100 everywhere except
CIS158 code pages at 97 (see item 10).

**Suggested order:** 1 → 2 → 3 → 4 → 10 (highest impact for the effort). Next up: **4 → 10**.

*Oct 13 2026: dropped "Preview image while 3D models load". Model compression made models
load fast enough that a placeholder image isn't needed.*

## Tier 1: Big wins

- [x] **1. Vercel Analytics + Speed Insights**
  Visitor counts, referrers, and devices (no cookies, no consent banner), plus real
  load times from actual visitors. Add the two packages to the layout, then turn both
  on in the Vercel dashboard.
  - *Done Oct 13 2026:* `@vercel/analytics` 2.0.1 and `@vercel/speed-insights` 2.0.0 added to
    `src/layouts/Base.astro`, so every page reports. Data starts flowing once both are enabled
    in the Vercel dashboard (project → Analytics → Enable, and Speed Insights → Enable).
- [x] **2. Smaller 3D model files**
  Compress `.glb` files (gltf-transform: meshopt + quantization). Models total 1.7 MB
  today; the Pressure Plate alone is 795 KB. Expect a 70–85% reduction. Build it into
  `npm run stl2glb` so future models are compressed automatically.
  - *Done Oct 13 2026:* all 21 models compressed, **1,713 KB → 429 KB (−75%)**; Pressure Plate
    795 → 191 KB. All pass the glTF validator; before/after renders are visually identical.
    `npm run stl2glb` now compresses by default (`--no-compress` to skip), and
    `npm run compress-models` compresses anything in `public/models/` that isn't yet.
    Both viewers share `src/lib/load-model-viewer.ts`, which turns on the meshopt decoder.
- [x] **3. Hide empty sections**
  Only show a course section (and its chip on the home card) once it has work, so
  CAD111 doesn't show "Nothing posted here yet" for Assemblies and Design Project.
  - *Done Oct 13 2026:* course pages and home cards only list sections with projects; section
    letters stay consecutive (CAD111 is now A · Models, B · Drawings). Sections reappear
    automatically when work is added.
- [ ] **4. Move content tools into the repo**
  The cover renders, terminal covers, and C sample-run recorder only exist in Claude's
  temporary scratchpad. Add them as `npm run covers` / `npm run transcript` so new
  content can be added repeatably.

## Tier 2: Medium

- [ ] **5. Per-project share previews**
  Use each project's cover as its link-preview image instead of the site-wide card.
- [x] **6. Smooth page transitions**
  Astro View Transitions between pages. Requires the 3D viewer, code tabs, and copy
  buttons to re-initialize after each transition.
  - *Done Oct 13 2026:* used the browser's built-in cross-page transitions
    (`@view-transition` in `global.css`) instead of Astro's client router. Every page still
    loads normally, so nothing needs re-initializing. The header stays put while the content
    fades and slides in. Off for reduced motion; older browsers load pages as before. Links
    also prefetch on hover so the transition starts right away.
- [ ] **7. Organize the CAD111 Models grid**
  21 models in one run. Group by assignment (M01, M02A, M02B, M03A, …) with small
  headings, or add filter chips.
- [ ] **8. Cache models and drawings**
  `.glb` and `.pdf` files are served with `max-age=0`. Add `vercel.json` headers so
  browsers keep them for a day.
- [x] **9. SolidWorks-style edge lines (bigger project)**
  A custom Three.js viewer that draws black feature edges over the shading, like
  "Shaded with Edges". Most distinctive upgrade, most work.
  - *Done Oct 13 2026:* model-viewer replaced by `src/lib/cad-viewer.ts` (three.js 0.186):
    feature edges at a 30° crease angle drawn as fixed-width lines (crisp on Retina),
    studio environment lighting, soft contact shadow, turntable auto-spin, reset / pause /
    fullscreen, a new edges on/off button, and keyboard controls (arrows, +/−, 0).
    Viewer JS 279 → 168 KB gzipped. Shaders compile asynchronously, so the home page still
    scores 99 for performance. All 21 model thumbnails and the share card were re-rendered
    with the new viewer.
  - *Follow-up done Oct 13 2026:* silhouette lines on curved surfaces (the sides of
    cylinders), recomputed as the part turns. Thumbnails and share card re-rendered again.

## Tier 3: Minor polish

- [ ] **10. Code comment contrast in dark mode**
  Comments are 3.8:1 against the required 4.5:1 (the 97 accessibility score). One CSS line.
- [ ] **11. Footer tagline**
  "All dimensions in inches unless noted" contradicts the millimeter spec tables.
- [ ] **12. Spec table units**
  Pressure Plate is mm only; later parts show mm and inches. Pick one style.
- [ ] **13. Remove leftover code**
  The unused `placeholder` field/badge and the `initials` setting (replaced by the logo).
- [ ] **14. Part names**
  CAD111-0001 to -0006 and C1001–C1003 still have descriptive placeholder names.
  Rename them to the course names.
- [ ] **15. Multi-sheet drawings on iPhone**
  Embedded PDFs show only page 1 on iPhone. Fine for one-sheet drawings; switch to a
  page-by-page image view if multi-sheet drawings are added.
