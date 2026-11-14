import { cpSync, existsSync, readdirSync, statSync, createReadStream } from "node:fs";
import { join, extname, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Serves content/interactive/ verbatim at /interactive/.
 *
 * Some papers come with pages of their own: an explainer, a playground of
 * simulators. They are finished, self-contained HTML files made with the paper
 * (Quarto, in the paper's repository), so the site does not render them. It
 * copies them as they are, and src/pages/publications/[slug]/[view].astro shows
 * each one inside the site's header and footer, at /publications/<slug>/<view>.
 * The bare file stays reachable too: that is the "open on its own" link.
 *
 * Files and folders starting with "_" stay out, as everywhere in content/, and so
 * does README.md. How to add a paper's pages: content/interactive/README.md.
 */

const SOURCE = fileURLToPath(new URL("../content/interactive/", import.meta.url));
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

const published = (name) => !name.startsWith("_") && name !== "README.md";

export default function interactive() {
  return {
    name: "interactive-pages",
    hooks: {
      // `bun run dev`: answer /interactive/... from content/interactive/
      "astro:server:setup": ({ server }) => {
        server.middlewares.use((req, res, next) => {
          const path = decodeURIComponent((req.url ?? "").split("?")[0]);
          const match = path.match(/^(?:\/[^/]+)*?\/interactive\/(.+)$/);
          if (!match) return next();
          const file = normalize(join(SOURCE, match[1]));
          const parts = file.slice(SOURCE.length).split(sep);
          if (!file.startsWith(SOURCE) || !parts.every(published)) return next();
          if (!existsSync(file) || !statSync(file).isFile()) return next();
          res.setHeader("Content-Type", TYPES[extname(file)] ?? "application/octet-stream");
          createReadStream(file).pipe(res);
        });
      },
      // `bun run build`: copy them into dist/interactive/
      "astro:build:done": ({ dir, logger }) => {
        if (!existsSync(SOURCE)) return;
        const target = join(fileURLToPath(dir), "interactive");
        let copied = 0;
        for (const entry of readdirSync(SOURCE)) {
          if (!published(entry)) continue;
          cpSync(join(SOURCE, entry), join(target, entry), {
            recursive: true,
            filter: (src) => src.slice(SOURCE.length).split(sep).every(published),
          });
          copied += 1;
        }
        logger.info(
          `copied ${copied} interactive folder${copied === 1 ? "" : "s"} to /interactive/`,
        );
      },
    },
  };
}
