# Content

Everything on the website is generated from this folder.

| Folder / file      | What it is                          | Where it shows up      |
| ------------------ | ----------------------------------- | ---------------------- |
| `news/`            | one Markdown file per post          | its own page           |
| `research/`        | one Markdown file per topic         | its own page           |
| `team/`            | one Markdown file per person        | its own page           |
| `media/`           | photos, GIFs, and short clips       | the media page         |
| `pages/home.md`    | the text on the front page          | the front page         |
| `publications.yaml`| every paper                         | the publications page  |
| `positions.yaml`   | open positions                      | the positions page     |
| `projects.yaml`    | TFM / TFG offers                    | the projects page      |
| `awards.yaml`      | awards and grants                   | the awards page        |
| `media.yaml`       | YouTube videos and gallery settings | the media page         |
| `site.yaml`        | site title, tabs, footer links      | everywhere             |

## Adding something

Copy the `_template.md` in the relevant folder, rename it, and fill it in. The
new name becomes the address of the page, so keep it lowercase with dashes:
`2026-09-04-new-paper.md` becomes `/news/2026-09-04-new-paper`.

Files starting with `_` are templates and never appear on the site.

The block at the top of each file, between the two `---` lines, is the
*frontmatter*. It holds the fields the site needs. Below it, write plain
Markdown.

## Photos, GIFs, and video

Pictures are never pasted into the site — you put the file somewhere and write
one line that points at it. There are five places a picture can go.

### 1. A photo in the gallery

Drop the file in `media/`. Nothing else. Name it `YYYY-MM-DD_a-short-caption.jpg`
and the date and caption are read from the name:

```
content/media/2026-04-17_group-photo-in-granada.jpg
```

shows up on the media page as **"Group photo in granada"**, dated 17 April 2026,
in the right place in the timeline.

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

### 2. The big photo at the top of a news post

Put the file in `news/images/`, then add one line to the frontmatter:

```yaml
---
title: "Workshop on Guiding Vector Fields at IROS 2025"
date: 2025-05-09
summary: "A four-hour deep dive into recent developments."
image: ./images/gvf-workshop.jpg
imageAlt: "A guiding vector field around a self-intersecting path"
---
```

`./images/` is relative to the post itself. This picture is also what appears
when someone shares the post on Bluesky, WhatsApp, or Slack.

### 3. A photo inside the text of a post

Same folder, but written in the body as normal Markdown. The text in square
brackets describes the picture for screen readers:

```md
Here is the swarm converging on the source:

![Eight drones spiralling towards a source](./images/source-seeking.jpg)
```

### 4. A photo on a research topic

Identical to a news post, with the file in `research/images/`:

```yaml
---
title: "Resilient source seeking"
summary: "Robot swarms that locate a source through emergent behaviour."
order: 2
image: ./images/source-seeking.jpg
imageAlt: "A swarm converging on a source"
---
```

### 5. A person's photo

Put it in `team/photos/` and name it after the person. Square pictures look best:

```yaml
---
name: "Héctor García de Marina"
role: "Principal investigator"
group: lead
order: 1
summary: "Runs the Swarm Systems Lab."
photo: ./photos/hector-garcia-de-marina.jpg
---
```

### The front page

The picture on the front page is the newest photo in `media/`. To change it, add
a newer one.

### A video on YouTube

Long videos do not belong in the repository. Upload them to
[our channel](https://www.youtube.com/@SwarmSystemsLab) and add the id — the part
of the address after `v=` — to `media.yaml`:

```yaml
videos:
  - youtube: G_lXujpkPJw
    title: Fixed-wing aerobatics — fully autonomous, no GPS
    date: "2026-08-01"
```

### What to hand over

| Format                            | Use it for                        |
| --------------------------------- | --------------------------------- |
| `.jpg`                            | photographs                       |
| `.png`                            | plots, diagrams, screenshots      |
| `.gif`                            | short silent loops                |
| `.mp4`                            | clips with sound, up to ~20 s     |

Photos are resized and converted automatically, so hand over the original
straight from the camera — no need to shrink anything first. GIFs and clips are
served exactly as given, because compressing them would destroy the animation:
keep those under a few megabytes, and put anything longer on YouTube.

Use lowercase names with dashes and no spaces or accents:
`2026-04-17_group-photo.jpg`, not `Group Photo (Granada).JPG`.

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
