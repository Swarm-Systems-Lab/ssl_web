import { parse } from "yaml";
import { z } from "astro:content";
import { photoEntries, assetEntries, type Media } from "./images";
import { youtubeRef } from "./video";

/**
 * Per-picture display settings, written next to the pictures they describe.
 *
 * Any folder holding pictures may carry an `images.yaml`. It is optional, and
 * it only has to mention the pictures that need something other than the
 * default - everything else is left alone:
 *
 *   content/team/photos/images.yaml
 *     01-lab-retreat.jpg:
 *       focus: top          # keep the faces in frame when the picture is cropped
 *       zoom: 1.4           # and crop in closer than the frame would
 *       caption: The lab in May
 *
 *     videos:               # media with no file to drop in the folder
 *       - youtube: https://youtu.be/55N0cbsjq08
 *         caption: The swarm in the field
 *         cover: true       # lead the page with it
 *
 * The settings travel with the file, so the same picture is framed the same
 * way wherever it is shown - a gallery, a thumbnail, a page cover.
 *
 * A key naming a file that is not in the folder stops the build: a typo there
 * would otherwise be silently ignored, which is the one thing a settings file
 * must never do.
 */

/** Where to anchor a picture that has to be cropped to fit its frame. */
const KEYWORD = /^(top|bottom|left|right|center)(-(top|bottom|left|right|center))?$/;
/** Or an exact spot, as CSS percentages: "50% 20%". */
const PERCENT = /^\d{1,3}% \d{1,3}%$/;

const settings = z
  .object({
    /**
     * Which part of the picture to keep when it is cropped: a keyword such as
     * `top` or `left-bottom`, or percentages like `50% 20%`. Only has an
     * effect where the frame's shape differs from the picture's.
     */
    focus: z
      .string()
      .refine((value) => KEYWORD.test(value) || PERCENT.test(value), {
        message: 'must be a keyword like "top" or "left-bottom", or percentages like "50% 20%"',
      })
      .optional(),
    /**
     * How much closer to crop in, where 1 is the whole frame and 1.5 is half
     * again as close. Anchored on `focus`, so the two work together: focus
     * says where to look, zoom says how close.
     */
    zoom: z.number().min(1).max(4).optional(),
    /** Overrides the caption worked out from the file name. */
    caption: z.string().optional(),
    /** Overrides the alt text, which otherwise follows the caption. */
    alt: z.string().optional(),
  })
  .strict();

export type Display = z.infer<typeof settings>;

/**
 * A video that belongs to this folder but has no file in it. It joins the
 * folder's media, so it can be the page's cover or one of its slides.
 */
const video = z
  .object({
    /** The id, or any link YouTube gives you. */
    youtube: z.string(),
    caption: z.string().optional(),
    alt: z.string().optional(),
    /** Lead the page with it, instead of the first picture. */
    cover: z.boolean().default(false),
  })
  .strict();

export type FolderVideo = { src: string; caption?: string; alt?: string; cover: boolean };

/** `videos:` is the one key that is not a file name; the rest are. */
const sheet = z.object({ videos: z.array(video).default([]) }).catchall(settings);

// Every folder under content/ may hold one. Read as text and parsed here, the
// same way the top-level YAML files are, so the messages match.
const sheets = import.meta.glob<string>("/content/**/images.yaml", {
  eager: true,
  query: "?raw",
  import: "default",
});

const pictures = [...photoEntries, ...assetEntries] as [string, Media][];
const known = new Set(pictures.map(([path]) => path));

function read(sheetPath: string, raw: string): [string, Display][] {
  const folder = sheetPath.slice(0, sheetPath.lastIndexOf("/") + 1);
  const result = sheet.safeParse(parse(raw) ?? {});

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`${sheetPath.replace(/^\//, "")} is not valid:\n${problems}\n`);
  }

  return Object.entries(result.data).flatMap(([file, value]) => {
    if (file === "videos") return [];
    if (!known.has(folder + file)) {
      const here = [...known]
        .filter((path) => path.startsWith(folder) && !path.slice(folder.length).includes("/"))
        .map((path) => path.slice(folder.length));
      throw new Error(
        `${sheetPath.replace(/^\//, "")} mentions "${file}", which is not in that folder.\n` +
          `Pictures here: ${here.join(", ") || "(none)"}\n`,
      );
    }
    return [[folder + file, value] as [string, Display]];
  });
}

const byPath = new Map<string, Display>(
  Object.entries(sheets).flatMap(([path, raw]) => read(path, raw)),
);

/** The videos each folder declares, in the order written. */
const videosByFolder = new Map<string, FolderVideo[]>(
  Object.entries(sheets).map(([sheetPath, raw]) => {
    const folder = sheetPath.slice(0, sheetPath.lastIndexOf("/") + 1);
    const parsed = sheet.safeParse(parse(raw) ?? {});
    const listed = parsed.success ? parsed.data.videos : [];
    return [
      folder,
      listed.map((entry) => ({
        src: youtubeRef(entry.youtube),
        caption: entry.caption,
        alt: entry.alt,
        cover: entry.cover,
      })),
    ];
  }),
);

/** Videos belonging to a folder, e.g. "/content/news/a-post/". */
export function videosIn(folder: string): FolderVideo[] {
  return videosByFolder.get(folder) ?? [];
}

/** Built URL back to the file it came from, so a picture can find its own row. */
const pathByUrl = new Map(pictures.map(([path, value]) => [urlOf(value), path]));

function urlOf(picture: Media): string {
  return typeof picture === "string" ? picture : picture.src;
}

/** Settings for a picture, wherever it was resolved from. */
export function displayFor(picture?: Media): Display | undefined {
  if (!picture) return undefined;
  const path = pathByUrl.get(urlOf(picture));
  return path ? byPath.get(path) : undefined;
}

/** Same, for code that still has the content path in hand. */
export function displayForPath(path: string): Display | undefined {
  return byPath.get(path);
}

/**
 * A focus keyword as CSS. `left-bottom` and `50% 20%` both go through
 * unchanged apart from the hyphen, which CSS writes as a space.
 */
export function objectPosition(focus?: string): string | undefined {
  return focus?.replace(/-/g, " ");
}
