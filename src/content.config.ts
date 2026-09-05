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
 * A post is either a single file — 2026-09-04-a-post.md — or, when it has
 * pictures of its own, a folder holding index.md next to them:
 *
 *   content/news/2026-09-04-a-post/index.md
 *   content/news/2026-09-04-a-post/01-a-picture.jpg
 *
 * Both produce the same address, /news/2026-09-04-a-post.
 * Files whose name starts with "_" are templates and are never published.
 * Anything that lives on a shared page (publications, positions, awards,
 * projects, media) is YAML instead — see src/lib/data.ts.
 */

const link = z.object({ label: z.string(), href: z.string() });

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
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

const research = defineCollection({
  loader: posts("./content/research"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      order: z.number().default(100),
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
