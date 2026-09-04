import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { z } from "astro:content";

/**
 * YAML content loader.
 *
 * Everything that is displayed on a single shared page lives in one YAML file
 * under content/. Each file is parsed and validated at build time, so a typo
 * stops the build with a message naming the file and the field instead of
 * silently publishing a broken page.
 */

const contentDir = new URL("../../content/", import.meta.url);

function load<T extends z.ZodTypeAny>(file: string, schema: T): z.infer<T> {
  const path = fileURLToPath(new URL(file, contentDir));
  const raw = parse(readFileSync(path, "utf8"));
  const result = schema.safeParse(raw);

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`content/${file} is not valid:\n${problems}\n`);
  }

  return result.data;
}

const link = z.object({ label: z.string(), href: z.string() });

// -- site.yaml ---------------------------------------------------------------

const siteSchema = z.object({
  title: z.string(),
  shortTitle: z.string(),
  tagline: z.string(),
  description: z.string(),
  institution: z.string(),
  email: z.string(),
  nav: z.array(z.object({ label: z.string(), href: z.string() })),
  social: z.array(link),
});

export const site = load("site.yaml", siteSchema);

// -- publications.yaml -------------------------------------------------------

const publication = z.object({
  ref: z.string(),
  authors: z.string(),
  title: z.string(),
  venue: z.string(),
  /** Omit for preprints and anything not yet published. */
  year: z.number().optional(),
  note: z.string().optional(),
  links: z.array(link).default([]),
});

export type Publication = z.infer<typeof publication>;

export const publications = load(
  "publications.yaml",
  z.object({
    journal: z.array(publication).default([]),
    conference: z.array(publication).default([]),
    preprint: z.array(publication).default([]),
  }),
);

// -- awards.yaml -------------------------------------------------------------

export const awards = load(
  "awards.yaml",
  z.object({
    intro: z.string().optional(),
    items: z.array(
      z.object({
        title: z.string(),
        awarder: z.string(),
        year: z.number(),
        detail: z.string().optional(),
      }),
    ),
  }),
);

// -- positions.yaml ----------------------------------------------------------

export const positions = load(
  "positions.yaml",
  z.object({
    intro: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        type: z.string(),
        deadline: z.string().default("Rolling"),
        summary: z.string(),
        details: z.array(z.string()).default([]),
      }),
    ),
    aside: z.object({ title: z.string(), body: z.string() }).optional(),
  }),
);

// -- projects.yaml -----------------------------------------------------------

export const projects = load(
  "projects.yaml",
  z.object({
    intro: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        level: z.string(),
        summary: z.string(),
        requirements: z.array(z.string()).default([]),
      }),
    ),
  }),
);

// -- media.yaml --------------------------------------------------------------

export const mediaConfig = load(
  "media.yaml",
  z.object({
    intro: z.string().optional(),
    perPage: z.number().default(24),
    videos: z.array(
      z.object({
        youtube: z.string(),
        title: z.string(),
        date: z.string().optional(),
      }),
    ),
    captions: z.record(z.string(), z.string()).default({}),
  }),
);
