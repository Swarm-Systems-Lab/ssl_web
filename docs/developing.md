# Developing

Astro, static output, no client-side JavaScript. Tailwind v4 for styling, Bun as
the package manager and runtime.

## Layout

```
content/            everything an editor touches — see the top-level README
docs/               this file
public/             copied verbatim into the site root (robots.txt, .nojekyll)
src/
  content.config.ts collections + schemas for the Markdown in content/
  lib/data.ts       loads and validates the YAML in content/
  lib/media.ts      builds the gallery by scanning content/media/
  lib/collections.ts sorting, grouping, and draft filtering helpers
  layouts/Base.astro  <head>, header, footer
  components/       SiteNav, SiteFooter, PageHeader, Rule
  pages/            one file per route
  styles/global.css theme tokens and the `prose-lab` Markdown styles
```

## Content model

Two mechanisms, chosen by whether an item needs its own page:

- **Markdown** in `content/news`, `content/research`, `content/team`,
  `content/pages` → Astro content collections, declared in
  `src/content.config.ts`. Each entry becomes a route. Files starting with `_`
  are templates and are skipped by the glob.
- **YAML** in `content/*.yaml` → loaded and validated in `src/lib/data.ts`.
  These render onto a single shared page (publications, positions, projects,
  awards, media).

Both validate with Zod at build time. A schema failure aborts the build and
names the file and field, so bad content cannot reach production.

`draft: true` hides an entry from `bun run build` while keeping it visible in
`bun run dev`.

## Adding a tab

1. Create `src/pages/<name>.astro`. Start from `src/pages/awards.astro` — it is
   the smallest complete page.
2. If it needs its own content file, add a schema to `src/lib/data.ts` (single
   page) or a collection to `src/content.config.ts` (one page per entry).
3. Add the tab to `nav:` in `content/site.yaml`. Header and footer both read
   from there.

For a "Projects" tab that points at documentation hosted elsewhere, a plain
external entry in `nav:` works — `href` is used as given when it starts with
`http`.

## Images

Astro optimises images imported through the content pipeline: it emits WebP at
several widths and writes the `srcset`. Reference them from frontmatter with a
relative path (`./images/foo.jpg`) and render with `<Image>`.

Animated GIFs and video are deliberately _not_ optimised — `src/lib/media.ts`
passes them through as URLs, because Sharp would flatten an animation to its
first frame.

## Media growth

`content/media/` is versioned in Git, which is fine for a few hundred compressed
photos and is where things stand today. Watch for two limits: a published Pages
site must stay under 1 GB, and Git stores every version of a binary forever, so
a repeatedly replaced 20 MB video is expensive.

When that starts to bite, the move is small: `src/lib/media.ts` is the only file
that knows where media lives. Point it at a base URL — a second repository
served through jsDelivr, or a Cloudflare R2 bucket behind
`media.swarmsystemslab.eu` — and keep the same filename convention. Until then,
compress before committing and keep long video on YouTube.

## Deployment

`.github/workflows/deploy.yml` builds on every push to the default branch and
publishes through GitHub Pages. Enable it once under **Settings → Pages →
Source → GitHub Actions**.

`.github/workflows/new-post.yml` is the form-based authoring path for editors;
it runs `.github/scripts/new_post.py`, commits the file, and lets the deploy
workflow take over.

The build reads two optional repository variables (**Settings → Secrets and
variables → Actions → Variables**):

| Variable    | Default                          | Use                                        |
| ----------- | -------------------------------- | ------------------------------------------ |
| `SITE_URL`  | `https://www.swarmsystemslab.eu` | absolute URLs in the sitemap and meta tags |
| `BASE_PATH` | `/`                              | set to `/<repo>/` for a project-page URL   |

### Custom domain

The site does not ship a `public/CNAME`, because `swarmsystemslab.eu` still
points at the current Google Sites page. To cut over: set the domain under
**Settings → Pages → Custom domain** (which creates the `CNAME` file), point the
DNS records at GitHub, and leave `SITE_URL` as it is.

## Checks

```sh
bun run build      # also runs every content schema
bunx astro check   # TypeScript across .astro files
bun run format     # Prettier
```
