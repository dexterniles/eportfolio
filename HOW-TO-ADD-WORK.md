# How to add work to the e-Portfolio

Each project is one Markdown file in `src/content/projects/<course>/<section>/`.
The file name becomes the URL: `src/content/projects/cad111/models/gear.md` → `/cad111/models/gear`.

## 1. Copy the template

Copy [`templates/project.md`](templates/project.md) into the right folder, for example
`src/content/projects/cad111/models/spur-gear.md` (create the folder if it doesn't exist yet), then fill it in.
It includes suggested headings for each section.

After adding a new file or folder, restart the dev server (`npx astro dev stop`, then `npm run dev`) so the page shows up.

## 2. Fill in the front matter

```yaml
---
title: Spur Gear
course: cad111
section: models          # a section slug from src/data/courses.ts (e.g. models, drawings, c-projects)
summary: One or two sentences shown on the card and at the top of the page.
software: SolidWorks     # optional, defaults to the course's software
model: /models/spur-gear.glb        # optional 3D model (see step 3)
pdf: /drawings/spur-gear.pdf        # optional drawing PDF (see step 4)
cover: ./images/spur-gear.png       # optional card/header image, path relative to this .md file
coverAlt: Rendered spur gear with 24 teeth
gallery:                            # optional extra images
  - src: ./images/gear-sketch.png
    alt: Fully defined sketch of the gear profile
order: 3                 # position within the section (lower comes first)
---

Write-up goes here in Markdown. Use `## Headings`, lists, **bold**, tables, and links.
```

Every image needs `alt` text describing it, for visitors using screen readers.

## 3. Add a 3D model (.glb)

The viewer needs a `.glb` file in `public/models/`. The dependable route from either program is **STL → GLB**:

### SolidWorks
1. Open the part or assembly.
2. **File → Save As**, set *Save as type* to **STL (\*.stl)**, then click **Options…**
   - Output as: **Binary**
   - Resolution: **Fine** (use Custom and a coarser setting if the file is huge)
   - For assemblies, check **Save all components of an assembly in a single file**
3. Save, then convert it (from the `eportfolio` folder):
   ```sh
   npm run stl2glb -- ~/Desktop/Bracket.STL public/models/bracket.glb "#b8c0cc"
   ```
   The last value is the model's color (any hex color, optional).

### Fusion 360
1. In the browser tree, right-click the body or component → **Save As Mesh** (or **File → Export** and choose STL).
2. Format **STL (Binary)**, Refinement **High**.
3. Convert it the same way:
   ```sh
   npm run stl2glb -- ~/Downloads/Bracket.stl public/models/bracket.glb "#e8590c"
   ```
   If the model shows up lying on its side, run it again with `--z-up` on the end.

**Tip:** STL has no colors, so an assembly comes through in a single color. If your version of SolidWorks or Fusion
offers **glTF / GLB** directly in its export list, use that instead: it keeps each part's appearance. Drop the file into `public/models/`.

Keep models under ~10 MB so they load quickly on phones.

## 4. Add a drawing PDF

In a SolidWorks drawing: **File → Save As → Adobe Portable Document Format (\*.pdf)**.
Put it in `public/drawings/` and set `pdf: /drawings/<name>.pdf`.

## 5. Add images

Put screenshots or renders next to the Markdown file (e.g. in an `images/` folder beside it) and reference them
with a relative path. The site resizes and compresses them automatically.

## 6. Preview and publish

```sh
npm run dev      # preview at http://localhost:4321
npm run build    # optional: check that everything builds
git add -A && git commit -m "Add spur gear" && git push   # Vercel deploys automatically
```

## Personal info, résumé, and courses

- Name, intro, emails, LinkedIn, résumé: `src/site.config.ts`
  (for the résumé, put the PDF at `public/resume.pdf` and set `resume: '/resume.pdf'`)
- Add a course or section: `src/data/courses.ts`, then create a matching folder under `src/content/projects/`
