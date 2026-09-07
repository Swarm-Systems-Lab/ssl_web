# Content

Everything on the website is generated from this folder.

| Folder / file      | What it is                          | Where it shows up      |
| ------------------ | ----------------------------------- | ---------------------- |
| `news/`            | one folder per post                 | its own page           |
| `research/`        | one folder per topic                | its own page           |
| `team/`            | one folder per person, by category  | its own page           |
| `media/`           | photos, GIFs, and short clips       | the media page         |
| `covers/`          | the picture at the top of a page    | that page              |
| `logos/`           | marks for GitHub, YouTube, Discord  | front page and footer  |
| `affiliations/`    | university, institute, funder logos | front page             |
| `pages/home.md`    | the text on the front page          | the front page         |
| `publications.yaml`| every paper                         | the publications page  |
| `positions.yaml`   | open positions                      | Join us → Open positions   |
| `projects.yaml`    | TFM / TFG offers                    | Join us → Student projects |
| `images/`          | pictures used by the `.yaml` pages  | wherever they are used |
| `awards.yaml`      | awards and grants                   | the awards page        |
| `media.yaml`       | YouTube videos and gallery settings | the media page         |
| `site.yaml`        | site title, tabs, footer links      | everywhere             |

## Adding something

Everything with its own page — a news post, a research topic, a person — gets
its **own folder**, holding the text as `index.md` and any pictures next to it:

```
content/news/2026-09-04-new-paper/
  index.md
  01-first-photo.jpg
  02-second-photo.jpg
```

Copy the `_template.md` from the relevant folder into your new folder, save it
as `index.md`, and fill it in. The folder name becomes the address, so keep it
lowercase with dashes: the example above is at `/news/2026-09-04-new-paper`.

People are filed one level deeper, by what they are to the lab —
`team/members/`, `team/visitors/`, `team/alumni/`. See
[`team/README.md`](team/README.md).

A post with no pictures can also be a single file, `2026-09-04-new-paper.md`,
with no folder around it.

Files starting with `_` are templates and never appear on the site.

The block at the top of each file, between the two `---` lines, is the
*frontmatter*. It holds the fields the site needs. Below it, write plain
Markdown.

## Photos, GIFs, and video

For anything with its own folder — a news post, a research topic, a person —
**just put the picture in the folder**. It is picked up automatically.

Everywhere else you write a one-line path. There are five cases.

### 1. Pictures on a post or a research topic

Drop them in the post's folder, named so they sort the way you want them read:

```
content/news/2026-09-03-time-to-go-home/
  index.md
  01-shanghai-jiao-tong.jpg
  02-university-of-hunan.jpg
  03-ifac-busan.jpg
```

That is the whole job. The first picture becomes the big one at the top of the
post and the thumbnail in the news list; the rest become a carousel at the end,
with captions taken from the file names — `02-university-of-hunan.jpg` reads as
*"University of hunan"*. A file named like `IMG_4231.jpg` gets no caption,
because the name says nothing worth showing.

To pick a different picture for the top, name it:

```yaml
image: ./03-ifac-busan.jpg
imageAlt: "The lab presenting at the IFAC World Congress"
```

To take control of the carousel — a different order, or captions you write
yourself — list it instead, and the folder is no longer scanned:

```yaml
gallery:
  - src: ./03-ifac-busan.jpg
    caption: "IFAC World Congress, Busan"
  - src: ./01-shanghai-jiao-tong.jpg
    caption: "Shanghai Jiao Tong University"
```

A picture in the middle of the text is ordinary Markdown:

```md
![Eight drones spiralling towards a source](./02-university-of-hunan.jpg)
```

### 2. A person's photo

Put it in their folder. Nothing to write:

```
content/team/members/diego-vela/
  index.md
  diego.jpg
```

Only add `photo: ./diego.jpg` if the folder holds more than one picture. Square
pictures look best.

### 3. A photo in the gallery

Drop the file in `media/`. Name it `YYYY-MM-DD_a-short-caption.jpg` and the date
and caption are read from the name:

```
content/media/2026-04-17_group-photo-in-granada.jpg
```

shows on the media page as **"Group photo in granada"**, dated 17 April 2026, in
the right place in the timeline.

GIFs and short clips work exactly the same way — same folder, same naming:

```
content/media/2026-07-27_four-flying-wings-in-formation.gif
content/media/2025-08-12_rendezvous-at-18-m-s.mp4
```

If the caption from the file name reads badly, override it in `media.yaml`
without renaming the file:

```yaml
captions:
  "2026-04-17_group-photo-in-granada.jpg": "Group photo, Granada, April 2026"
```

### 4. A thumbnail on a publication, an award, a position, or a project

Those four pages are built from `.yaml` files rather than folders, so their
pictures live in `content/images/` and the path is written relative to
`content/`:

```yaml
  - ref: J27
    authors: "J. Bautista, A. Acuaviva, … HG de Marina"
    title: "Fully distributed and resilient source seeking for robot swarms"
    venue: "IEEE Transactions on Automatic Control"
    year: 2026
    image: images/publications/j27-source-seeking.jpg
    imageAlt: "Eight drones spiralling towards a source"
```

Small pictures are enough — they are shown at about 96 px in the list, and full
width on the paper's own page.

The Granada photos on the Join us page work the same way. Put them in
`images/granada/` and list them under `aside.photos` in `positions.yaml`:

```yaml
aside:
  title: Why Granada?
  photos:
    - images/granada/alhambra.jpg
    - images/granada/albaicin.jpg
  body: >-
    Granada is the most popular destination among European exchange students…
```

### 5. A cover across the top of a page

Every page can have one. Drop a file in `covers/` named after the page and it
appears — there is nothing to switch on:

```
content/covers/
  home.png          the front page
  news.jpg          /news
  team.jpg          /team
  join-us.jpg       /join-us
```

Pages without a file here simply have no cover; none of them are required. The
full list of names is in [`covers/README.md`](covers/README.md).

Captions are optional and live in `site.yaml`, keyed by the same page name:

```yaml
coverCaptions:
  home: "The Swarm Systems Lab"
  news: "Field testing near Granada"
```

`home.png` is shown whole and never cropped — it is the team photo, and nothing
should be cut off. Covers on the other pages are cropped to a wide banner, so
keep the interesting part near the middle; around 1600 x 700 is plenty.

If there is no `home` cover, the front page falls back to the newest photo in
`media/`.

### 6. A logo for an outside link

The marks beside our GitHub, YouTube, and Discord links come from `logos/`,
named after the link — `github.svg`, `youtube.svg`, `discord.svg`. Drop a file
in and it appears; a link with no file just shows its text.

The site renders every one of them **pure white**, so there is no need to hunt
for a white version — the official file as downloaded is fine. See
[`logos/README.md`](logos/README.md).

### 7. An affiliation or funder logo

The band at the foot of the front page — the university, the institutes, the
ERC, the ministry. List it under `affiliations:` in `site.yaml`, then drop the
file in `affiliations/` named to match.

Until the file is there the institution's name is shown as text instead, so the
band works before anyone has collected the artwork. See
[`affiliations/README.md`](affiliations/README.md).

### A video on YouTube

Long videos do not belong in the repository. Upload them to
[our channel](https://www.youtube.com/@SwarmSystemsLab) and add the id — the part
of the address after `v=` — to `media.yaml`:

```yaml
videos:
  - youtube: G_lXujpkPJw
    title: Fixed-wing aerobatics — fully autonomous, no GPS
    date: "2026-08-01"
    featured: true
```

`featured: true` also puts the video on the **front page**, under *From the
field*. Mark as many as you want to show there; if you mark none, the front page
falls back to the first three in the list.

### What to hand over

| Format | Use it for                   |
| ------ | ---------------------------- |
| `.jpg` | photographs                  |
| `.png` | plots, diagrams, screenshots |
| `.gif` | short silent loops           |
| `.mp4` | clips with sound, up to ~20 s |

Photos are resized and converted automatically, so hand over the original
straight from the camera — no need to shrink anything first. GIFs and clips are
served exactly as given, because compressing them would destroy the animation:
keep those under a few megabytes, and put anything longer on YouTube.

Use lowercase names with dashes and no spaces or accents:
`01-group-photo.jpg`, not `Group Photo (Granada).JPG`.

## Links and emphasis inside a `.yaml` file

YAML has no way of marking up a link, so the text fields understand a little
Markdown:

```yaml
intro: >-
  We build on [Paparazzi](https://paparazziuav.org), the open-source autopilot.
  Applications are **due in January**.
```

`[label](address)`, `**bold**`, `*italics*`, and `` `code` `` all work. Anything
that needs paragraphs, headings, or lists belongs in a Markdown file instead —
those fields are single blocks of text by design.

## Summaries

News posts show a short summary in the list. Write one if you want to control
it:

```yaml
summary: "One or two sentences shown on the news list page."
```

Leave it out and the opening of the post is used instead, trimmed to about 220
characters at a sentence boundary. That is usually fine; write your own when the
post opens with something that does not stand alone.

## Dates

Always `YYYY-MM-DD`, and never in quotes:

```yaml
date: 2026-09-04
```

## Hiding something while you work on it

Add `draft: true` to the frontmatter. It disappears from the published site and
stays visible when running the site locally. Remove the line to publish.

## If something goes wrong

The site refuses to publish content it cannot read, so a mistake here never
reaches visitors. Open the **Actions** tab: the failed run says which file and
which field is at fault.
