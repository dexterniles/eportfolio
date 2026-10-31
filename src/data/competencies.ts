// The industry competencies and Bristol course outcomes that the Portfolio page groups work by.
// Showcase groups in src/content/showcase/ refer to these by slug.

export interface Competency {
  slug: string;
  title: string;
  short: string; // one-line, plain-language version shown in the key
  definition: string; // the full industry definition
}

export interface Outcome {
  slug: string;
  number: number;
  text: string;
}

export const competencies: Competency[] = [
  {
    slug: 'data-management',
    title: 'Data Management',
    short: 'Collecting, verifying, and analyzing design data to improve a process or product.',
    definition:
      'The practice of collecting, keeping, verifying, and analyzing data or information securely, efficiently, and cost-effectively, to improve the operations connected to a process or piece of equipment.',
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting & Maintenance',
    short: 'Testing ideas with 3D prototypes and choosing sizes and fits that work together.',
    definition:
      'The ability to make informed decisions by following a systematic process that traces faults, corrects, repairs, or calibrates errors, and maintains instruments and equipment.',
  },
  {
    slug: 'information-management',
    title: 'Information Management',
    short: 'Documenting designs in organized drawings that support decision-makers.',
    definition:
      'The ability to document designs, procedures, or activities, gather information from all relevant sources, and organize it into documentation that supports decision-makers.',
  },
  {
    slug: 'thinking-making',
    title: 'Thinking & Making Creatively',
    short: 'Turning ideas into models of systems, processes, and products.',
    definition:
      'Developing research plans, models of systems, processes, or products, and creating visual designs or displays.',
  },
];

export const outcomes: Outcome[] = [
  {
    slug: 'parametric-modeling',
    number: 1,
    text: 'Use SolidWorks parametric solid modeling to demonstrate parametric modeling functions and assembly mating features.',
  },
  {
    slug: 'detail-drawings',
    number: 2,
    text: 'Create detail drawings to current engineering standards (ANSI Y14.1) using standard, detail, and section views.',
  },
  {
    slug: 'templates',
    number: 3,
    text: 'Build drawing templates with standard views and completed title and revision blocks for various paper sizes.',
  },
  {
    slug: 'research',
    number: 4,
    text: 'Research mechanical processes, terminology, and products for use in mechanical models and assemblies.',
  },
];

export const competencySlugs = competencies.map((c) => c.slug) as [string, ...string[]];
export const outcomeSlugs = outcomes.map((o) => o.slug) as [string, ...string[]];
export const getCompetency = (slug: string) => competencies.find((c) => c.slug === slug)!;
export const getOutcome = (slug: string) => outcomes.find((o) => o.slug === slug)!;
