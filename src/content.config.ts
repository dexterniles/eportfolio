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
      pdf: z.string().optional(), // path under /public, e.g. /drawings/bracket.pdf
      // Source files shown in the code viewer: a folder under /public plus the files to show, in tab order.
      code: z.object({ dir: z.string(), files: z.array(z.string()).min(1) }).optional(),
      order: z.number().default(0),
    }),
});

// One Markdown file per Portfolio group in src/content/showcase/. The body is the group's narrative.
const showcase = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/showcase' }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string(), // one line, shown on the home-page teaser
      competencies: z.array(z.enum(competencySlugs)).min(1),
      outcomes: z.array(z.enum(outcomeSlugs)).default([]),
      skills: z.array(z.string()).default([]),
      projects: z.array(reference('projects')), // project ids, e.g. cad111/models/a1005
      // A group still waiting on work: shown on the dev server only, never published.
      draft: z.boolean().default(false),
      order: z.number().default(0),
    })
    // The assignment calls for at least 3 examples per group, so a published group can't have fewer.
    .refine((g) => g.draft || g.projects.length >= 3, {
      message: 'A published showcase group needs at least 3 projects (or set draft: true).',
      path: ['projects'],
    }),
});

export const collections = { projects, showcase };
