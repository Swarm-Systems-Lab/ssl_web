import { getCollection, type CollectionEntry } from "astro:content";
import { postMedia, firstFolderFile, folderMedia, type PostMedia } from "./folder-media";
import type { Slide } from "@/components/Carousel.astro";
import { summarise } from "./summary";
import { publications, type Publication } from "./data";
import { url } from "./url";
import type { Media } from "./images";

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

export function newsMedia(entry: CollectionEntry<"news">): PostMedia {
  return postMedia("news", entry.id, entry.data);
}

export function researchMedia(entry: CollectionEntry<"research">): PostMedia {
  return postMedia("research", entry.id, entry.data);
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
  photo?: Media;
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
      const photo = entry.data.photo ?? firstFolderFile("team", entry.id);
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

/**
 * Group photos of the lab, shown as a carousel at the top of the team page.
 *
 * Anything dropped in content/team/photos/ appears, in file-name order, with
 * captions read from the file names - the same rule as a news post's gallery.
 * An empty folder simply means no carousel.
 */
export function getTeamPhotos(): Slide[] {
  return folderMedia("team", "photos", "The lab");
}

// -- projects ----------------------------------------------------------------

const byRef = new Map(publications.map((entry) => [entry.ref.toUpperCase(), entry]));

/**
 * The papers a project lists, looked up by their reference - "J20", "C15",
 * "U1" - so a project never repeats what publications.yaml already says. They
 * come back in the order written, so a project can lead with what matters.
 *
 * An unknown reference stops the build: silently dropping a paper from a
 * project page is worse than not building at all.
 */
export function worksByRef(refs: string[], where: string): Publication[] {
  return refs.map((ref) => {
    const found = byRef.get(ref.trim().toUpperCase());
    if (!found) {
      throw new Error(
        `${where} lists work "${ref}", which is no reference in content/publications.yaml.\n` +
          `References are the [J20] / [C15] / [U1] labels shown on the publications page.\n`,
      );
    }
    return found;
  });
}

/** "ERC" plus "Starting Grant" reads as "ERC Starting Grant". */
export function backerLabel(backer: { name: string; programme?: string }): string {
  return [backer.name, backer.programme].filter(Boolean).join(" ");
}

export type Person = { label: string; href?: string };

/**
 * Turns the names written against an award or a project into people. A folder
 * name under content/team becomes that person, linked when they have a page of
 * their own; anything else is shown as written, for the collaborators who are
 * not listed on the site.
 */
export async function teamLookup(): Promise<(name: string) => Person> {
  const team = new Map(
    (await getTeam()).map((member) => [
      member.slug,
      { name: member.entry.data.name, hasPage: member.hasPage },
    ]),
  );

  return (name: string) => {
    const person = team.get(name);
    if (!person) return { label: name };
    return { label: person.name, href: person.hasPage ? url(`/team/${name}`) : undefined };
  };
}

// -- shared ------------------------------------------------------------------

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
