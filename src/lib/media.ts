import type { ImageMetadata } from "astro";
import { mediaConfig } from "./data";

/**
 * The media gallery is built by scanning content/media/ at build time.
 * Dropping a file into that folder is enough to publish it — no list to edit.
 *
 * Filename convention: YYYY-MM-DD_short-caption.jpg
 *   - the date prefix sets the ordering (newest first) and the shown date
 *   - the rest becomes the caption, unless overridden in content/media.yaml
 * A file without a date prefix still works; it just sorts last.
 */

export type MediaItem = {
  file: string;
  caption: string;
  date?: string;
  /** Photos are optimised by Astro; animations are served as-is. */
  kind: "photo" | "animation" | "video";
  image?: ImageMetadata;
  url?: string;
};

// Photos go through Astro's image pipeline (resized, converted, hashed).
const photos = import.meta.glob<{ default: ImageMetadata }>(
  "/content/media/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

// GIFs and clips are copied verbatim: optimising an animation would flatten it.
const animations = import.meta.glob<string>("/content/media/**/*.{gif,mp4,webm}", {
  eager: true,
  query: "?url",
  import: "default",
});

const DATED = /^(\d{4}-\d{2}-\d{2})[_-](.*)$/;

function describe(path: string) {
  const file = path.split("/").pop() ?? path;
  const stem = file.replace(/\.[^.]+$/, "");
  const match = DATED.exec(stem);
  const date = match?.[1];
  const words = (match?.[2] ?? stem).replace(/[_-]+/g, " ").trim();
  const auto = words.charAt(0).toUpperCase() + words.slice(1);

  return { file, date, caption: mediaConfig.captions[file] ?? auto };
}

function byDateDesc(a: MediaItem, b: MediaItem) {
  return (b.date ?? "").localeCompare(a.date ?? "");
}

export const gallery: MediaItem[] = [
  ...Object.entries(photos).map(([path, mod]) => ({
    ...describe(path),
    kind: "photo" as const,
    image: mod.default,
  })),
  ...Object.entries(animations).map(([path, url]) => ({
    ...describe(path),
    kind: (path.endsWith(".gif") ? "animation" : "video") as "animation" | "video",
    url,
  })),
].sort(byDateDesc);
