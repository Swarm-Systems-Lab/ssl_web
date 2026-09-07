import type { ImageMetadata } from "astro";
import type { Picture } from "./images";

/**
 * Logos, kept in two folders:
 *
 *   content/logos/         GitHub, YouTube, Discord - our outside links
 *   content/affiliations/  the university, institutes, and funders
 *
 * Drop the official file in, named after the label it belongs to, and it is
 * used.
 *
 * SVGs are served untouched - resizing a vector is meaningless, and the image
 * pipeline would rasterise it. Everything else goes through the pipeline like
 * any other picture, because an institution's logo often arrives as a PNG far
 * larger than the 40 px it is shown at.
 */

// Vite rewrites these at build time, so the arguments have to be literals.
const vector = {
  logos: import.meta.glob<string>("/content/logos/**/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  }),
  affiliations: import.meta.glob<string>("/content/affiliations/**/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  }),
};

const raster = {
  logos: import.meta.glob<{ default: ImageMetadata }>(
    "/content/logos/**/*.{png,webp,avif,jpg,jpeg}",
    {
      eager: true,
    },
  ),
  affiliations: import.meta.glob<{ default: ImageMetadata }>(
    "/content/affiliations/**/*.{png,webp,avif,jpg,jpeg}",
    { eager: true },
  ),
};

export type LogoFolder = keyof typeof vector;

/**
 * File names and labels are normalised the same way, so a file may be called
 * MICIU_AEI_GE.svg, miciu-aei-ge.svg, or "MICIU AEI GE.svg" and still be found.
 * Slashes survive, so a logo inside a folder can be named by its path.
 */
function key(value: string): string {
  return value.split("/").map(slugify).filter(Boolean).join("/");
}

function build(folder: LogoFolder): Map<string, Picture> {
  const prefix = `/content/${folder}/`;
  const files: [string, Picture][] = [
    ...Object.entries(vector[folder]).map(([path, url]) => [path, url] as [string, Picture]),
    ...Object.entries(raster[folder]).map(
      ([path, mod]) => [path, mod.default] as [string, Picture],
    ),
  ];

  const paths = files.map(
    ([path, picture]) =>
      [path.slice(prefix.length).replace(/\.[^.]+$/, ""), picture] as [string, Picture],
  );

  const map = new Map<string, Picture>();
  const seen = new Map<string, string>();

  // Full paths first, so a file sitting at the top level always owns its own
  // bare name - "ugr.png" stays `ugr` even with a ugr/ folder beside it.
  for (const [relative, picture] of paths) {
    const id = key(relative);
    // Two files can normalise to one name - "LOGO CE.svg" and "LOGO_CE.svg".
    // Say so rather than letting one quietly shadow the other.
    const clash = seen.get(id);
    if (clash) {
      console.warn(
        `[logos] content/${folder}/${relative} and content/${folder}/${clash} ` +
          `are both "${id}". Rename one, or refer to them by full path.`,
      );
    }
    seen.set(id, relative);
    map.set(id, picture);
  }
  // Then a short alias for anything nested, where the name is still free.
  for (const [relative, picture] of paths) {
    const bare = key(relative.split("/").pop() ?? relative);
    if (!map.has(bare)) map.set(bare, picture);
  }
  return map;
}

const index = new Map<LogoFolder, Map<string, Picture>>(
  (Object.keys(vector) as LogoFolder[]).map((folder) => [folder, build(folder)]),
);

/** "Google Scholar" -> "google-scholar", so the file name is predictable. */
function slugify(label: string): string {
  return label
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * The logo for a label, by its explicit file name or by the label itself.
 * `name` may be a bare name ("erc") or a path into a subfolder
 * ("ugr/vertical/UGR-MARCA-01-color").
 */
export function logoFor(
  label: string,
  name?: string,
  folder: LogoFolder = "logos",
): Picture | undefined {
  return index.get(folder)?.get(key(name ?? label));
}
