import { getImage } from "astro:assets";
import { youtubeId } from "./video";
import { youtubeStill } from "./poster";
import type { Media } from "./images";

/**
 * The picture used for link previews, in <meta property="og:image">.
 *
 * Pointing the tag at the file as uploaded makes Astro emit that file
 * untouched, which quietly shipped every full-size original alongside the
 * optimised variants. This renders a sensible preview size instead.
 *
 * JPEG rather than WebP: link scrapers are less consistent about WebP than
 * browsers are, and a preview that fails to render is worse than a larger one.
 */
export async function socialImage(picture?: Media): Promise<string | undefined> {
  if (!picture) return undefined;
  // A video has no still of its own except the one YouTube keeps.
  const video = youtubeId(picture);
  if (video) return youtubeStill(video);
  // Formats served as-is (GIF, clips) carry no metadata to resize from.
  if (typeof picture === "string") return picture;

  const rendered = await getImage({ src: picture, width: 1200, format: "jpeg" });
  return rendered.src;
}
