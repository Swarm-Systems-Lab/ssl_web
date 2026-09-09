import { site } from "./data";
import { describeFile } from "./filenames";
import { videosIn, displayFor, displayForPath } from "./display";
import { youtubeRef } from "./video";
import { photoEntries, assetEntries, type Media } from "./images";
import { kindOf, type MediaKind } from "./media-item";

/**
 * The media gallery is built by scanning content/media/ at build time.
 * Dropping a file into that folder is enough to publish it - no list to edit.
 *
 * Filename convention: YYYY-MM-DD_anything.jpg
 *   - the date prefix sets the ordering (newest first) and the shown date
 *   - the rest is for whoever is looking at the folder, and is not shown
 * A file without a date prefix still works; it just sorts last. A file whose
 * name starts with "_" is kept out of the gallery - use that for pictures the
 * site needs but should not list, such as a clip's poster frame.
 *
 * What each item says comes from content/media/media.yaml and nowhere else. A
 * caption read off a file name cannot be translated, and would quietly leave
 * one language's words on a page in another - so a file with no caption in the
 * sheet stops the build instead.
 */

const FOLDER = "/content/media/";

export type MediaItem = {
  file: string;
  caption: string;
  date?: string;
  /** What it is, and so where the page puts it. See lib/media-item.ts. */
  kind: MediaKind;
  src: Media;
};

function describe(path: string) {
  const { file, date } = describeFile(path);
  const caption = displayForPath(path)?.caption;

  if (!caption) {
    throw new Error(
      `content/media/media.yaml has no caption for "${file}".\n` +
        `Every picture and clip on the media page needs one: the file name is ` +
        `not used for it, so that the page can be translated.\n`,
    );
  }

  return { file, date, caption };
}

/** The YouTube videos this folder declares, alongside the files in it. */
const declared = videosIn(FOLDER).map((video) => {
  const said = displayFor(video.src);
  if (!said?.caption) {
    throw new Error(
      `content/media/media.yaml declares the video "${video.src}" with no caption.\n`,
    );
  }
  return {
    file: video.src,
    caption: said.caption,
    date: video.date,
    kind: "video" as const,
    src: video.src as Media,
  };
});

const listed = (path: string) =>
  path.startsWith(FOLDER) && !(path.split("/").pop() ?? "").startsWith("_");

const inFolder = <T>(entries: readonly (readonly [string, T])[]) =>
  entries.filter(([path]) => listed(path));

export const gallery: MediaItem[] = [
  ...inFolder(photoEntries).map(([path, image]) => ({
    ...describe(path),
    kind: kindOf(image as Media),
    src: image as Media,
  })),
  ...inFolder(assetEntries).map(([path, url]) => ({
    ...describe(path),
    kind: kindOf(url as Media),
    src: url as Media,
  })),
  ...declared,
  // Newest first. Anything without a date in its name has nowhere to sit in
  // that order, so it goes at the end rather than at the front.
].sort((a, b) => {
  if (!a.date || !b.date) return Number(Boolean(b.date)) - Number(Boolean(a.date));
  return b.date.localeCompare(a.date);
});

/**
 * Everything to press play on, ours and YouTube's together, newest first.
 * Where it is hosted is not something a reader cares about.
 */
export const videos = gallery
  .filter((item) => item.kind !== "image")
  .map((item) => ({ src: item.src, title: item.caption, date: item.date }));

/**
 * What the front page shows in its strip of media: the pieces named in
 * `fromTheField` in site.yaml, in the order they are named there.
 *
 * Each is either a file in content/media/ or a YouTube video declared beside
 * it. A name that matches nothing stops the build rather than quietly leaving
 * a hole in the front page.
 */
export const fromTheField = site.fromTheField.items.map((wanted) => {
  const ref = (() => {
    try {
      return youtubeRef(wanted);
    } catch {
      return undefined;
    }
  })();

  const found = gallery.find((item) => item.file === wanted || (ref && item.file === ref));
  if (!found) {
    throw new Error(
      `content/site.yaml asks the front page for "${wanted}", which is not in the media gallery.\n` +
        `Name a file in content/media/, or a YouTube video listed in its media.yaml.\n` +
        `Available: ${gallery.map((item) => item.file).join(", ")}\n`,
    );
  }
  return { src: found.src, title: found.caption, date: found.date };
});
