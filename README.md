# Dexter Niles · e-Portfolio

Personal engineering e-Portfolio for my coursework at Bristol Community College (Engineering Transfer Program, Mechanical Engineering focus). Built with [Astro](https://astro.build) and Tailwind CSS, with a custom [three.js](https://threejs.org) viewer that shows CAD models with SolidWorks-style edge lines. Hosted on Vercel at [dexterniles.vercel.app](https://dexterniles.vercel.app); every push to `master` deploys.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview at http://localhost:4321 |
| `npm run build` | Production build into `dist/` |
| `npm run stl2glb -- in.stl public/models/out.glb [#color] [--z-up]` | Convert a CAD STL export to a compressed web 3D model |
| `npm run covers [-- name] [--force]` | Render card images for models (3D viewer) and drawings (page 1 of the PDF) |
| `npm run compress-models` | Compress any `.glb` in `public/models/` that isn't compressed yet |
| `npm run og` | Rebuild the link-preview image (`public/og.png`) |
| `npm run icons` | Rebuild the favicon and home-screen icons from the logo |

## Where things live

| What | Where |
| --- | --- |
| Projects (one Markdown file each) | `src/content/projects/<course>/<section>/` |
| Portfolio page groups and narratives | `src/content/showcase/` |
| Courses and their sections | `src/data/courses.ts` |
| Competencies and course outcomes | `src/data/competencies.ts` |
| Name, intro, contact info | `src/site.config.ts` |
| 3D models / drawing PDFs | `public/models/` / `public/drawings/` |
| Source CAD exports (STL) | `cad/` |
| Logo source files | `src/assets/logo/` |

## Docs

- [HOW-TO-ADD-WORK.md](HOW-TO-ADD-WORK.md): adding models, drawings, and other work
- [inbox/README.md](inbox/README.md): the drop-off folders for new files
- [IMPROVEMENTS.md](IMPROVEMENTS.md): what's done, what's next
