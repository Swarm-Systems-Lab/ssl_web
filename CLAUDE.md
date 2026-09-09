# Swarm Systems Lab website

Astro, static output, Tailwind v4, Bun. Built to files and served by GitHub
Pages at <https://www.swarmsystemslab.eu>. There is no server and no database:
everything on the site comes from `content/`.

Two audiences read this file. The first half is for anyone adding content - ask
for what you want in plain words and Claude does the rest. The second is for
anyone changing how the site works.

---

## For adding content

You do not need to know the file layout. Say what you want:

> "Add a news post: we presented two papers at ICRA in Vienna, here are the photos"
> "Add Ana as a new PhD student, her photo is in ~/Downloads/ana.jpg"
> "We have a new fixed-wing called Halcón, 1.2 m wingspan, 30 min endurance"
> "Add our IROS 2026 paper" · "Reword the intro on the fleet page"

Claude should: put the files in the right folder, fill in the frontmatter, write
the captions into the folder's `media.yaml`, run `bun run build`, and say what
it changed. **Always run the build before reporting done** - the schemas catch
mistakes there and nowhere else.

### Where each thing lives

| Adding                                                | Goes in                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------ |
| a news post                                           | copy `content/news/_template/`                                                 |
| a project                                             | copy `content/research/_template/`                                             |
| a person                                              | copy `content/team/_template/` into `members/`, `visitors/` or `alumni/`       |
| a robot                                               | copy `content/fleet/_template/`                                                |
| a photo or clip                                       | drop in `content/media/`, add a caption to `content/media/media.yaml`          |
| a paper                                               | top of `content/publications.yaml`                                             |
| an opening, a TFM/TFG offer, an award, press coverage | `content/positions.yaml`, `student-projects.yaml`, `awards.yaml`, `press.yaml` |
| the words on any page                                 | `content/pages.yaml`                                                           |
| tabs, footer, affiliations, front-page strip          | `content/site.yaml`                                                            |

Every collection has a `_template/` folder. **Copy the whole folder** and rename
the copy - it carries an `index.md` with every field explained and a commented
`media.yaml`. A name starting with `_` is never published.

### Two rules that are easy to get wrong

**Pictures are found, not listed.** Drop them in the entry's folder. The first
one leads the page, the rest become a carousel. `01-`, `02-` prefixes set the
order.

**Captions only ever come from a `media.yaml`** next to the picture, never from
the file name - a caption read off a file name could not be translated. Media
files are named for their date alone (`2026-04-17.jpg`, and `-1`/`-2` for two on
the same day); everything on the media page needs a caption in
`content/media/media.yaml` or the build stops.

### When something is wrong

The build refuses rather than publishing something broken, and the message names
the file and the field. Read it - it usually says exactly what to do.

---

## For working on the site

```sh
bun install
bun run dev          # localhost:4321
bun run build        # also runs every schema; 219 pages
bunx astro check     # types across .astro
bun run format       # Prettier
```

`bun run build` is the real test. `astro check` does not read `content/`.

### Layout

```
content/            everything an editor touches
  pages.yaml        the words on every page, one block per page
  site.yaml         title, tabs, footer, affiliations, front-page strip
  *.yaml            the shared-page data: publications, awards, positions, press
  news|research|team|fleet/   one folder per entry, index.md + its pictures
  media/            the gallery; media.yaml gives every file its caption
  images/           pictures for the .yaml pages (not the gallery)
  covers|logos/     page covers, and marks for links and funders
src/
  content.config.ts  collections + schemas for the Markdown
  layouts/Page.astro shell every page shares: document, header, blocks
  lib/data.ts        loads and validates every YAML
  lib/collections.ts sorting, grouping, the team and fleet rules
  lib/display.ts     the per-folder media.yaml sheets
  components/        see docs/developing.md
docs/developing.md   the long version of all of this
```

### The four ideas the codebase is built on

**Content is files, code is code.** No page holds any of the site's words. A
page is `<Page name="fleet">` around its own content; everything the reader sees
around it comes from that name's block in `pages.yaml`. This is also what makes
a second language a copy of a content file rather than a pass over a dozen
components.

**Blocks, not fields per page.** `before:` and `after:` in `pages.yaml` take
`heading`, `note` and `prose`, and every kind works on every page. `labels:` is
a free-form map for single words a page needs. So adding a page, or a footnote
to an existing one, never edits a schema.

**Failures are loud and specific.** A missing label, a caption that is not
there, a picture named in a sheet but not in the folder, a paper referenced by a
tag that does not exist - all stop the build naming the file and the field. When
adding a feature, prefer an error that says what to fix over a silent fallback:
a blank strip on a page is the thing nobody notices.

**Media is one thing.** Pictures, our own clips and YouTube videos are the same
kind of item, framed by the same per-folder `media.yaml` (`focus`, `zoom`,
`caption`, `alt`). `Picture.astro` renders all three.

### Conventions

- Folder names are lowercase with dashes, and become the URL.
- Prose in comments and content uses `-`, not em dashes.
- Dates are `YYYY-MM-DD`.
- Drafts: `draft: true` hides an entry from the build but shows it in `dev`.
- Deploy is automatic on push to `master`.

### Before saying a change is done

Run `bun run build`, and check the thing you changed actually rendered - grep
`dist/` for the text, or screenshot the page. The build passing only means the
schemas were satisfied.

### Known rough edges

- The YouTube channel URL is written three times: `content/media.yaml`, and
  twice in `site.yaml` (`community` and `social`).
- `content/media.yaml` (media-page settings) and the ~45 per-folder
  `media.yaml` sheets share a name for two unrelated jobs; `lib/display.ts` has
  to special-case the top-level one.
- `content/fleet/st_rover/` is the one folder using an underscore, so its URL
  reads `/fleet/st_rover`.
- Fleet `order:` values collide - `orca`/`pico-talon` both 3, `zumo`/`st_rover`
  both 0 - so those pairs order by name rather than by intent.
- `site.yaml` still holds translatable prose (the site description, the
  community blurbs, `fromTheField.heading`). A translation is `pages.yaml` plus
  `site.yaml` plus the Markdown, not `pages.yaml` alone.
