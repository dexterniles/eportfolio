# How to add work to the e-Portfolio

> **Quickest way:** drop files in the matching [`inbox/`](inbox/README.md) folder (`models/`, `drawings/`,
> `code/`, `images/`, `documents/`) and ask Claude to process the inbox. The steps below are the
> manual route.

Each project is one Markdown file in `src/content/projects/<course>/<section>/`.
The file name becomes the URL: `src/content/projects/cad111/models/gear.md` → `/cad111/models/gear`.

## 1. Copy the template

Copy [`templates/project.md`](templates/project.md) into the right folder, for example
`src/content/projects/cad111/models/spur-gear.md` (create the folder if it doesn't exist yet), then fill it in.
It includes suggested headings for each section.

After adding a new file or folder, restart the dev server (`npx astro dev stop`, then `npx astro dev --background`
or `npm run dev`) so the page shows up.

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
code:                               # optional source files for code projects, shown in tabs
  dir: /code/cis158/uppercase       #   a folder under public/
  files: [main.c, Makefile]         #   the files to show, in tab order
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
   The last value is the model's color (any hex color, optional). The model is compressed for the
   web automatically (about 75% smaller with no visible difference).

### Fusion 360
1. In the browser tree, right-click the body or component → **Save As Mesh** (or **File → Export** and choose STL).
2. Format **STL (Binary)**, Refinement **High**.
3. Convert it the same way:
   ```sh
   npm run stl2glb -- ~/Downloads/Bracket.stl public/models/bracket.glb "#e8590c"
   ```
   If the model shows up lying on its side, run it again with `--z-up` on the end.

**Tip:** for a single part, STL is all you need. For assemblies, use STEP instead (next section): an STL merges every
part into one mesh, so the site can't color or explode them.

Keep models under ~10 MB so they load quickly on phones.

### Assemblies (STEP → exploded, multi-color model)

1. In SolidWorks, open the assembly **collapsed**, then **File → Save As → STEP AP214 (\*.step)**.
2. Convert it (keeps the source file in `cad/`):
   ```sh
   npm run step2glb -- "cad/A1000 - Assembly.STEP" public/models/a1000.glb
   ```
   Each part number gets its own color; purchased hardware (names like `A1010_91744A537`) shares one gray, and
   its thread detail is simplified to keep the file small. `--color A1005=#d8a24a` overrides a color.
3. Make the page in `src/content/projects/<course>/assemblies/` with `model:` pointing at the file. The viewer adds an
   **Explode** button (and the **E** key), dashed explode lines, and a color key that links each part to its page.
4. Optional front matter:
   ```yaml
   view: { theta: 60, phi: 72 }   # starting camera angle, degrees
   explode:                       # [x, y, z] in assembly radii, Y up; parts left out slide out automatically
     A1002: [0, 0.75, 0]          #   by part number…
     "A1013#2": [0, 0, 0.45]      #   …or one placed copy, counted in file order
   labels:                        # names in the color key for parts without their own page
     A1001: Frame
   ```
5. Render the cover after the dev server has seen the new page (`npm run covers -- a1000`). Assembly covers are
   shown exploded. If the page errors on a missing cover image first, that's expected: render it, and it clears.

## 4. Add a drawing PDF

In a SolidWorks drawing: **File → Save As → Adobe Portable Document Format (\*.pdf)**.
Put it in `public/drawings/` and set `pdf: /drawings/<name>.pdf`.

## 5. Add images

Put screenshots or renders next to the Markdown file (e.g. in an `images/` folder beside it) and reference them
with a relative path. The site resizes and compresses them automatically.

For models and drawings, the card image can be rendered for you:

```sh
npm run covers                  # renders any missing covers (model: 3D viewer, drawing: page 1 of the PDF)
npm run covers -- spur-gear     # just this project; add --force to re-render an existing cover
```

It saves to `images/<name>.png` beside the Markdown file (or wherever `cover:` points) and tells you
the `cover:` line to add if it's missing. The first time on a new computer, run `npx playwright install chromium`.

## 6. Feature it on the Portfolio page (optional)

The [Portfolio page](https://dexterniles.vercel.app/portfolio) groups your work by SolidWorks skill. Each group is
a Markdown file in `src/content/showcase/`: the front matter has a one-line `summary`, a one-line `why` (why the skill
matters on the job), the competencies, course outcomes, skills, and `projects` (by path, e.g.
`cad111/models/spur-gear`). The body is the group's **reflection**: 3–4 sentences on how you used the skills, with
SolidWorks terms written `*Extruded Boss/Base*` so they show highlighted.

The page needs at least 3 published groups with 3 or more projects each (the build stops otherwise); other groups
can be smaller. Set `draft: true` on a group that isn't ready and it only shows on the dev server. Competency and
outcome wording lives in `src/data/competencies.ts`.

A project in a group automatically shows a "Featured in" link back to the Portfolio page.

## 7. Preview and publish

```sh
npm run dev      # preview at http://localhost:4321
npm run build    # optional: check that everything builds
git add -A && git commit -m "Add spur gear" && git push   # Vercel deploys automatically
```

## Personal info, résumé, and courses

- Name, tagline, intro, tools list, emails, LinkedIn, résumé: `src/site.config.ts`
  (for the résumé, put the PDF at `public/resume.pdf` and set `resume: '/resume.pdf'`)
- Add a course or section: `src/data/courses.ts`, then create a matching folder under `src/content/projects/`
