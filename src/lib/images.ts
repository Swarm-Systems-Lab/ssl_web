import type { ImageMetadata } from "astro";

/**
 * Resolves picture paths written in content files.
 *
 * Markdown frontmatter goes through Astro's own `image()` schema, which only
 * works inside a content collection. The YAML files are not collections, so
 * this module does the same job for them: it indexes everything under
 * content/ at build time and hands back either an `ImageMetadata` (which the
 * <Media> component optimises) or a plain URL for formats that must be
 * served untouched.
 */

/** Formats worth resizing and converting to WebP. */
const photos = import.meta.glob<{ default: ImageMetadata }>(
  "/content/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

/** Animations, video, and vectors are copied through as they are. */
const assets = import.meta.glob<string>("/content/**/*.{gif,mp4,webm,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

/**
 * One piece of media: an optimisable image, or a string - the URL of an asset
 * served as it is (a GIF, an SVG, an .mp4), or "youtube:<id>" for a video that
 * has no file at all. See lib/video.ts.
 */
export type Media = ImageMetadata | string;

/**
 * WebP quality for every picture on the site.
 */
export const IMAGE_QUALITY = 80;

export const photoEntries = Object.entries(photos).map(
  ([path, mod]) => [path, mod.default] as const,
);
export const assetEntries = Object.entries(assets);

function normalise(path: string): string {
  const clean = path.trim().replace(/^\.?\//, "");
  return clean.startsWith("content/") ? `/${clean}` : `/content/${clean}`;
}

/**
 * Looks up a picture written in a YAML file, e.g. `images/granada/alhambra.jpg`.
 * Paths are relative to content/. Throws a message naming the file and the
 * closest matches, so a typo is obvious in the build log.
 */
export function picture(path: string): Media {
  const key = normalise(path);
  const found = photos[key]?.default ?? assets[key];
  if (found) return found;

  const name = key.split("/").pop() ?? key;
  const near = [...Object.keys(photos), ...Object.keys(assets)]
    .filter((candidate) => candidate.endsWith(`/${name}`))
    .map((candidate) => candidate.replace("/content/", ""));

  throw new Error(
    `Picture not found: "${path}" (looked for ${key}).` +
      (near.length ? `\nDid you mean: ${near.join(", ")}?` : "") +
      `\nPaths in YAML are relative to content/, for example "images/team.jpg".`,
  );
}

/** Same, but returns undefined instead of throwing when the field is unset. */
export function optionalPicture(path?: string): Media | undefined {
  return path ? picture(path) : undefined;
}

/** The URL of a picture, for <meta> tags and plain links. */
export function pictureUrl(value: Media): string {
  return typeof value === "string" ? value : value.src;
}
