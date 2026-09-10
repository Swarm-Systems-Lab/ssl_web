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

// -- pages.yaml --------------------------------------------------------------

/**
 * A piece of prose that can appear on any page. `before` and `after` take a
 * list of them, so adding a footnote to the news page, or a paragraph to the
 * front page, is a few lines of YAML and no change here.
 *
 * A new kind is added in three places and works everywhere at once: a member
 * below, a branch in Blocks.astro, and a line in the comment at the top of
 * pages.yaml.
 */
const block = z.union(
  [
    /** A labelled divider, as over "In the press". */
    z.object({ heading: z.string() }).strict(),
    /** Small print under a rule, as under the fleet listing. */
    z.object({ note: z.string() }).strict(),
    /** An ordinary paragraph. */
    z.object({ prose: z.string() }).strict(),
  ],
  // Without this, a mistyped kind reports only "Invalid input", which says
  // nothing about what was allowed instead.
  { errorMap: () => ({ message: "must be one of: heading, note, prose" }) },
);

export type Block = z.infer<typeof block>;

/**
 * What one page says. Everything is optional because a page declares only what
 * it shows: the front page has no header, the 404 has no listing.
 *
 * `labels` is deliberately a free-form map rather than a named field per page.
 * The alternative - one optional key here for every string any page happens to
 * need - grows with the site and makes this schema the union of every page's
 * requirements, so that adding a page means editing it. A page asks for the
 * label it wants by name, and `label()` fails the build if it is missing.
 */
const pageSchema = z
  .object({
    /** The browser tab and the search-result summary. */
    seo: z.object({ title: z.string().optional(), description: z.string() }).optional(),
    /**
     * The block at the top of the page. `title` is here rather than in the page
     * because it is words, and words get translated - the split into a plain
     * half and an accented one is spelled out rather than assumed.
     */
    header: z
      .object({
        eyebrow: z.string(),
        title: z.string(),
        /** The tail of `title` shown in muted type. */
        accent: z.string().optional(),
        intro: z.string().optional(),
      })
      .optional(),
    /** Prose above and below whatever the page itself renders. */
    before: z.array(block).default([]),
    after: z.array(block).default([]),
    /** Single words and lines the page's own parts ask for by name. */
    labels: z.record(z.string(), z.string()).default({}),
    /** join-us: the two cards. The only structured copy tied to one page. */
    cards: z
      .array(z.object({ eyebrow: z.string(), title: z.string(), body: z.string() }))
      .optional(),
  })
  .strict();

const pages = load("pages.yaml", z.record(z.string(), pageSchema));

export type PageText = z.infer<typeof pageSchema>;

/**
 * The text for one page. An unknown name stops the build with the list of what
 * is there - a page rendering with no words at all is the kind of thing that
 * reaches the site unnoticed.
 */
export function pageText(name: string): PageText {
  const found = pages[name];
  if (!found) {
    throw new Error(
      `content/pages.yaml has no block named "${name}".\n` +
        `Available: ${Object.keys(pages).join(", ")}\n`,
    );
  }
  return found;
}

/**
 * One of a page's labels, by name.
 *
 * Labels are a loose map, so nothing checks at parse time that a page has the
 * one it needs. This is where that is checked instead: a page asking for a
 * label it has not been given stops the build naming both, rather than
 * rendering a blank where a word should be.
 */
export function label(text: PageText, name: string, where: string): string {
  const found = text.labels[name];
  if (!found) {
    const had = Object.keys(text.labels).join(", ") || "(none)";
    throw new Error(`content/pages.yaml: "${where}" has no label "${name}". Has: ${had}\n`);
  }
  return found;
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
  /**
   * The strip of media on the front page: what it is called, and which pieces
   * of the media gallery it shows, named one by one and in the order they
   * should appear.
   */
  fromTheField: z
    .object({
      heading: z.string().default("From the field"),
      /**
       * Each one is either a file name in content/media/ - "2025-10-14.png" -
       * or a YouTube id or link. A name that matches nothing stops the build.
       */
      items: z.array(z.string()).default([]),
    })
    .default({}),
  nav: z.array(navItem),
  /** Footer-only links: pages kept, but not worth a tab of their own. */
  more: z.array(link).default([]),
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
        /** File name in content/logos/, when it differs from the label. */
        logo: z.string().optional(),
        /**
         * Show the logo as a plain single-colour mark instead of on a white
         * plate: black on the light theme, white on the dark one. Only for
         * artwork on a transparent background.
         */
        mono: z.boolean().default(false),
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
  /** Openly readable full text - arXiv, a repository, a direct PDF. */
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

// -- press.yaml --------------------------------------------------------------

/**
 * Coverage of the lab by newspapers, TV, radio, and institutional news
 * outlets. Sorted here rather than in the file, so whoever adds a piece can
 * paste it anywhere in the list.
 */
export const press = load(
  "press.yaml",
  z.object({
    items: z
      .array(
        z.object({
          /** When it was published or broadcast, as YYYY-MM-DD. */
          date: z.coerce.date(),
          /** Who published it, e.g. "Ideal", "Canal Sur". */
          outlet: z.string(),
          /** The headline, as printed. */
          title: z.string(),
          href: z.string(),
          /** Changes the wording on the card from "Read" to "Watch". */
          kind: z.enum(["article", "video"]).default("article"),
          /** For radio and TV, the programme it went out on. */
          programme: z.string().optional(),
          /** Shown on the card when the piece is not in English, e.g. "ES". */
          language: z.string().optional(),
        }),
      )
      .default([]),
  }),
);

press.items.sort((a, b) => b.date.getTime() - a.date.getTime());

// -- awards.yaml -------------------------------------------------------------

export const awards = load(
  "awards.yaml",
  z.object({
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

// -- student-projects.yaml ---------------------------------------------------

/** Master (TFM) and bachelor (TFG) offers. Not the lab's own projects. */
export const studentProjects = load(
  "student-projects.yaml",
  z.object({
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
    perPage: z.number().default(24),
    /** The YouTube channel, linked from the top of the media page. */
    channel: z.object({ href: z.string(), label: z.string(), description: z.string() }).optional(),
  }),
);
