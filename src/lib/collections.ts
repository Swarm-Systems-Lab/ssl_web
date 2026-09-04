import { getCollection, type CollectionEntry } from "astro:content";

/** Drafts are visible while running `bun run dev` and dropped from builds. */
const visible = ({ data }: { data: { draft?: boolean } }) => import.meta.env.DEV || !data.draft;

export async function getNews(): Promise<CollectionEntry<"news">[]> {
  const items = await getCollection("news", visible);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getResearch(): Promise<CollectionEntry<"research">[]> {
  const items = await getCollection("research", visible);
  return items.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export async function getTeam(): Promise<CollectionEntry<"team">[]> {
  const items = await getCollection("team", visible);
  return items.sort(
    (a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name),
  );
}

export const TEAM_GROUPS = [
  { key: "lead", label: "Principal investigator" },
  { key: "postdoc", label: "Postdocs" },
  { key: "phd", label: "Ph.D. students" },
  { key: "assistant", label: "Research assistants" },
  { key: "alumni", label: "Alumni" },
  { key: "visitor", label: "Visitors" },
] as const;

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
