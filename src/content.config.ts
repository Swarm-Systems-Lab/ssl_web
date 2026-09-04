import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Markdown collections. Every entry here gets its own page on the site.
 * Files whose name starts with "_" are templates and are never published.
 * Anything that lives on a shared page (publications, positions, awards,
 * projects, media) is YAML instead — see src/lib/data.ts.
 */

const link = z.object({ label: z.string(), href: z.string() });

const news = defineCollection({
  loader: glob({ pattern: ["[!_]*.md", "!README.md"], base: "./content/news" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      summary: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

const research = defineCollection({
  loader: glob({ pattern: ["[!_]*.md", "!README.md"], base: "./content/research" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      order: z.number().default(100),
      image: image().optional(),
      imageAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

const team = defineCollection({
  loader: glob({ pattern: ["[!_]*.md", "!README.md"], base: "./content/team" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      group: z.enum(["lead", "postdoc", "phd", "assistant", "alumni", "visitor"]),
      order: z.number().default(100),
      summary: z.string(),
      photo: image().optional(),
      /** Alumni/visitor only: where they are now, or when they visited. */
      note: z.string().optional(),
      links: z.array(link).default([]),
      draft: z.boolean().default(false),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: ["[!_]*.md", "!README.md"], base: "./content/pages" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string().optional(),
  }),
});

export const collections = { news, research, team, pages };
