import { readdirSync, readFileSync, statSync, unlinkSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Deletes files in dist/_astro that nothing in the built site points at.
 *
 * Discovering covers, galleries, and folder photos means importing every
 * picture under content/ with `import.meta.glob`, and Vite emits a copy of
 * anything imported — whether or not it ends up on a page. That left every
 * full-size original in the output next to the resized variants actually used,
 * roughly doubling the size of the deploy.
 *
 * The check is a plain substring search for each emitted file name across the
 * built HTML, CSS, JS, and XML. File names carry a content hash, so a match is
 * a real reference; when in doubt the file is kept.
 */

const TEXT = new Set([".html", ".css", ".js", ".xml", ".json", ".txt", ".svg", ".webmanifest"]);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

export default function pruneUnusedAssets() {
  return {
    name: "prune-unused-assets",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const assets = join(root, "_astro");
        if (!existsSync(assets)) return;

        let haystack = "";
        for (const file of walk(root)) {
          if (TEXT.has(extname(file))) haystack += readFileSync(file, "utf8");
        }

        let removed = 0;
        let bytes = 0;
        for (const name of readdirSync(assets)) {
          if (haystack.includes(name) || haystack.includes(encodeURI(name))) continue;
          const path = join(assets, name);
          bytes += statSync(path).size;
          unlinkSync(path);
          removed += 1;
        }

        if (removed > 0) {
          logger.info(`pruned ${removed} unreferenced files (${(bytes / 1e6).toFixed(1)} MB)`);
        }
      },
    },
  };
}
