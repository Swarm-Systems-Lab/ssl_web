// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import pruneUnusedAssets from "./tools/prune-assets.mjs";

// The public URL of the site. Override with SITE_URL when deploying a preview
// or to a *.github.io/<repo> address instead of the custom domain.
const site = process.env.SITE_URL ?? "https://www.swarmsystemslab.eu";
// Sub-path the site is served from. "/" for a custom domain, "/<repo>/" for
// a project page such as https://swarm-systems-lab.github.io/ssl_web/.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  build: { format: "directory" },
  integrations: [sitemap(), pruneUnusedAssets()],
  vite: {
    plugins: [tailwindcss()],
    // Never inline assets as base64 data URIs. Vite does this by default for
    // files under 4 kB, which would bury small GIFs and clips inside the HTML.
    build: { assetsInlineLimit: 0 },
  },
  image: { responsiveStyles: true },
});
