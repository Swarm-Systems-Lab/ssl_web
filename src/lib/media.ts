import { mediaConfig } from "./data";
import { describeFile } from "./filenames";
import { photoEntries, assetEntries, type Picture } from "./images";

/**
 * The media gallery is built by scanning content/media/ at build time.
 * Dropping a file into that folder is enough to publish it - no list to edit.
 *
 * Filename convention: YYYY-MM-DD_short-caption.jpg
 *   - the date prefix sets the ordering (newest first) and the shown date
 *   - the rest becomes the caption, unless overridden in content/media.yaml
 * A file without a date prefix still works; it just sorts last. A file whose
 * name starts with "_" is kept out of the gallery - use that for pictures the
 * site needs but should not list, such as the front-page cover.
 */

const FOLDER = "/content/media/";

export type MediaItem = {
  file: string;
  caption: string;
  date?: string;
  /** Photos are optimised; animations and clips are served as they are. */
  kind: "photo" | "animation" | "video";
  src: Picture;
};

function describe(path: string) {
  const { file, date, caption } = describeFile(path, mediaConfig.captions);
  return { file, date, caption: caption ?? file };
}

const listed = (path: string) =>
  path.startsWith(FOLDER) && !(path.split("/").pop() ?? "").startsWith("_");

const inFolder = <T>(entries: readonly (readonly [string, T])[]) =>
  entries.filter(([path]) => listed(path));

export const gallery: MediaItem[] = [
  ...inFolder(photoEntries).map(([path, image]) => ({
    ...describe(path),
    kind: "photo" as const,
    src: image as Picture,
  })),
  ...inFolder(assetEntries).map(([path, url]) => ({
    ...describe(path),
    kind: (path.endsWith(".gif") ? "animation" : "video") as "animation" | "video",
    src: url as Picture,
  })),
].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
