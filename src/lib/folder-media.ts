import type { Slide } from "@/components/Carousel.astro";
import { describeFile } from "./filenames";
import { videosIn, displayFor } from "./display";
import { photoEntries, assetEntries, type Media } from "./images";

/**
 * Media that lives next to the Markdown file it belongs to.
 *
 * Anything with pictures of its own gets a folder:
 *
 *   content/news/2026-09-03-time-to-go-home/
 *     index.md
 *     01-shanghai-jiao-tong.jpg
 *     02-ifac-busan.jpg
 *
 * Everything in that folder is picked up automatically, in file-name order, so
 * there is nothing to list. Files starting with "_" are skipped, and a nested
 * folder is ignored - somewhere to stash originals.
 *
 * A video with no file to drop in - a YouTube link - is written in the
 * folder's media.yaml instead, and joins the media as if it were there.
 */

/** The same file, whether it arrived as a path or as an imported picture. */
export const samePicture = (a: Media, b: Media) =>
  (typeof a === "string" ? a : a.src) === (typeof b === "string" ? b : b.src);

/**
 * Everything belonging to one entry: the pictures in its folder, in file-name
 * order, and the videos its media.yaml declares. A video marked `cover:`
 * leads; the rest follow the pictures.
 */
export function folderMedia(collection: string, id: string, fallbackAlt: string): Slide[] {
  const files = folderFiles(collection, id).map(([path, src]) => {
    const { caption } = describeFile(path);
    return { src, alt: caption ?? fallbackAlt, caption };
  });

  const videos = videosIn(`/content/${collection}/${id}/`);
  // A video's caption and alt live with its other settings, under the
  // reference it travels as.
  const asSlide = (video: (typeof videos)[number]) => {
    const said = displayFor(video.src);
    return {
      src: video.src,
      alt: said?.alt ?? said?.caption ?? fallbackAlt,
      caption: said?.caption,
    };
  };

  return [
    ...videos.filter((video) => video.cover).map(asSlide),
    ...files,
    ...videos.filter((video) => !video.cover).map(asSlide),
  ];
}

/** Files sitting directly inside one entry's folder, in file-name order. */
export function folderFiles(collection: string, id: string): [string, Media][] {
  const folder = `/content/${collection}/${id}/`;
  const entries = [...photoEntries, ...assetEntries] as [string, Media][];

  return entries
    .filter(([path]) => {
      if (!path.startsWith(folder)) return false;
      const rest = path.slice(folder.length);
      return !rest.includes("/") && !rest.startsWith("_");
    })
    .sort((a, b) => a[0].localeCompare(b[0]));
}

/** The first picture in an entry's folder, used when none is named explicitly. */
export function firstFolderFile(collection: string, id: string): Media | undefined {
  return folderFiles(collection, id)[0]?.[1];
}

export type PostMedia = {
  /** Shown at the top of the page and as the thumbnail in listings. */
  header?: Media;
  /** Everything else, as a carousel. Never repeats the header. */
  slides: Slide[];
};

/**
 * Works out a post's header picture and its carousel.
 *
 * `image:` in the frontmatter wins; otherwise the first picture found is
 * promoted to the header. `gallery:` in the frontmatter replaces the automatic
 * folder scan when the order or the captions matter.
 */
export function postMedia(
  collection: "news" | "research",
  id: string,
  data: {
    title: string;
    image?: Media;
    gallery: { src: Media; caption?: string }[];
  },
): PostMedia {
  const listed: Slide[] =
    data.gallery.length > 0
      ? data.gallery.map((item) => ({
          src: item.src,
          alt: item.caption ?? data.title,
          caption: item.caption,
        }))
      : folderMedia(collection, id, data.title);

  // A video marked `cover:` outranks `image:` in the frontmatter - it is the
  // only way to say that a video leads, since `image:` cannot name one.
  const leading = videosIn(`/content/${collection}/${id}/`).find((video) => video.cover);
  const header = leading?.src ?? data.image ?? listed[0]?.src;

  return {
    header,
    slides: header ? listed.filter((slide) => !samePicture(slide.src, header)) : listed,
  };
}
