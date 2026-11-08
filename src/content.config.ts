import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { courseSlugs } from './data/courses';
import { competencySlugs, outcomeSlugs } from './data/competencies';

// One Markdown file per project in src/content/projects/<course>/.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      course: z.enum(courseSlugs),
      section: z.string(), // must match a section slug in src/data/courses.ts
      summary: z.string(),
      software: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      model: z.string().optional(), // path under /public, e.g. /models/bracket.glb
      // Assemblies: explode offsets per part number ("A1012") or placed copy ("A1013#2"), as
      // [x, y, z] in assembly radii (Y up). Parts left out slide out automatically.
      explode: z.record(z.string(), z.array(z.number()).length(3)).optional(),
      // Assemblies: names for parts in the color key that don't have a project page of their own.
      labels: z.record(z.string(), z.string()).optional(),
      view: z.object({ theta: z.number().optional(), phi: z.number().optional() }).optional(), // starting camera angle, degrees
      pdf: z.string().optional(), // path under /public, e.g. /drawings/bracket.pdf
      // Source files shown in the code viewer: a folder under /public plus the files to show, in tab order.
      code: z.object({ dir: z.string(), files: z.array(z.string()).min(1) }).optional(),
      order: z.number().default(0),
    }),
});

// One Markdown file per Portfolio group in src/content/showcase/, grouped by SolidWorks skill.
// The body is the group's reflection: 3–4 sentences, with SolidWorks terms written *like this*
// so they render highlighted. (At least 3 groups must have 3+ examples; see src/lib/showcase.ts.)
const showcase = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/showcase' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(), // one line, shown on the home-page teaser
    why: z.string(), // one line on why the skill matters on the job (the industry competencies)
    competencies: z.array(z.enum(competencySlugs)).min(1),
    outcomes: z.array(z.enum(outcomeSlugs)).default([]),
    skills: z.array(z.string()).default([]),
    projects: z.array(reference('projects')).min(1), // project ids, e.g. cad111/models/a1005
    // A group still waiting on work: shown on the dev server only, never published.
    draft: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { projects, showcase };
