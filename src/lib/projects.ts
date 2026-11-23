import { getCollection, type CollectionEntry } from 'astro:content';
import { courses } from '../data/courses';

export type Project = CollectionEntry<'projects'>;

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);

// Project URL: /<course>/<file path inside the course folder>
export const projectSlug = (p: Project) => p.id.replace(new RegExp(`^${p.data.course}/`), '');
export const projectHref = (p: Project) => `/${p.data.course}/${projectSlug(p)}`;

export const getSection = (courseSlug: string, sectionSlug: string) =>
  getCourse(courseSlug)?.sections.find((s) => s.slug === sectionSlug);

export const sectionTitle = (courseSlug: string, sectionSlug: string) =>
  getSection(courseSlug, sectionSlug)?.title ?? sectionSlug;

// Anchor id of a group's heading on the course page.
export const groupAnchor = (sectionSlug: string, groupSlug: string) => `${sectionSlug}-${groupSlug}`;

// The group a project belongs to (from its `group:` front matter), if its section has groups.
export const getProjectGroup = (p: Project) =>
  p.data.group ? getSection(p.data.course, p.data.section)?.groups?.find((g) => g.slug === p.data.group) : undefined;

// All projects in a course, ordered by section, then group, then `order`, then title.
export async function getCourseProjects(courseSlug: string) {
  const course = getCourse(courseSlug);
  const indexOf = <T extends { slug: string }>(list: T[] | undefined, slug: string | undefined) => {
    const i = slug ? (list?.findIndex((x) => x.slug === slug) ?? -1) : -1;
    return i === -1 ? Infinity : i; // unknown or ungrouped sorts last
  };
  const list = await getCollection('projects', (p) => p.data.course === courseSlug);
  // A typo in `group:` would quietly drop a project into "Other", so stop the build instead.
  for (const p of list) {
    const section = getSection(courseSlug, p.data.section);
    if (p.data.group && !getProjectGroup(p)) {
      const known = section?.groups?.map((g) => g.slug).join(', ') || 'none';
      throw new Error(`${p.id}: group "${p.data.group}" isn't defined for ${courseSlug} → ${p.data.section} in src/data/courses.ts (groups: ${known}).`);
    }
  }
  const sectionIndex = (p: Project) => indexOf(course?.sections, p.data.section);
  const groupIndex = (p: Project) => indexOf(getSection(courseSlug, p.data.section)?.groups, p.data.group);
  return list.sort(
    (a, b) =>
      sectionIndex(a) - sectionIndex(b) ||
      groupIndex(a) - groupIndex(b) ||
      a.data.order - b.data.order ||
      a.data.title.localeCompare(b.data.title),
  );
}

// The run of projects a visitor steps through with Previous/Next: the project's group, or its whole
// section when the section has no groups (ungrouped projects in a grouped section form "Other").
export function projectRun(p: Project) {
  const section = getSection(p.data.course, p.data.section);
  const group = getProjectGroup(p);
  if (group) return { key: `${p.data.section}/${group.slug}`, title: group.title, anchor: groupAnchor(p.data.section, group.slug) };
  if (section?.groups?.length) return { key: `${p.data.section}/`, title: 'Other', anchor: groupAnchor(p.data.section, 'other') };
  return { key: `${p.data.section}/`, title: section?.title ?? p.data.section, anchor: p.data.section };
}
