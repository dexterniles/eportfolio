// Add a course by adding an entry here, then add projects with a matching `course` value.
export const courses = [
  {
    slug: 'cad111',
    code: 'CAD111',
    title: 'Mechanical Design w/ SolidWorks',
    software: 'SolidWorks',
    summary: 'Parametric part modeling, assemblies, and engineering drawings in SolidWorks.',
    sections: [
      { slug: 'models', title: 'Models', blurb: 'Individual parts built from sketches and features.' },
      { slug: 'assemblies', title: 'Assemblies', blurb: 'Parts mated together into working mechanisms.' },
      { slug: 'drawings', title: 'Drawings', blurb: 'Dimensioned engineering drawings ready for the shop.' },
      { slug: 'journal', title: 'Journal', blurb: 'Reflections on my work at the mid-term and final.' },
    ],
  },
] as const;

export type Course = (typeof courses)[number];
export const courseSlugs = courses.map((c) => c.slug) as [string, ...string[]];
