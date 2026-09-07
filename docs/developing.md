# Developing

Astro, static output, Tailwind v4, Bun as the package manager and runtime.
Two small scripts ship, both progressive enhancements loaded only on the pages
that use them: the carousel and the publications filter.

## Layout

```
content/            everything an editor touches — see the top-level README
docs/               this file
public/             copied verbatim into the site root (robots.txt, .nojekyll)
src/
  content.config.ts collections + schemas for the Markdown in content/
  lib/data.ts       loads and validates the YAML in content/
  lib/images.ts     resolves picture paths written in YAML
  lib/inline-markdown.ts  links and emphasis inside YAML text
  lib/filenames.ts  file name -> caption and date, shared by both galleries
  lib/folder-pictures.ts  pictures found next to a post or a person
  lib/summary.ts    the fallback summary, derived from a post's own text
  lib/covers.ts     the picture at the top of a page, from content/covers/
  lib/logos.ts      marks for links and affiliations, by file name
  lib/media.ts      builds the gallery by scanning content/media/
  lib/collections.ts sorting, grouping, and the team category rules
  layouts/Base.astro  <head>, header, footer
  components/       shared building blocks — see below
  pages/            one file per route
  styles/global.css theme tokens and the `prose-lab` Markdown styles
```

## Content model

Two mechanisms, chosen by whether an item needs its own page:

- **Markdown** in `content/news`, `content/research`, `content/team`,
  `content/pages` → Astro content collections, declared in
  `src/content.config.ts`. Each entry becomes a route. Files starting with `_`
  are templates and are skipped by the glob.

  An entry is either one file (`a-post.md`) or a folder holding `index.md`
  beside its pictures (`a-post/index.md`). A custom `generateId` strips the
  trailing `/index`, so both land on the same address and the folder move did
  not change any URL.

  People go one level deeper — `team/members/`, `team/visitors/`,
  `team/alumni/`. Anyone with a photo or body text gets a page; on it,
  `isPanoramic()` in `lib/images.ts` compares the photo's own width and height
  against a 1.1 ratio and picks between the portrait-beside-the-name layout and
  the wide-picture-underneath one. The folder is the category; `group:` only splits the members
  into the PI, postdocs, Ph.D. students, and assistants. `getTeam()` in
  `lib/collections.ts` derives the group, flattens the id to a slug so the URL
  stays `/team/<name>`, and throws with the file path if a member is missing a
  `group:`.

- **YAML** in `content/*.yaml` → loaded and validated in `src/lib/data.ts`.
  These render onto a single shared page (publications, positions, projects,
  awards, media).

Both validate with Zod at build time. A schema failure aborts the build and
names the file and field, so bad content cannot reach production.

`draft: true` hides an entry from `bun run build` while keeping it visible in
`bun run dev`.

## Shared components

| Component          | What it does                                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Picture.astro`    | one way to render any picture: optimises `ImageMetadata`, passes GIFs and clips through, renders `<video>` for `.mp4`/`.webm`      |
| `Carousel.astro`   | scroll-snapping strip of pictures; arrows and dots appear only once its script runs, and a single slide degrades to a plain figure |
| `FilterBar.astro`  | client-side filter over an already-rendered list                                                                                   |
| `Text.astro`       | renders one line of YAML text through the inline Markdown parser                                                                   |
| `PageHeader.astro` | the eyebrow + big title block at the top of a page                                                                                 |
| `Rule.astro`       | section heading with a hairline                                                                                                    |

Prefer these over one-off markup — every one of them is used by at least two
pages, and the carousel and filter are meant to absorb the next few features.

### Carousel

Takes `slides: { src, alt, caption? }[]` and a `label` for screen readers. The
markup is a horizontal scroll container with snap points, so it works with a
swipe or a trackpad before any JavaScript loads; the script only adds the arrows
and dots and keeps them in sync.

### FilterBar

Wrap the list in `data-filterable`, tag each entry with `data-kind="…"`, and
optionally wrap sections in `data-filter-group` so a heading disappears when
everything under it is filtered out. The bar itself is `hidden` until the script
runs, so nobody is shown controls that cannot work.

### Pictures next to content

`lib/folder-pictures.ts` scans an entry's own folder and works out the header
picture and the carousel. The rules, in order: `image:` wins if set, otherwise
the first picture is promoted to header; `gallery:` replaces the folder scan
when the order or the captions matter; and the header never repeats inside the
carousel. Captions come from file names via `lib/filenames.ts`, which returns
nothing for camera names like `IMG_4231.jpg` rather than inventing a caption.

The same helper gives a person their photo when they have not named one.

### Page covers

`content/covers/<page>.<ext>` is picked up by name — `PageHeader` takes a `page`
prop and looks the file up, so adding a cover to a new tab means passing that
prop and nothing else. Captions come from `coverCaptions:` in `site.yaml` and
double as alt text. The front page renders its cover uncropped; every other page
crops to a banner.

### Logos

`content/logos/<link>.*` and `content/affiliations/<name>.*` are matched by the
slugified label, or by an explicit `logo:` in `site.yaml`. Subfolders are
indexed too, so a downloaded brand pack can be kept intact and referenced by
path (`ugr/vertical/UGR-MARCA-01-color`); each file also gets a bare-name alias
where that name is still free, and the build warns when two files normalise to
one key. `Logo.astro` takes a
`folder` prop to pick between them. SVGs are served untouched — rasterising a
vector is pointless — while PNG and JPG go through the image pipeline, since an
institutional logo often arrives several thousand pixels wide for a 40 px slot.
`logoFor()` returns a `Picture` either way, so `Picture.astro` handles both.

Two treatments. `white` flattens a logo with `brightness-0 invert`, which suits
the transparent monochrome marks in `logos/`. Affiliations default instead to a
white plate keeping their own colours, because institutional logos arrive in
every form and a logo supplied on an opaque white rectangle would otherwise
invert into a solid white block. `white: true` per affiliation opts into the
flat treatment when the artwork really is transparent.

The affiliations band falls back to the institution's name when no file is
found, which is why `index.astro` calls `logoFor()` directly rather than letting
`Logo.astro` render nothing.

### Summaries

`summary:` is optional on news. `lib/summary.ts` strips the Markdown and takes
whole sentences up to about 220 characters, falling back to a word boundary. It
is intentionally blunt — anything that needs to read better deserves a
hand-written summary.

### Pictures in YAML

Markdown frontmatter uses Astro's `image()` schema, which only exists inside a
content collection. The YAML files are not collections, so `src/lib/images.ts`
indexes everything under `content/` with `import.meta.glob` and resolves a path
written relative to `content/`. A miss throws with the closest matching file
names, which is what an editor needs to see in the build log.

Two catches worth knowing.

`<Image>` emits its fallback `src` at the picture's own resolution unless given
a `width`, so `Picture.astro` caps it at the largest entry in `widths`. Without
that a 7 MB photo ships a 2.5 MB variant nobody requests.

And Vite emits a copy of everything imported, so the eager glob puts every
full-size original in `dist/_astro` beside the variants actually used — 13 MB of
it once the team photos landed. `tools/prune-assets.mjs` runs on
`astro:build:done` and deletes any emitted file whose name appears nowhere in
the built HTML, CSS, JS, or XML. Hashed names make a match a real reference, and
anything ambiguous is kept. Link previews go through `lib/social-image.ts`
rather than pointing at an original, for the same reason.

## Adding a tab

1. Create `src/pages/<name>.astro`. Start from `src/pages/awards.astro` — it is
   the smallest complete page.
2. If it needs its own content file, add a schema to `src/lib/data.ts` (single
   page) or a collection to `src/content.config.ts` (one page per entry).
3. Add the tab to `nav:` in `content/site.yaml`. Header and footer both read
   from there.

A tab with `children` in `site.yaml` renders as a drop-down. The parent keeps
its own `href`, and the list opens on hover or keyboard focus with CSS only, so
it works without JavaScript.

**Join us** is the one section with pages under it: `/join-us` is a landing page
of two cards, and `/join-us/positions` and `/join-us/projects` carry the lists,
so each can be linked to on its own. The shared "how to apply" panel is
`ApplyBox.astro`.

For a tab pointing at documentation hosted elsewhere, a plain external entry in
`nav:` works — `href` is used as given when it starts with `http`.

## Images

Astro optimises images imported through the content pipeline: it emits WebP at
several widths and writes the `srcset`. Reference them from frontmatter with a
relative path (`./01-photo.jpg`, i.e. next to `index.md`) and render with
`<Picture>`.

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
