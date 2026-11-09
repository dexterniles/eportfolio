## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project notes

- Read [README.md](README.md) for the layout and commands, and [HOW-TO-ADD-WORK.md](HOW-TO-ADD-WORK.md) and
  [inbox/README.md](inbox/README.md) before processing new work.
- [IMPROVEMENTS.md](IMPROVEMENTS.md) is the tracking list: check items off and add a dated note when something ships.
- CAD111 part names come from the official list in [src/data/part-numbers.ts](src/data/part-numbers.ts): use them
  in page titles (`A1003 · Pinion Shaft`) instead of guessing. A1001 (the arbor press frame) was supplied by the
  instructor, so it never gets a page of its own.
- Restart the dev server after adding new content files or collections; it doesn't pick them up on its own.
- `npm run covers` uses the dev server and Playwright's Chromium (`npx playwright install chromium` on a new machine,
  and again after Playwright updates).
- Check library APIs against current docs with Context7 (`resolve-library-id`, then `query-docs`) rather than memory:
  Astro (`/withastro/docs`), three.js (`/mrdoob/three.js/r186`, matching the installed version), Tailwind v4
  (`/tailwindlabs/tailwindcss.com`), Vercel (`/websites/vercel`).
- On Windows Git Bash, set `MSYS_NO_PATHCONV=1` when passing URL paths like `/portfolio` as command arguments.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
