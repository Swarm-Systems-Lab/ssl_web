import { getImage } from "astro:assets";
import type { Picture } from "./images";

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
export async function socialImage(picture?: Picture): Promise<string | undefined> {
  if (!picture) return undefined;
  // Formats served as-is (GIF, video) carry no metadata to resize from.
  if (typeof picture === "string") return picture;

  const rendered = await getImage({ src: picture, width: 1200, format: "jpeg" });
  return rendered.src;
}
