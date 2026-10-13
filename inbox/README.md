# Inbox

Drop new content here, then ask Claude to "process the inbox" (or say which folder).
Each file gets checked, converted if needed, moved to its permanent home in the repo,
and given a project page. Nothing in these folders is committed or published; only
this README and the empty folders are tracked by Git.

| Folder | Drop here | Where it ends up |
| --- | --- | --- |
| `models/` | SolidWorks / Fusion 360 exports: `.STL` (or `.glb`, `.step`) | Source STL → `cad/`, web model → `public/models/`, plus a cover render and a page under the right course section |
| `drawings/` | Drawing PDFs exported from SolidWorks | `public/drawings/`, plus a cover render and a page under Drawings |
| `code/` | One folder per assignment with its `.c`/`.h` files, `Makefile`, and sample data | `public/code/<course>/<name>/` after removing build files (`.o`, binaries), plus a sample run and a page |
| `images/` | Screenshots, photos, renders (`.png`, `.jpg`, `.webp`, `.svg`) | Next to the project they belong to, or `src/assets/` for site-wide images |
| `documents/` | Syllabi, reports, lab write-ups, a résumé (`.pdf`, `.docx`) | Used as source material; only what you choose to publish gets copied into `public/` |

## Tips
- **Name things clearly.** Part numbers (`C1001.STL`) or what it is (`spur-gear-drawing.pdf`) help match files to projects.
- **Say which course and section** if it isn't obvious, e.g. "these go in CAD111 → Assemblies".
- **Matching files:** a model and its drawing with the same name (`V1003.STL`, `V1003.pdf`) get cross-linked automatically.
- **Code:** build output and `.git` folders are fine to drop in. They're stripped before anything is published.
- **Done items** are removed from the inbox once they're on the site, so whatever's still here hasn't been processed yet.
