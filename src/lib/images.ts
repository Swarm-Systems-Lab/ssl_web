import type { ImageMetadata } from "astro";

/**
 * Resolves picture paths written in content files.
 *
 * Markdown frontmatter goes through Astro's own `image()` schema, which only
 * works inside a content collection. The YAML files are not collections, so
 * this module does the same job for them: it indexes everything under
 * content/ at build time and hands back either an `ImageMetadata` (which the
 * <Picture> component optimises) or a plain URL for formats that must be
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

/** Either an optimisable image or the URL of an asset served as-is. */
export type Picture = ImageMetadata | string;

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
export function picture(path: string): Picture {
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
export function optionalPicture(path?: string): Picture | undefined {
  return path ? picture(path) : undefined;
}

/**
 * Wider than this and a picture is treated as a wide shot rather than a
 * head-and-shoulders one, which changes how a person's page is laid out.
 * Real photos fall well either side of it: portraits sit around 0.7-1.0,
 * pictures taken in the field from 1.2 upwards.
 */
const PANORAMIC_RATIO = 0.8;

/**
 * True for a wide picture, false for a passport-style one. Formats served
 * as-is carry no dimensions, so they take the narrow layout.
 */
export function isPanoramic(picture: Picture): boolean {
  return typeof picture === "string" ? false : picture.width / picture.height > PANORAMIC_RATIO;
}

/** The URL of a picture, for <meta> tags and plain links. */
export function pictureUrl(value: Picture): string {
  return typeof value === "string" ? value : value.src;
}
