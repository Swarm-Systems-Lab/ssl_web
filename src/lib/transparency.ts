import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Whether a picture can have see-through parts, and so needs a white plate to
 * be legible on the dark page.
 *
 * Worked out from the file itself rather than asked of the author: a logo
 * saved as a transparent PNG is invisible against a dark background, and
 * nobody should have to remember which of their files are which.
 */

const contentDir = new URL("../../content/", import.meta.url);

/** PNG layout: 8-byte signature, then the IHDR chunk. Byte 25 is colour type. */
function pngHasAlpha(bytes: Buffer): boolean {
  const colourType = bytes[25];
  if (colourType === 4 || colourType === 6) return true; // grey+alpha, RGBA
  if (colourType === 3) return bytes.includes(Buffer.from("tRNS")); // palette
  return false;
}

/** `path` is relative to content/, as written in the YAML files. */
export function hasTransparency(path: string): boolean {
  const extension = path.slice(path.lastIndexOf(".")).toLowerCase();

  if (extension === ".svg") return true;
  if (extension === ".jpg" || extension === ".jpeg") return false;
  if (extension !== ".png") return true; // WebP and AVIF: assume it might

  const file = fileURLToPath(new URL(path.replace(/^\.?\//, ""), contentDir));
  return pngHasAlpha(readFileSync(file));
}
