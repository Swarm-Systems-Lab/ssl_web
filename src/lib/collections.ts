import { getCollection, type CollectionEntry } from "astro:content";
import { postPictures, firstFolderPicture, type PostPictures } from "./folder-pictures";
import { summarise } from "./summary";
import type { Picture } from "./images";

/** Drafts are visible while running `bun run dev` and dropped from builds. */
const visible = ({ data }: { data: { draft?: boolean } }) => import.meta.env.DEV || !data.draft;

// -- news and research -------------------------------------------------------

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

/** The summary from the frontmatter, or the opening of the post itself. */
export function newsSummary(entry: CollectionEntry<"news">): string {
  return entry.data.summary ?? summarise(entry.body ?? "");
}

export function newsPictures(entry: CollectionEntry<"news">): PostPictures {
  return postPictures("news", entry.id, entry.data);
}

export function researchPictures(entry: CollectionEntry<"research">): PostPictures {
  return postPictures("research", entry.id, entry.data);
}

// -- team --------------------------------------------------------------------

export const TEAM_GROUPS = [
  { key: "lead", label: "Principal investigator" },
  { key: "postdoc", label: "Postdocs" },
  { key: "phd", label: "Ph.D. students" },
  { key: "assistant", label: "Research assistants" },
  { key: "alumni", label: "Alumni" },
  { key: "visitor", label: "Visitors" },
] as const;

export type TeamGroup = (typeof TEAM_GROUPS)[number]["key"];

export type TeamMember = {
  entry: CollectionEntry<"team">;
  /** Last path segment, and the address: /team/<slug>. */
  slug: string;
  group: TeamGroup;
  /**
   * Whether there is a page worth visiting: anyone with a photo or a
   * description gets one, so alumni and visitors are shown properly rather
   * than only as a line on the team page.
   */
  hasPage: boolean;
  photo?: Picture;
};

/**
 * People are filed by what they are to the lab:
 *
 *   content/team/members/<name>/index.md    current members, with a `group:`
 *   content/team/visitors/<name>/index.md
 *   content/team/alumni/<name>/index.md
 *
 * The folder decides the broad category; `group:` only splits the members into
 * the PI, postdocs, Ph.D. students, and research assistants.
 */
function groupOf(entry: CollectionEntry<"team">): TeamGroup {
  const [folder] = entry.id.split("/");

  if (folder === "visitors") return "visitor";
  if (folder === "alumni") return "alumni";
  if (folder === "members") {
    if (entry.data.group) return entry.data.group;
    throw new Error(
      `content/team/members/${entry.id.split("/").pop()}/index.md needs a "group:" line - ` +
        `one of lead, postdoc, phd, assistant.`,
    );
  }

  throw new Error(
    `content/team/${entry.id}.md is not in a category folder. ` +
      `Move it into team/members/, team/visitors/, or team/alumni/.`,
  );
}

export async function getTeam(): Promise<TeamMember[]> {
  const entries = await getCollection("team", visible);

  return entries
    .map((entry) => {
      const photo = entry.data.photo ?? firstFolderPicture("team", entry.id);
      return {
        entry,
        slug: entry.id.split("/").pop()!,
        group: groupOf(entry),
        hasPage: Boolean(entry.body?.trim()) || Boolean(photo),
        photo,
      };
    })
    .sort(
      (a, b) =>
        a.entry.data.order - b.entry.data.order ||
        a.entry.data.name.localeCompare(b.entry.data.name),
    );
}

// -- shared ------------------------------------------------------------------

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
