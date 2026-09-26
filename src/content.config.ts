import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { courseSlugs } from './data/courses';

// One Markdown file per project in src/content/projects/<course>/.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      course: z.enum(courseSlugs),
      section: z.string(), // must match a section slug in src/data/courses.ts
      date: z.coerce.date(),
      summary: z.string(),
      software: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      model: z.string().optional(), // path under /public, e.g. /models/bracket.glb
      pdf: z.string().optional(), // path under /public, e.g. /drawings/bracket.pdf
      placeholder: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

export const collections = { projects };
