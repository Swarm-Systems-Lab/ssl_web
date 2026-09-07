import { getImage } from "astro:assets";
import { IMAGE_QUALITY } from "./images";

/**
 * The still for a YouTube video, cropped to 16:9 and served from our own files.
 *
 * YouTube keeps several sizes. Only `hqdefault` exists for every video, and it
 * is a 4:3 frame with the video letterboxed inside it - the black band above
 * and below. `maxresdefault` is a true 16:9 frame at 1280x720, but only for
 * videos uploaded at that resolution.
 *
 * So: ask whether the big one exists, take it if it does, and crop either to
 * 16:9 on the way through. Fetching them at build time also means a visitor's
 * browser never asks Google for anything in order to show a page.
 *
 * `getImage` only records the transform - the download happens later, while
 * the build writes files - so a missing size has to be found out here, with a
 * request of our own, rather than by catching an error from it.
 */

const url = (id: string, file: string) => `https://i.ytimg.com/vi/${id}/${file}`;

const cache = new Map<string, Promise<string>>();

async function render(id: string): Promise<string> {
  const big = url(id, "maxresdefault.jpg");
  let exists: boolean;

  try {
    exists = (await fetch(big, { method: "HEAD" })).ok;
  } catch {
    // No network. Astro could not fetch the still either, so hand back the
    // address itself: a band on the picture beats a broken build.
    return url(id, "hqdefault.jpg");
  }

  const source = exists ? big : url(id, "hqdefault.jpg");
  const width = exists ? 1280 : 480;

  const rendered = await getImage({
    src: source,
    width,
    height: Math.round((width * 9) / 16),
    // Cover crops the letterboxing off rather than squashing the picture.
    fit: "cover",
    position: "center",
    format: "webp",
    quality: IMAGE_QUALITY,
  });
  return rendered.src;
}

export function youtubeStill(id: string): Promise<string> {
  const made = cache.get(id) ?? render(id);
  cache.set(id, made);
  return made;
}
