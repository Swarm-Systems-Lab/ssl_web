# Developing

Astro, static output, Tailwind v4, Bun as the package manager and runtime.
Two small scripts ship, both progressive enhancements loaded only on the pages
that use them: the carousel and the publications filter.

## Layout

```
content/            everything an editor touches - see the top-level README
docs/               this file
public/             copied verbatim into the site root (robots.txt, .nojekyll)
src/
  content.config.ts collections + schemas for the Markdown in content/
  lib/data.ts       loads and validates the YAML in content/, pages.yaml included
  lib/images.ts     resolves picture paths written in YAML
  lib/inline-markdown.ts  links and emphasis inside YAML text
  lib/filenames.ts  file name -> date; the caption comes from the folder sheet
  lib/folder-pictures.ts  pictures found next to a post or a person
  lib/summary.ts    the fallback summary, derived from a post's own text
  lib/covers.ts     the picture at the top of a page, from content/covers/
  lib/logos.ts      marks for links and affiliations, by file name
  lib/media.ts      builds the gallery by scanning content/media/
  lib/collections.ts sorting, grouping, and the team and fleet rules
  layouts/Base.astro  <head>, header, footer
  components/       shared building blocks - see below
  pages/            one file per route
  styles/global.css theme tokens and the `prose-lab` Markdown styles
```

## Content model

Two mechanisms, chosen by whether an item needs its own page:

- **Markdown** in `content/news`, `content/research`, `content/team`,
  `content/fleet`, `content/pages` -> Astro content collections, declared in
  `src/content.config.ts`. Each entry becomes a route. A leading underscore
  keeps something out of the site, and the glob skips it whether it is a file
  or a folder - which is what `_template/` relies on.

  An entry is either one file (`a-post.md`) or a folder holding `index.md`
  beside its pictures (`a-post/index.md`). A custom `generateId` strips the
  trailing `/index`, so both land on the same address and the folder move did
  not change any URL.

  Every collection carries a `_template/` folder, which is the way a new entry
  is made: copy it, rename the copy, fill it in. It holds an `index.md` whose
  frontmatter comments explain each field, and a `media.yaml` commented out in
  full, so a copy that is left alone parses to nothing and changes nothing.
  Adding a field to a schema means adding it to that `index.md` too - the
  template is the only documentation an editor reads at the moment they need
  it.

  People go one level deeper - `team/members/`, `team/visitors/`,
  `team/alumni/`. Anyone with a photo or body text gets a page; on it,
  `isPanoramic()` in `lib/images.ts` compares the photo's own width and height
  against a 1.1 ratio and picks between the portrait-beside-the-name layout and
  the wide-picture-underneath one. The folder is the category; `group:` only splits the members
  into the PI, postdocs, Ph.D. students, and assistants. `getTeam()` in
  `lib/collections.ts` derives the group, flattens the id to a slug so the URL
  stays `/team/<name>`, and throws with the file path if a member is missing a
  `group:`.

- **YAML** in `content/*.yaml` -> loaded and validated in `src/lib/data.ts`.
  These render onto a single shared page (publications, positions, student
  projects,
  awards, media).

Both validate with Zod at build time. A schema failure aborts the build and
names the file and field, so bad content cannot reach production.

`draft: true` hides an entry from `bun run build` while keeping it visible in
`bun run dev`.

### The fleet

`content/fleet/` is the team collection with the people swapped for machines,
and it is worth saying why it is not filed the same way. A person's category is
a fact about the lab - they are a visitor, or they are alumni - so the folder
carries it. A machine's is a fact about the machine, and it changes: `group:`
lives in its own `index.md`, so retiring a rover is a one-word edit instead of
a move, and its address never changes.

`specs` is free text on both sides on purpose. "Endurance / 45 min" reads the
way someone would say it, and a schema that insisted on units would be wrong
for half the entries. The page is a description of what the lab flies, not an
inventory: `role` and `summary` carry the weight, and three specs is the point
at which a reader stops reading.

`projects:` names folders in `content/research/`, and an unknown name stops the
build - the same rule `works:` follows. The list renders through `PeopleList`,
because a project link and a person link are the same shape and the comma
between them has to be drawn in CSS rather than written.

### Page text

Every page is `<Page name="…">` wrapping its own content. `layouts/Page.astro`
reads that name's block from `content/pages.yaml` and renders the document, the
header, and the prose declared above and below the slot. A page passes its name
and nothing else; `components/Blocks.astro` draws the prose.

```
content/pages.yaml   the words
layouts/Page.astro   the shell every page shares
components/Blocks.astro   heading / note / prose, usable on any page
lib/data.ts          pageText(name), label(text, name, where)
```

The shape is deliberate. An earlier version had one optional field per string
any page happened to need - `press`, `photos`, `footnote`, `more` - which made
the schema the union of every page's requirements: adding a page meant editing
it, and a key existing did not mean any page rendered it. Now there are two
general mechanisms instead. `before` and `after` take a list of blocks, and
every block kind works on every page, so a footnote under the news list is two
lines of YAML. `labels` is a free-form map, so a new string never touches the
schema at all.

Because `labels` is loose, nothing checks at parse time that a page has what it
asks for. `label(text, "press", "news")` checks at the point of use and fails
the build naming both. The block union carries its own message, so a mistyped
kind reports the kinds that exist rather than "Invalid input".

Adding a block kind is three edits: a member of `block` in `lib/data.ts`, a
branch in `Blocks.astro`, and a line in the comment at the top of `pages.yaml`.
Anything tied to one page - the publication filter, the fleet grid - stays in
that page and is not a block.

### A second language

No `.astro` under `src/pages` holds any of the site's words; the one string
left is `label="YouTube"`, which names a file in `content/logos/`. The display
titles are in `pages.yaml` too, spelled out as a plain half and an accented one
rather than sliced in the page, because "THE FLEET." has to become "LA FLOTA."
without anyone opening a component.

So a translation is a copy of `pages.yaml` plus the Markdown in `content/`.
What is left to build when that day comes is routing and a language switch, not
a hunt through a dozen pages for hard-coded English.

## Shared components

| Component                | What it does                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Picture.astro`          | one way to render any picture: optimises `ImageMetadata`, passes GIFs and clips through, renders `<video>` for `.mp4`/`.webm`      |
| `Carousel.astro`         | scroll-snapping strip of pictures; arrows and dots appear only once its script runs, and a single slide degrades to a plain figure |
| `Lightbox.astro`         | one per page, in the layout: opens any picture marked `data-zoom` full size over the page                                          |
| `VideoGrid.astro`        | YouTube videos as thumbnails; the player is only embedded once someone clicks one                                                  |
| `Slider.astro`           | the scroll-snapping strip under both the picture carousel and the press shelf, with the arrows and the paging                      |
| `PressShelf.astro`       | coverage from `press.yaml` as a shelf of cards, newest first                                                                       |
| `PublicationEntry.astro` | one paper as the publications page draws it; a project page shows its own papers with the same component                           |
| `PeopleList.astro`       | a comma-separated run of people, linked where they have a page                                                                     |
| `ShowMore.astro`         | folds a long list to its opening entries, with a button to unfold it                                                               |
| `YouTube.astro`          | a video as its own still until someone presses play, then the embed; used by `Picture` and by the media page's grid                |
| `FilterBar.astro`        | client-side filter over an already-rendered list                                                                                   |
| `Text.astro`             | renders one line of YAML text through the inline Markdown parser                                                                   |
| `PageHeader.astro`       | the eyebrow + big title block at the top of a page                                                                                 |
| `Rule.astro`             | section heading with a hairline                                                                                                    |

Prefer these over one-off markup - every one of them is used by at least two
pages, and the carousel and filter are meant to absorb the next few features.

### Carousel

Takes `slides: { src, alt, caption? }[]` and a `label` for screen readers. The
markup is a horizontal scroll container with snap points, so it works with a
swipe or a trackpad before any JavaScript loads; the script only adds the arrows
and dots and keeps them in sync.

Both it and the press shelf sit on `Slider`, which owns the strip, the arrows,
and that script. Give `Slider` slides of any width and it pages by the width of
the strip rather than by the width of a slide, so a shelf showing three cards
moves three at a time. `arrows="beside"` puts the arrows in the page margin
instead of on top of the slides, which is what a card wants and a photograph
does not.

### Loading pictures

Three settings decide what a page weighs, and they are worth keeping straight:

- **`quality`** is fixed site-wide in `lib/images.ts`. 72 rather than Astro's
  default of 80, which is where photographs stop looking different and files
  keep getting smaller.
- **`widths`** should stop at twice the size the picture is displayed at, and
  `sizes` should say what that display size is. A 320px file behind an 80px
  portrait is four times the pixels any screen can use, and the browser will
  dutifully download it.
- **`loading`** is lazy by default. Pass `loading="eager"` to the pictures that
  are on screen before any scrolling - each list page has an `ABOVE_THE_FOLD`
  constant saying how many that is for its layout - and `priority` to the one
  picture the page is judged on, usually its cover or the header of a post.
  `priority` sets loading, decoding, and fetch priority together, so there
  should be at most one per page.

Astro's dev toolbar audit checks the last of these against the real viewport, so
open a page at the size people use and let it tell you when a count is wrong.

Videos are the other half of it. A YouTube embed costs around half a megabyte
before it shows a frame, so `VideoGrid` ships a thumbnail and a play button and
only creates the iframe when someone clicks. The thumbnail sits inside a plain
link to YouTube, which is what happens without JavaScript.

### Per-picture settings

`lib/display.ts` reads every `content/**/media.yaml` at build time and keys the
settings by the picture's built URL, so a picture can find its own row no matter
how it was resolved - the YAML picture index, a Markdown `image:` field, or a
folder scan. `Picture` looks that up itself, which is why one line in one file
follows a photo onto the post, the listing thumbnail, and the front page at
once.

`focus` becomes `object-position` and `zoom` a `transform: scale()` anchored on
the same point, deliberately rather than a real crop: the file keeps its whole
frame, so the lightbox still opens the entire picture and the same original
serves every shape it is shown in. Astro can crop server-side (`fit` plus
`position`), but that needs `layout` mode, an explicit height per aspect ratio,
and would crop the full-size copy too. `object-view-box` would express both
settings in one line and clip itself, but Firefox 153 still does not support it.

`zoom` above 1 keeps `object-cover` and scales past the frame; below 1 switches
to `object-contain` and scales within it, so the whole picture shows with the
mat around it. A scaled picture is painted at a size other than its own box, so
it needs something to clip it. `Picture` wraps every picture in a span that is `display: contents` -
generating no box at all, leaving layout exactly as it was - and turns that span
into `overflow-hidden` only for a picture that is actually zoomed, moving the
frame's classes onto it. A zoom is applied only where the frame has a height to
clip against (an `aspect-*`, `size-*` or `h-*` class); where the picture is
shown whole nothing is cropped, so the zoom is ignored rather than collapsing
the layout.

`caption` and `alt` come out of the same file, and the sheet is the only place
either can come from. `describeFile()` reads the date out of a file name and
nothing else: a caption taken from a name could not be translated, and would
leave one language's words on a page written in another. A picture with no
caption in its folder's sheet simply has none - except on the media page, where
every item needs one and the build stops naming any that is missing.

`Carousel` falls back to the sheet for any slide with no caption of its own,
which is the only way the awards pictures and the Granada photos can have one:
both are listed in YAML, which carries no captions.

Keys that name a missing file, unknown settings, and malformed `focus` values
all stop the build with the file and field named.

### Media, as one thing

A collection's media is whatever sits in its folder plus whatever its
`media.yaml` declares, and `lib/media-item.ts` gives all of it one shape:

| kind    | what it is                         | how it is drawn                   |
| ------- | ---------------------------------- | --------------------------------- |
| `image` | a photo, a plot, a GIF, a vector   | a picture                         |
| `clip`  | an `.mp4` or `.webm` of ours       | a player, showing its first frame |
| `video` | a video hosted elsewhere (YouTube) | a still, then the embed on click  |

`Picture` takes any of the three and draws it correctly, which is what lets one
component serve a cover, a carousel slide, a listing thumbnail and the video
shelf. A page's job is only to decide _which_ media it wants: the first item
for a cover, the rest for a carousel, or a split by kind as the media page does

- pictures into the grid, clips and YouTube into the shelf together.

A GIF counts as an image, not a clip: nothing to press, no sound, no controls -
a picture that happens to move.

### Where media is declared

`content/media.yaml` is the media _page_: its intro, its page size, the channel
box. `content/media/media.yaml` is that folder's media - the same per-file
sheet every folder can have, plus the YouTube videos, which have no file to
drop in. Nothing about an individual picture or video belongs in the page
config, and nothing about the page belongs in the folder.

`lib/media.ts` builds the gallery from both halves: the files in the folder and
the videos it declares, in one list sorted newest first. The media page splits
it by kind - pictures into the grid, clips and YouTube into the shelf.

The front page's strip is named rather than derived: `fromTheField` in
site.yaml lists the pieces it shows, by file name or by YouTube id, in the
order they should appear. A name that matches nothing throws, listing what the
gallery does hold, so the strip cannot quietly go empty.

### Stills for clips

`tools/clip-posters.mjs` runs before every build and pulls the opening frame
out of each `.mp4`/`.webm` under `content/`, writing it beside the clip as
`_poster.<name>.jpg`. The leading underscore keeps it out of the folder scans
while leaving it an ordinary file that Astro optimises like any other picture.

That still is the clip's `poster`, so a clip shows its opening frame with
`preload="none"` - nothing but the still is fetched until someone presses play

- and it is what a listing gets when it asks for `still`.

It only runs for clips whose still is missing or older than the clip, so a
rebuild costs nothing.

The stills are build output, not content: `.gitignore` keeps them out of the
repository, and every build - local or in CI - makes any that are missing. The
deploy workflow installs ffmpeg if the runner does not already carry it.
Without ffmpeg the step says so and carries on; a clip with no still is then a
plain video element with the browser's own controls, which is what it was
before any of this.

### Video as media

A collection's media is not only pictures. A `.gif` or an `.mp4` in a folder is
served as it is; a YouTube video has no file, so it is declared in that folder's
`media.yaml` under `videos:` and carried through the site as the string
`youtube:<id>` - the same shape a GIF's URL takes. That is why it needs no
special case in the collection plumbing: `folderMedia()` mixes declared videos
in with the folder's files, so a video can be a page's cover, a carousel slide,
or a listing thumbnail wherever a picture could.

A video's own settings - `focus`, `zoom`, `caption`, `alt` - are keyed by that
same reference rather than by a path, since a video has no file to be found by,
and `displayFor()` resolves either. That is what lets a still be framed like
any other picture wherever it is shown.

`Picture` turns that string into a player, or into YouTube's own still when the
caller asks for one with `still` - which is what a listing wants, where the
click belongs to the card around it, and what `socialImage()` uses for link
previews. `lib/video.ts` owns every URL shape involved.

Scrolling a carousel stops whatever it scrolled past: `Slider` pauses any clip
and sends a pause to any YouTube embed that is no longer in view, measured
against the strip rather than counted by slide, so it is right whether a slide
fills the strip or three of them share it. That is why the embed URL carries
`enablejsapi=1` - without it the player ignores the message.

The still is `hqdefault.jpg`, the one size YouTube guarantees for every video.
It is 4:3 with black bars, so `YouTube` frames itself at 16:9 unless the caller
has already given it a shape, and the bars are cropped off.

### Themes

The palette is chosen in three steps, in this order: a choice someone made
here, then the system's `prefers-color-scheme`, then light.

A stored choice and the system setting are both read by the inline script in
`Base.astro`, which stamps `data-theme` on `<html>` before the body paints -
no flash of the wrong theme, and the toggle always has an attribute to flip.
The system setting is _also_ handled in CSS, by repeating the dark palette
under `@media (prefers-color-scheme: dark)` for `html:not([data-theme])`, so a
visitor with scripts off still gets the theme their machine asked for. The two
copies of the dark palette have to be kept in step; CSS offers no way to say
"this rule, and also under these conditions".

Changing the system setting while a page is open moves the page with it, unless
a choice has been stored, in which case the choice stands.

Two tags in the head matter here. `<meta name="color-scheme" content="light
dark">` tells the browser the page handles both, which is what form controls
and scrollbars read before the CSS arrives. `<meta name="darkreader-lock">` is
Dark Reader's documented opt-out: the extension sees that the site has a dark
theme of its own and leaves it alone rather than inverting an already dark
page.

### Opening a picture full size

`<Picture zoom />` makes a picture clickable: it gains `data-zoom` pointing at a
1600px WebP, a `zoom-in` cursor, and a place in the tab order, and the single
`Lightbox` in the layout opens it over the page. The lightbox is a native
`<dialog>`, so Escape, focus trapping, and the backdrop are the browser's job.

Use it for a picture that is not already inside a link - a linked picture belongs
to its link, and a picture cannot be both. `Carousel` turns it on for every
slide, so galleries need nothing. The media grid is the one place where the
trigger is the link itself: it keeps `href` to the full size file, and the
lightbox takes the click when its script has run.

### In the press

`content/press.yaml` holds coverage by newspapers, TV, and institutional news
outlets. The file is unordered - `lib/data.ts` sorts it by date, newest first -
so whoever adds a piece can paste it anywhere. `kind: video` changes the card's
wording from "Read" to "Watch", and `programme:` names the show it went out on.

### ShowMore

Mark the group with `data-collapsible`, mark every foldable entry with
`data-entry`, and put `<ShowMore limit={30} total={n} noun="papers" />` inside
the group. The limit is the page's to choose - only it knows how many entries
fill a screen - and each page keeps it in an `AT_FIRST` constant at the top.

Everything is rendered either way; the script folds the tail on load and the
button is `hidden` until then, so without JavaScript the full list is simply
there. Lazy pictures inside folded entries are not fetched until the list is
unfolded, so the fold costs page weight as well as height.

The fold follows whatever is on show, which is what makes it work alongside the
filter on the publications page. After a filter runs, `ShowMore` counts only
the entries the filter allows and cuts _those_ to the limit: filtering to a
kind with fewer than the limit shows all of them and no button, and coming back
to everything folds again and brings the button back. Pressing the button is
final - the list never folds itself again, whatever the filter does afterwards.

Two details make that cooperation work. Folding marks entries `data-folded`
rather than using the `hidden` attribute, since the filter owns `hidden` and
the two must be able to hide the same row without undoing each other; the rule
is forced with `!important` for the same reason Tailwind's preflight forces
`[hidden]`, as a row carrying a display utility would otherwise outrank it. And
`ShowMore` recomputes on the way _up_ from a filter click, after the filter has
decided which entries match, then has the last word on which headings still
have anything under them.

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

`content/covers/<page>.<ext>` is picked up by name - `PageHeader` takes a `page`
prop and looks the file up, so adding a cover to a new tab means passing that
prop and nothing else. Captions come from `coverCaptions:` in `site.yaml` and
double as alt text. The front page renders its cover uncropped; every other page
crops to a banner.

### Logos

`content/logos/<link>.*` and `content/logos/<name>.*` are matched by the
slugified label, or by an explicit `logo:` in `site.yaml`. Subfolders are
indexed too, so a downloaded brand pack can be kept intact and referenced by
path (`ugr/vertical/UGR-MARCA-01-color`); each file also gets a bare-name alias
where that name is still free, and the build warns when two files normalise to
one key. `Logo.astro` takes a
`folder` prop to pick between them. SVGs are served untouched - rasterising a
vector is pointless - while PNG and JPG go through the image pipeline, since an
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
is intentionally blunt - anything that needs to read better deserves a
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
full-size original in `dist/_astro` beside the variants actually used - 13 MB of
it once the team photos landed. `tools/prune-assets.mjs` runs on
`astro:build:done` and deletes any emitted file whose name appears nowhere in
the built HTML, CSS, JS, or XML. Hashed names make a match a real reference, and
anything ambiguous is kept. Link previews go through `lib/social-image.ts`
rather than pointing at an original, for the same reason.

## Links in Markdown

Components build addresses with `url()` so they pick up `BASE_PATH`. Markdown
has no such seam, so `tools/base-links.mjs` rewrites site-relative `href` and
`src` values as the Markdown is rendered - a link written `/research/aerosense`
becomes `/ssl_web/research/aerosense` when the site is served from a sub-path,
and is left alone when it is not. Protocol-relative, absolute, `mailto:` and
anchor links are never touched.

## Adding a tab

1. Create `src/pages/<name>.astro`. Start from `src/pages/awards.astro` - it is
   the smallest complete page.
2. If it needs its own content file, add a schema to `src/lib/data.ts` (single
   page) or a collection to `src/content.config.ts` (one page per entry).
3. Add the tab to `nav:` in `content/site.yaml`. Header and footer both read
   from there.

To retire a tab without deleting the page, move its line from `nav:` to
`more:`. The footer lists both, one after the other, so the page stays
reachable and keeps its address while the header gets its room back - which is
what happened to the awards page when the fleet took its place.

A tab with `children` in `site.yaml` renders as a drop-down. The parent keeps
its own `href`, and the list opens on hover or keyboard focus with CSS only, so
it works without JavaScript.

**Join us** is the one section with pages under it: `/join-us` is a landing page
of two cards, and `/join-us/positions` and `/join-us/student-projects` carry the lists,
so each can be linked to on its own. The shared "how to apply" panel is
`ApplyBox.astro`.

For a tab pointing at documentation hosted elsewhere, a plain external entry in
`nav:` works - `href` is used as given when it starts with `http`.

## Images

Astro optimises images imported through the content pipeline: it emits WebP at
several widths and writes the `srcset`. Reference them from frontmatter with a
relative path (`./01-photo.jpg`, i.e. next to `index.md`) and render with
`<Picture>`.

Animated GIFs and video are deliberately _not_ optimised - `src/lib/media.ts`
passes them through as URLs, because Sharp would flatten an animation to its
first frame.

## Media growth

`content/media/` is versioned in Git, which is fine for a few hundred compressed
photos and is where things stand today. Watch for two limits: a published Pages
site must stay under 1 GB, and Git stores every version of a binary forever, so
a repeatedly replaced 20 MB video is expensive.

When that starts to bite, the move is small: `src/lib/media.ts` is the only file
that knows where media lives. Point it at a base URL - a second repository
served through jsDelivr, or a Cloudflare R2 bucket behind
`media.swarmsystemslab.eu` - and keep the same filename convention. Until then,
compress before committing and keep long video on YouTube.

## Deployment

`.github/workflows/deploy.yml` builds on every push to the default branch and
publishes through GitHub Pages. Enable it once under **Settings -> Pages ->
Source -> GitHub Actions**.

The build reads two optional repository variables (**Settings -> Secrets and
variables -> Actions -> Variables**):

| Variable    | Default                          | Use                                        |
| ----------- | -------------------------------- | ------------------------------------------ |
| `SITE_URL`  | `https://www.swarmsystemslab.eu` | absolute URLs in the sitemap and meta tags |
| `BASE_PATH` | `/`                              | set to `/<repo>/` for a project-page URL   |

A build pointed anywhere but `swarmsystemslab.eu` also emits
`<meta name="robots" content="noindex">`, so a staging copy cannot be indexed
and start competing with the real site for the same words. Nothing to switch
on: it follows `SITE_URL`.

### Publishing to the github.io address first

To check a deployment before the domain is pointed anywhere, set both variables
and let the site publish to the project page:

| Variable    | Value                                 |
| ----------- | ------------------------------------- |
| `SITE_URL`  | `https://swarm-systems-lab.github.io` |
| `BASE_PATH` | `/ssl_web/`                           |

The site is then at `https://swarm-systems-lab.github.io/ssl_web/`. Leave the
custom domain field under **Settings -> Pages** empty while doing this: setting
it writes a `CNAME` file, and every visit is redirected to a domain that is not
ready yet.

### Custom domain

`public/CNAME` holds `www.swarmsystemslab.eu`, which is what pins the domain on
GitHub's side. It has to be part of the built artifact rather than only a
setting in the repository, because a deploy replaces the whole site and can
otherwise drop the domain with it.

DNS lives at GoDaddy: `www` is a CNAME to `swarm-systems-lab.github.io`, and
the apex has A records at `185.199.108-111.153` so `swarmsystemslab.eu`
redirects to `www`.

There are no repository variables in normal operation - the defaults in
`astro.config.mjs` are the live site. Setting `BASE_PATH` while on the custom
domain would break every link and asset.

## Filling in DOIs and PDFs

`tools/enrich-publications.mjs`, wired up as `bun run publications:enrich`,
fills missing `doi:` and `pdf:` fields in `content/publications.yaml`.

Google Scholar has no API and its terms forbid scraping, so it uses the open
scholarly infrastructure instead. **OpenAlex** matches the paper by title and
returns its DOI plus the best open-access copy it knows of; **arXiv** is asked
only when OpenAlex knows of no open copy, which covers our own recent
preprints. Both are free and need no key.

Three decisions worth keeping:

- **It is a script, not a build step.** Reaching out to two APIs on every build
  would be slow, would fail whenever the network hiccups, and would make the
  output non-deterministic. Content is fetched once and committed.
- **It never overwrites.** Only empty fields are filled, so anything written by
  hand always wins.
- **A weak title match is refused.** Matches below 0.8 word overlap are
  reported and skipped, because a wrong DOI is worse than a missing one.

It backs off and retries on HTTP 429, and reports separately on papers it could
not recognise at all versus papers that simply have no open copy — the second
being the normal state of a paywalled paper, not a problem to fix.

`--dry-run` prints what it would do and writes nothing. `--verify` checks the
DOIs already in the file against Crossref and reports three things separately:
entries whose DOI disagrees with the one registered for that title (one of the
two is a different paper), entries with no DOI where Crossref knows one, and
entries holding a publisher address rather than a DOI — the last being a
tidiness matter, not a fault.

That check earned its keep immediately: two 2010 papers about sea demining, one
at ICARCV and one at IFAC, had been given the same IEEE link. Fuzzy title
matching will do that, which is exactly why the DOIs are checked rather than
trusted.

## Checks

```sh
bun run build      # also runs every content schema
bunx astro check   # TypeScript across .astro files
bun run format     # Prettier
```
