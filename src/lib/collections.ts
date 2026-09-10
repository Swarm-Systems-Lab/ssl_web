import { getCollection, type CollectionEntry } from "astro:content";
import { postMedia, firstFolderFile, folderMedia, type PostMedia } from "./folder-media";
import type { Slide } from "@/components/Carousel.astro";
import { summarise } from "./summary";
import { publications, type Publication } from "./data";
import { url } from "./url";
import type { Media } from "./images";

/**
 * What a listing shows: everything but the drafts, which are visible while
 * running `bun run dev` and dropped from builds.
 *
 * A `_template/` folder is dropped always, and not only by the glob in
 * content.config.ts. That pattern is applied when the collection is first
 * loaded, but the dev server re-adds a watched file when it changes without
 * re-applying it - so editing a template made it appear as a real entry,
 * titled "Name of the project", until the server was restarted. This is the
 * line that cannot be bypassed that way.
 */
const visible = ({ id, data }: { id: string; data: { draft?: boolean } }) =>
  !id.split("/").some((part) => part.startsWith("_")) && (import.meta.env.DEV || !data.draft);

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
/**
 * The line shown under a post's title in listings and at the top of the post.
 *
 * A post's text opens with the same sentence its title is drawn from, so the
 * summary starts after it - repeating the title underneath itself reads like a
 * stutter. A post that is only that one sentence has nothing left to preview,
 * and gets no summary at all rather than an echo.
 */
export function newsSummary(entry: CollectionEntry<"news">): string {
  if (entry.data.summary) return entry.data.summary;

  const body = (entry.body ?? "").trimStart();
  const opening = entry.data.title.trim().replace(/[.!?:]+$/, "");
  const rest = body.startsWith(opening)
    ? body.slice(opening.length).replace(/^[\s.!?:,–—-]+/, "")
    : body;

  return summarise(rest);
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

// -- fleet -------------------------------------------------------------------

export const FLEET_GROUPS = [
  { key: "fixed-wing", label: "Fixed-wing" },
  { key: "rotorcraft", label: "Rotorcraft" },
  { key: "rover", label: "Rovers" },
  { key: "ground", label: "Ground and comms" },
  { key: "retired", label: "Retired" },
] as const;

export type FleetGroup = (typeof FLEET_GROUPS)[number]["key"];

export type Robot = {
  entry: CollectionEntry<"fleet">;
  /** Folder name, and the address: /fleet/<slug>. */
  slug: string;
  group: FleetGroup;
  /** Whether there is a page worth visiting, on the same rule as a person. */
  hasPage: boolean;
  photo?: Media;
};

/**
 * The robots, in the order the fleet page shows them.
 *
 * One folder each, straight under content/fleet/ - unlike people, who are
 * filed by category, a machine's block is a property of the machine and moves
 * with it: a rover that is retired changes one line rather than moving folder.
 */
export async function getFleet(): Promise<Robot[]> {
  const entries = await getCollection("fleet", visible);

  return entries
    .map((entry) => {
      const photo = entry.data.photo ?? firstFolderFile("fleet", entry.id);
      return {
        entry,
        slug: entry.id.split("/").pop()!,
        group: entry.data.group,
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
 * The projects a robot lists, by the folder they live in under
 * content/research/. An unknown name stops the build with the list of what is
 * there: a machine quietly losing the project it was built for is the kind of
 * mistake nobody notices until someone asks about it in person.
 */
export async function projectsByFolder(
  names: string[],
  where: string,
): Promise<{ label: string; href: string }[]> {
  const projects = new Map((await getResearch()).map((entry) => [entry.id, entry.data]));

  return names.map((name) => {
    const found = projects.get(name);
    if (!found) {
      throw new Error(
        `${where} lists project "${name}", which is not a folder in content/research/.\n` +
          `Available: ${[...projects.keys()].join(", ")}\n`,
      );
    }
    return { label: found.acronym ?? found.title, href: url(`/research/${name}`) };
  });
}

// -- the bookshelf -----------------------------------------------------------

export const PROJECT_GROUPS = [
  { key: "software", label: "Software" },
  { key: "hardware", label: "Hardware" },
  { key: "tutorial", label: "Tutorials" },
] as const;

export type ProjectGroup = (typeof PROJECT_GROUPS)[number]["key"];

/** The blocks a project's repositories are listed in, in this order. */
export const REPO_GROUPS = [
  { key: "core", label: "Core" },
  { key: "tooling", label: "Tooling" },
  { key: "example", label: "Examples" },
] as const;

export type Project = {
  entry: CollectionEntry<"projects">;
  /** Folder name, and the address: /projects/<slug>. */
  slug: string;
  group: ProjectGroup;
  /** Whether there is a page worth visiting, on the same rule as a person. */
  hasPage: boolean;
  cover?: Media;
};

export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection("projects", visible);

  return entries
    .map((entry) => {
      const cover = entry.data.image ?? firstFolderFile("projects", entry.id);
      return {
        entry,
        slug: entry.id.split("/").pop()!,
        group: entry.data.group,
        hasPage: Boolean(entry.body?.trim()) || Boolean(cover),
        cover,
      };
    })
    .sort(
      (a, b) =>
        a.entry.data.order - b.entry.data.order ||
        a.entry.data.title.localeCompare(b.entry.data.title),
    );
}

// -- publications by reference -----------------------------------------------

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
