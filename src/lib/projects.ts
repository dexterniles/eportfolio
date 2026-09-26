import { getCollection, type CollectionEntry } from 'astro:content';
import { courses } from '../data/courses';

export type Project = CollectionEntry<'projects'>;

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);

// Project URL: /<course>/<file path inside the course folder>
export const projectSlug = (p: Project) => p.id.replace(new RegExp(`^${p.data.course}/`), '');
export const projectHref = (p: Project) => `/${p.data.course}/${projectSlug(p)}`;

export const sectionTitle = (courseSlug: string, sectionSlug: string) =>
  getCourse(courseSlug)?.sections.find((s) => s.slug === sectionSlug)?.title ?? sectionSlug;

// All projects in a course, ordered by section, then `order`, then date.
export async function getCourseProjects(courseSlug: string) {
  const course = getCourse(courseSlug);
  const sectionIndex = (s: string) => {
    const i = course?.sections.findIndex((x) => x.slug === s) ?? -1;
    return i === -1 ? Infinity : i;
  };
  const list = await getCollection('projects', (p) => p.data.course === courseSlug);
  return list.sort(
    (a, b) =>
      sectionIndex(a.data.section) - sectionIndex(b.data.section) ||
      a.data.order - b.data.order ||
      a.data.date.getTime() - b.data.date.getTime(),
  );
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
