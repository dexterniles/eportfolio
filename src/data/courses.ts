// Add a course by adding an entry here, then add projects with a matching `course` value.
export const courses = [
  {
    slug: 'cad111',
    code: 'CAD111',
    title: 'Mechanical Design w/ SolidWorks',
    term: 'Fall 2026',
    status: 'In progress',
    software: 'SolidWorks',
    summary: 'Parametric part modeling, assemblies, and engineering drawings in SolidWorks.',
    topics: [
      'Fully defined parametric part modeling',
      'Assemblies and advanced mates',
      'Third-angle projection and ASME drawing standards',
      'Custom drawing templates and detail drawings',
      'Geometric dimensioning and tolerancing (GD&T)',
      'Toolbox, configurations, and design tables',
      'CSWA certification prep',
    ],
    sections: [
      { slug: 'models', title: 'Models', blurb: 'Individual parts built from sketches and features.' },
      { slug: 'assemblies', title: 'Assemblies', blurb: 'Parts mated together into working mechanisms.' },
      { slug: 'drawings', title: 'Drawings', blurb: 'Dimensioned engineering drawings ready for the shop.' },
      { slug: 'design-project', title: 'Design Project', blurb: 'An original project taken from concept sketches to models, assemblies, and drawings.' },
      { slug: 'journal', title: 'Journal', blurb: 'Reflections on my work at the mid-term and final.' },
    ],
  },
  {
    slug: 'cis158',
    code: 'CIS158',
    title: 'Intro to Procedural Programming',
    term: 'Spring 2026',
    status: 'Completed',
    software: 'C · Linux',
    summary: 'Programming in C on Linux: the command line, Vim, Git, makefiles, pointers, and data structures.',
    topics: [
      'Linux command line, Vim, and Bash',
      'Git version control',
      'Variables, expressions, and the preprocessor',
      'Control flow: if/else and loops',
      'Functions, strings, and arrays',
      'Pointers and dynamic memory',
      'Makefiles and multi-file programs',
      'Enums and bitwise operations',
      'Structs, unions, and recursion',
      'Linked lists, stacks, queues, and trees',
      'File processing and command-line arguments',
    ],
    sections: [
      { slug: 'c-projects', title: 'C Programs', blurb: 'Weekly code projects, from printf and scanf to pointers, structs, and file I/O.' },
      { slug: 'final-project', title: 'Final Project', blurb: 'The capstone program that pulls the semester together.' },
    ],
  },
] as const;

export type Course = (typeof courses)[number];
export const courseSlugs = courses.map((c) => c.slug) as [string, ...string[]];
