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
 *
 * Text fields may contain inline Markdown - `[label](https://…)`, **bold**,
 * *italics*, `code` - rendered by the <Text> component. Picture fields hold a
 * path relative to content/, resolved by src/lib/images.ts.
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

const link = z.object({
  label: z.string(),
  href: z.string(),
  /** File name in content/logos/, when it differs from the label. */
  logo: z.string().optional(),
});

/** A path relative to content/, e.g. "images/granada/alhambra.jpg". */
const picturePath = z.string();

// -- site.yaml ---------------------------------------------------------------

const navItem = z.object({
  label: z.string(),
  href: z.string(),
  /** Renders as a drop-down under the tab. */
  children: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
});

const siteSchema = z.object({
  title: z.string(),
  shortTitle: z.string(),
  /** Appended to the site name in the browser tab on the front page. */
  tagline: z.string().optional(),
  description: z.string(),
  institution: z.string(),
  email: z.string(),
  /**
   * Captions for the pictures in content/covers/, keyed by page -
   * "home", "news", "join-us", and so on. Optional; the picture shows either way.
   */
  coverCaptions: z.record(z.string(), z.string()).default({}),
  nav: z.array(navItem),
  /** Featured on the front page as well as in the footer. */
  community: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        description: z.string(),
        logo: z.string().optional(),
      }),
    )
    .default([]),
  social: z.array(link),
  /** The university, institutes, and funders shown at the foot of the home page. */
  affiliations: z
    .array(
      z.object({
        label: z.string(),
        href: z.string().optional(),
        /** File name in content/affiliations/, when it differs from the label. */
        logo: z.string().optional(),
        /**
         * Show the logo as a plain white mark instead of on a white plate.
         * Only for artwork on a transparent background.
         */
        white: z.boolean().default(false),
      }),
    )
    .default([]),
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
  /** Shown as a thumbnail in the list and full width on the paper's page. */
  image: picturePath.optional(),
  imageAlt: z.string().optional(),
  /** Free text shown on the paper's own page. */
  abstract: z.string().optional(),
  bibtex: z.string().optional(),
  /**
   * The record at the publisher. A bare DOI ("10.1109/TAC.2025.123456") or the
   * full address; either way it is shown as a DOI link.
   */
  doi: z.string().optional(),
  /** Openly readable full text — arXiv, a repository, a direct PDF. */
  pdf: z.string().optional(),
  /** Anything else worth linking: a video, the code, a dataset. */
  links: z.array(link).default([]),
});

/**
 * Order matters: it is the order of the filter buttons, and of the three zones
 * on the page. Work under review leads, published work follows by year, and
 * the notes that were never headed for a journal come last.
 */
const PUBLICATION_KINDS = [
  { key: "preprint", label: "In review" },
  { key: "journal", label: "Journal" },
  { key: "conference", label: "Conference" },
  { key: "technote", label: "Tech note" },
] as const;

export type PublicationKind = (typeof PUBLICATION_KINDS)[number]["key"];

const publicationsFile = load(
  "publications.yaml",
  z.object({
    journal: z.array(publication).default([]),
    conference: z.array(publication).default([]),
    preprint: z.array(publication).default([]),
    technote: z.array(publication).default([]),
  }),
);

export type Publication = z.infer<typeof publication> & {
  kind: PublicationKind;
  kindLabel: string;
  slug: string;
};

/** A bare DOI becomes a link; anything already a URL is left alone. */
function doiUrl(doi: string): string {
  return /^https?:\/\//.test(doi) ? doi : `https://doi.org/${doi.replace(/^doi:/i, "")}`;
}

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .split("-")
    .slice(0, 10)
    .join("-");
}

/** Every paper, flattened, tagged with its kind, and given a stable address. */
export const publications: Publication[] = (() => {
  const seen = new Set<string>();
  return PUBLICATION_KINDS.flatMap(({ key, label }) =>
    publicationsFile[key].map((entry) => {
      let slug = slugify(entry.title) || entry.ref.toLowerCase();
      if (seen.has(slug)) slug = `${slug}-${entry.ref.toLowerCase()}`;
      seen.add(slug);
      // DOI and PDF lead, being the two nearly every paper has; anything
      // else follows alphabetically, so the order never depends on how the
      // YAML happens to be written.
      const extra = [...entry.links].sort((a, b) =>
        a.label.localeCompare(b.label, "en", { sensitivity: "base" }),
      );
      const links = [
        ...(entry.doi ? [{ label: "DOI", href: doiUrl(entry.doi) }] : []),
        ...(entry.pdf ? [{ label: "PDF", href: entry.pdf }] : []),
        ...extra,
      ];
      return { ...entry, links, kind: key, kindLabel: label, slug };
    }),
  );
})();

export const publicationKinds = PUBLICATION_KINDS.filter(({ key }) =>
  publications.some((entry) => entry.kind === key),
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
        image: picturePath.optional(),
        imageAlt: z.string().optional(),
        /** Several pictures instead of one: they become a carousel. */
        images: z.array(picturePath).default([]),
        /**
         * Who received it. Use the file name of a person in content/team to
         * link to them, e.g. "hector-garcia-de-marina"; anything else is shown
         * as plain text.
         */
        members: z.array(z.string()).default([]),
        /** Optional references: the project page, the official call, a PDF. */
        links: z.array(link).default([]),
        /**
         * Force the white plate on or off. Left out, a logo that can have
         * see-through parts gets one and a photograph does not.
         */
        plate: z.boolean().optional(),
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
        image: picturePath.optional(),
        imageAlt: z.string().optional(),
      }),
    ),
    aside: z
      .object({
        title: z.string(),
        body: z.string(),
        /** Shown as a carousel beside the text. */
        photos: z.array(picturePath).default([]),
      })
      .optional(),
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
        image: picturePath.optional(),
        imageAlt: z.string().optional(),
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
    /** The YouTube channel, linked from the top of the media page. */
    channel: z.object({ href: z.string(), label: z.string(), description: z.string() }).optional(),
    videos: z.array(
      z.object({
        youtube: z.string(),
        title: z.string(),
        date: z.string().optional(),
        /** Pulled out onto the front page. */
        featured: z.boolean().default(false),
      }),
    ),
    captions: z.record(z.string(), z.string()).default({}),
  }),
);

/**
 * The videos shown on the front page: the ones marked `featured: true`, or the
 * three most recent when nobody has marked any.
 */
export const featuredVideos = (() => {
  const chosen = mediaConfig.videos.filter((video) => video.featured);
  return chosen.length > 0 ? chosen : mediaConfig.videos.slice(0, 3);
})();
