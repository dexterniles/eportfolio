// Every course on the site. Courses with `sections` get project pages and a big card on the home page;
// courses without sections are "outline" courses: a summary, topics, and key coursework.
// Add projects with a matching `course` value (and a section slug) under src/content/projects/.

export interface CourseSection {
  slug: string;
  title: string;
  blurb: string;
}

export interface Course {
  slug: string;
  code: string;
  title: string;
  term: string;
  status: 'In progress' | 'Completed';
  software: string; // tools label shown on cards and the course page
  summary: string;
  topics: string[];
  sections: CourseSection[]; // leave empty for an outline course
  coursework?: string[]; // key assignments, shown on outline courses
}

export const courses: Course[] = [
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

  // ---- Outline courses (newest first) ----
  {
    slug: 'eng215',
    code: 'ENG215',
    title: 'Technical Writing',
    term: 'Fall 2026',
    status: 'In progress',
    software: 'APA 7 · Microsoft 365',
    summary:
      'Writing for business and industry (memos, letters, reports, proposals, and instructions), taught through a zombie-apocalypse theme.',
    topics: [
      'Audience and purpose analysis',
      'Memos, formal letters, and professional email',
      'Technical definitions and descriptions',
      'Field reports and incident reports',
      'Writing step-by-step instructions',
      'Proposals and progress reports',
      'Primary research: surveys and interviews',
      'APA style, citation, and grammar',
      'Ethics and bias-free language',
      'Collaborative writing in teams',
    ],
    coursework: [
      'Memos, a formal letter, and a definitions memo',
      'Group field report, incident report, and set of instructions',
      'Research proposal and progress report',
      'Final project: a researched Emergency Preparedness Guide in APA format',
    ],
    sections: [],
  },
  {
    slug: 'mth215',
    code: 'MTH215',
    title: 'Calculus II',
    term: 'Fall 2026',
    status: 'In progress',
    software: 'TI-84+ · WebAssign · Desmos',
    summary:
      'Integration techniques and applications, parametric and polar curves, and infinite sequences and series.',
    topics: [
      'Area between curves and average value',
      'Volumes of revolution (disks and washers)',
      'Integration by parts',
      'Trigonometric integrals and substitution',
      'Partial fractions',
      'Improper integrals',
      'Arc length',
      'Parametric equations and polar coordinates',
      'Sequences and series',
      'Convergence tests: integral, comparison, alternating, ratio',
      'Power series',
      'Taylor and Maclaurin series',
    ],
    coursework: [
      'Weekly WebAssign problem sets',
      '10 labs using WolframAlpha and Desmos',
      'Two timed exams with fully worked solutions',
    ],
    sections: [],
  },
  {
    slug: 'phy211',
    code: 'PHY211',
    title: 'General Physics I',
    term: 'Fall 2026',
    status: 'In progress',
    software: 'Calculus-based · Simulation labs',
    summary:
      'Calculus-based mechanics: kinematics, Newton’s laws, energy, momentum, and rotation, with a lab each week.',
    topics: [
      'Units, dimensional analysis, and vectors',
      'Kinematics in one and two dimensions',
      'Newton’s laws of motion',
      'Friction and air drag',
      'Centripetal force and universal gravitation',
      'Work, energy, and conservation of energy',
      'Momentum and collisions',
      'Torque and rotational equilibrium',
      'Analyzing lab data and sources of error',
    ],
    coursework: [
      'Weekly problem sets and simulation labs',
      'Three midterm exams: kinematics, dynamics, and conservation laws',
      'Cumulative final exam',
    ],
    sections: [],
  },
  {
    slug: 'mth214',
    code: 'MTH214',
    title: 'Calculus I',
    term: 'Summer 2026',
    status: 'Completed',
    software: 'TI-84+ · WebAssign',
    summary:
      'Limits, continuity, and derivatives, with an introduction to integration of algebraic, trigonometric, logarithmic, and exponential functions.',
    topics: [
      'Limits: graphically, numerically, and analytically',
      'Continuity',
      'Derivatives and differentiation rules',
      'Derivatives of trigonometric, logarithmic, and exponential functions',
      'Applications: extrema, curve sketching, and approximation',
      'Antiderivatives',
      'Areas under curves and Riemann sums',
      'The Fundamental Theorem of Calculus and substitution',
    ],
    coursework: ['WebAssign homework for every section', 'Eight labs', 'Four exams'],
    sections: [],
  },
  {
    slug: 'chm113',
    code: 'CHM113',
    title: 'Fundamentals of Chemistry I',
    term: 'Spring 2026',
    status: 'Completed',
    software: 'Mastering Chemistry · Virtual labs',
    summary:
      'Chemistry for science and engineering majors: measurement, atomic structure, stoichiometry, gases, thermochemistry, and chemical bonding.',
    topics: [
      'Measurement and dimensional analysis',
      'Atoms, elements, and the periodic table',
      'Molecules, compounds, and nomenclature',
      'Chemical reactions and stoichiometry',
      'Solutions and aqueous reactions',
      'Gas laws',
      'Thermochemistry',
      'The quantum-mechanical model of the atom',
      'Periodic trends',
      'Chemical bonding: Lewis structures and molecular shapes',
      'Liquids, solids, and intermolecular forces',
    ],
    coursework: [
      'Online homework and quizzes for each chapter',
      'Virtual labs: measurement, density, calorimetry, periodic trends, molecular shapes, and empirical formulas',
      'Three exams and a cumulative final',
    ],
    sections: [],
  },
];

export const courseSlugs = courses.map((c) => c.slug) as [string, ...string[]];
