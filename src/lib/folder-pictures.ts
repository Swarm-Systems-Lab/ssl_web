import type { Slide } from "@/components/Carousel.astro";
import { describeFile } from "./filenames";
import { photoEntries, assetEntries, type Picture } from "./images";

/**
 * Pictures that live next to the Markdown file they belong to.
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
 */

const samePicture = (a: Picture, b: Picture) =>
  (typeof a === "string" ? a : a.src) === (typeof b === "string" ? b : b.src);

/** Pictures sitting directly inside one entry's folder, in file-name order. */
export function folderPictures(collection: string, id: string): [string, Picture][] {
  const folder = `/content/${collection}/${id}/`;
  const entries = [...photoEntries, ...assetEntries] as [string, Picture][];

  return entries
    .filter(([path]) => {
      if (!path.startsWith(folder)) return false;
      const rest = path.slice(folder.length);
      return !rest.includes("/") && !rest.startsWith("_");
    })
    .sort((a, b) => a[0].localeCompare(b[0]));
}

/** The first picture in an entry's folder, used when none is named explicitly. */
export function firstFolderPicture(collection: string, id: string): Picture | undefined {
  return folderPictures(collection, id)[0]?.[1];
}

export type PostPictures = {
  /** Shown at the top of the page and as the thumbnail in listings. */
  header?: Picture;
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
export function postPictures(
  collection: "news" | "research",
  id: string,
  data: {
    title: string;
    image?: Picture;
    gallery: { src: Picture; caption?: string }[];
  },
): PostPictures {
  const listed: Slide[] =
    data.gallery.length > 0
      ? data.gallery.map((item) => ({
          src: item.src,
          alt: item.caption ?? data.title,
          caption: item.caption,
        }))
      : folderPictures(collection, id).map(([path, src]) => {
          const { caption } = describeFile(path);
          return { src, alt: caption ?? data.title, caption };
        });

  const header = data.image ?? listed[0]?.src;

  return {
    header,
    slides: header ? listed.filter((slide) => !samePicture(slide.src, header)) : listed,
  };
}
