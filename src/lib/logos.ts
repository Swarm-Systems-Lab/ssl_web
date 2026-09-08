import type { ImageMetadata } from "astro";
import type { Media } from "./images";

/**
 * Logos: our outside links, and the institutions and funders behind the lab.
 *
 * They live together in content/logos/, because they are found the same way -
 * drop the official file in, named after the label it belongs to, and it is
 * used. Subfolders are for the institutions that publish a whole set, and a
 * file inside one can be named by its path.
 *
 * SVGs are served untouched - resizing a vector is meaningless, and the image
 * pipeline would rasterise it. Everything else goes through the pipeline like
 * any other picture, because an institution's logo often arrives as a PNG far
 * larger than the 40 px it is shown at.
 */

// Vite rewrites these at build time, so the arguments have to be literals.
const vector = import.meta.glob<string>("/content/logos/**/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const raster = import.meta.glob<{ default: ImageMetadata }>(
  "/content/logos/**/*.{png,webp,avif,jpg,jpeg}",
  { eager: true },
);

const FOLDER = "/content/logos/";

/** "Google Scholar" -> "google-scholar", so the file name is predictable. */
function slugify(label: string): string {
  return label
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * File names and labels are normalised the same way, so a file may be called
 * MICIU_AEI_GE.svg, miciu-aei-ge.svg, or "MICIU AEI GE.svg" and still be found.
 * Slashes survive, so a logo inside a folder can be named by its path.
 */
function key(value: string): string {
  return value.split("/").map(slugify).filter(Boolean).join("/");
}

const index = (() => {
  const files: [string, Media][] = [
    ...Object.entries(vector).map(([path, url]) => [path, url] as [string, Media]),
    ...Object.entries(raster).map(([path, mod]) => [path, mod.default] as [string, Media]),
  ];

  const paths = files.map(
    ([path, picture]) =>
      [path.slice(FOLDER.length).replace(/\.[^.]+$/, ""), picture] as [string, Media],
  );

  const map = new Map<string, Media>();
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
        `[logos] content/logos/${relative} and content/logos/${clash} ` +
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
})();

/**
 * The logo for a label, by its explicit file name or by the label itself.
 * `name` may be a bare name ("erc") or a path into a subfolder
 * ("ugr/vertical/UGR-MARCA-01-color").
 */
export function logoFor(label: string, name?: string): Media | undefined {
  return index.get(key(name ?? label));
}
