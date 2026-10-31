import { getCollection, getEntries, type CollectionEntry } from 'astro:content';

export type ShowcaseGroup = CollectionEntry<'showcase'>;

// Group letters on the Portfolio page, matching the course pages' section zones.
export const zones = 'ABCDEFGH';

// Published groups in order. Draft groups (still waiting on work) only appear on the dev server.
export async function getShowcaseGroups() {
  const groups = await getCollection('showcase', (g) => import.meta.env.DEV || !g.data.draft);
  return groups.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export const getGroupProjects = (group: ShowcaseGroup) => getEntries(group.data.projects);

// The groups that feature a given project, with their letters, for the "Featured in" link on project pages.
export async function getGroupsForProject(projectId: string) {
  const groups = await getShowcaseGroups();
  return groups
    .map((group, i) => ({ group, letter: zones[i] }))
    .filter(({ group }) => group.data.projects.some((p) => p.id === projectId));
}
