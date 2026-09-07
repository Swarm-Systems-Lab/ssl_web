import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/** Matches a post either as one file or as index.md inside its own folder. */
const posts = (base: string) =>
  glob({
    base,
    pattern: ["**/[!_]*.md", "!**/README.md"],
    // "a-post/index.md" and "a-post.md" must land on the same address.
    generateId: ({ entry }) => entry.replace(/\.md$/, "").replace(/\/index$/, ""),
  });

/**
 * Markdown collections. Every entry here gets its own page on the site.
 *
 * A post is either a single file - 2026-09-04-a-post.md - or, when it has
 * pictures of its own, a folder holding index.md next to them:
 *
 *   content/news/2026-09-04-a-post/index.md
 *   content/news/2026-09-04-a-post/01-a-picture.jpg
 *
 * Both produce the same address, /news/2026-09-04-a-post.
 * Files whose name starts with "_" are templates and are never published.
 * Anything that lives on a shared page (publications, positions, awards,
 * projects, media) is YAML instead - see src/lib/data.ts.
 */

const link = z.object({ label: z.string(), href: z.string() });

/**
 * A funder or a partner behind a project: the ERC and its scheme, a ministry,
 * or the company we are working with. Only `name` is required, so an entry can
 * be as short as "Airbus" or carry the whole grant reference.
 */
const backer = z.object({
  /** The organisation, e.g. "European Research Council". */
  name: z.string(),
  /** Its scheme, e.g. "Starting Grant" or "Proof of Concept". */
  programme: z.string().optional(),
  /** Grant or contract number, shown as written. */
  reference: z.string().optional(),
  href: z.string().optional(),
  /** File name in content/affiliations/, when there is a logo for it. */
  logo: z.string().optional(),
});

const news = defineCollection({
  loader: posts("./content/news"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      /** Optional: taken from the opening of the post when left out. */
      summary: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      /** Extra pictures. Two or more render as a carousel under the post. */
      gallery: z.array(z.object({ src: image(), caption: z.string().optional() })).default([]),
      /**
       * Papers the post is about, by their reference in publications.yaml:
       * ["C42", "C41"]. Each is shown in full underneath, so a post never has
       * to spell out authors and venue that are already written down once.
       */
      works: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

/**
 * The funded projects the lab runs. Everything below `summary` is optional, so
 * a project can start as a title and a paragraph and gain its funding, its
 * papers, and its people as they arrive.
 */
const research = defineCollection({
  loader: posts("./content/research"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      order: z.number().default(100),
      /** Short name the project goes by, e.g. "iSwarm" or "Aerosense". */
      acronym: z.string().optional(),
      /** When it runs, written however it should read: "2023 - 2028". */
      period: z.string().optional(),
      /** Who pays for it. */
      funding: z.array(backer).default([]),
      /** Who we run it with - companies, institutes, other groups. */
      partners: z.array(backer).default([]),
      /**
       * Papers from the project, by their reference in publications.yaml:
       * ["J20", "C15", "U1"]. Each one is shown in full, as on the
       * publications page, in the order written here.
       */
      works: z.array(z.string()).default([]),
      /**
       * People on the project. A folder name under content/team links to that
       * person; anything else is shown as plain text.
       */
      members: z.array(z.string()).default([]),
      /**
       * Anything else worth pointing at: the project's own site, a dataset,
       * the code, a television piece that cannot be embedded.
       */
      links: z.array(link).default([]),
      image: image().optional(),
      imageAlt: z.string().optional(),
      /** Extra pictures. Two or more render as a carousel under the post. */
      gallery: z.array(z.object({ src: image(), caption: z.string().optional() })).default([]),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

const team = defineCollection({
  loader: posts("./content/team"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      /**
       * Only needed under team/members/, to say which block someone belongs
       * in. Files under team/visitors/ and team/alumni/ take their group from
       * the folder they are in.
       */
      group: z.enum(["lead", "postdoc", "phd", "assistant"]).optional(),
      order: z.number().default(100),
      summary: z.string(),
      /** Optional: the first picture in the person's folder is used otherwise. */
      photo: image().optional(),
      /** Alumni/visitor only: where they are now, or when they visited. */
      note: z.string().optional(),
      links: z.array(link).default([]),
      draft: z.boolean().default(false),
    }),
});

const pages = defineCollection({
  loader: posts("./content/pages"),
  schema: z.object({
    title: z.string(),
    tagline: z.string().optional(),
  }),
});

export const collections = { news, research, team, pages };
