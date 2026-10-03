// Everything personal about the site lives here. Edit freely.
export const site = {
  name: 'Dexter Niles',
  initials: 'DN',
  program: 'Engineering Transfer Path to UMass Dartmouth — Mechanical Engineering',
  school: 'Bristol Community College',
  tagline:
    'Engineering student at Bristol Community College, learning to turn ideas into parts, assemblies, and drawings.',
  intro:
    "Welcome to my e-Portfolio. I'm in the Engineering Transfer Program with a focus on Mechanical Engineering. This site collects my coursework, CAD models, and projects so you can see what I'm building and how I'm growing along the way.",
  skills: ['SolidWorks', 'Fusion 360'],
  emails: [
    { label: 'Personal', address: 'dexterniles@icloud.com' },
    { label: 'School', address: 'dniles11@bristolcc.edu' },
  ],
  linkedin: 'https://www.linkedin.com/in/dexterniles',
  // Drop a PDF in /public (e.g. /public/resume.pdf) and set this to '/resume.pdf'.
  // Leave as null to hide the résumé link everywhere.
  resume: null as string | null,
};
