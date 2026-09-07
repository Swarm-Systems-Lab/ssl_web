import { getImage } from "astro:assets";
import type { Picture } from "./images";

/**
 * The widest a picture is ever shown at. Big enough to fill a laptop screen,
 * small enough that a 7 MB photo straight from a camera never travels down the
 * wire when someone opens it.
 */
const MAX_WIDTH = 1600;

/**
 * The URL of a picture at viewing size, for the lightbox and for plain
 * "view full size" links. Undefined for video, which has nothing to open.
 */
export async function fullSize(picture: Picture): Promise<string | undefined> {
  // GIFs and vectors are served as they are, so their own URL is the full size.
  if (typeof picture === "string") {
    return /\.(mp4|webm)$/.test(picture) ? undefined : picture;
  }

  const rendered = await getImage({
    src: picture,
    width: Math.min(picture.width, MAX_WIDTH),
    format: "webp",
  });
  return rendered.src;
}
