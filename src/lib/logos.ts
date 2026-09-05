import type { ImageMetadata } from "astro";
import type { Picture } from "./images";

/**
 * Logos, kept in two folders:
 *
 *   content/logos/         GitHub, YouTube, Discord — our outside links
 *   content/affiliations/  the university, institutes, and funders
 *
 * Drop the official file in, named after the label it belongs to, and it is
 * used.
 *
 * SVGs are served untouched — resizing a vector is meaningless, and the image
 * pipeline would rasterise it. Everything else goes through the pipeline like
 * any other picture, because an institution's logo often arrives as a PNG far
 * larger than the 40 px it is shown at.
 */

// Vite rewrites these at build time, so the arguments have to be literals.
const vector = {
  logos: import.meta.glob<string>("/content/logos/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  }),
  affiliations: import.meta.glob<string>("/content/affiliations/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  }),
};

const raster = {
  logos: import.meta.glob<{ default: ImageMetadata }>("/content/logos/*.{png,webp,avif,jpg,jpeg}", {
    eager: true,
  }),
  affiliations: import.meta.glob<{ default: ImageMetadata }>(
    "/content/affiliations/*.{png,webp,avif,jpg,jpeg}",
    { eager: true },
  ),
};

export type LogoFolder = keyof typeof vector;

function stem(path: string): string {
  return (path.split("/").pop() ?? "").replace(/\.[^.]+$/, "").toLowerCase();
}

const index = new Map<LogoFolder, Map<string, Picture>>(
  (Object.keys(vector) as LogoFolder[]).map((folder) => [
    folder,
    new Map<string, Picture>([
      ...Object.entries(vector[folder]).map(([path, url]) => [stem(path), url] as const),
      ...Object.entries(raster[folder]).map(([path, mod]) => [stem(path), mod.default] as const),
    ]),
  ]),
);

/** "Google Scholar" -> "google-scholar", so the file name is predictable. */
function slugify(label: string): string {
  return label
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The logo for a label, by its explicit file name or by the label itself. */
export function logoFor(
  label: string,
  name?: string,
  folder: LogoFolder = "logos",
): Picture | undefined {
  return index.get(folder)?.get(slugify(name ?? label));
}
