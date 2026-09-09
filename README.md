# Swarm Systems Lab

The website of the [Swarm Systems Lab](https://www.swarmsystemslab.eu), University of Granada.

Everything you can edit lives in [`content/`](content). Push a change there and
the site rebuilds and republishes itself within a couple of minutes.

## Adding content

| I want to add…        | Do this                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| a news post           | copy `_template/` in [`content/news/`](content/news)                                            |
| a funded project      | copy `_template/` in [`content/research/`](content/research)                                    |
| a person              | copy `_template/` in [`content/team/`](content/team) into `members/`, `visitors/`, or `alumni/` |
| a robot               | copy `_template/` in [`content/fleet/`](content/fleet)                                          |
| a photo, GIF, or clip | drop the file in [`content/media/`](content/media)                                              |
| a paper               | add it at the top of [`content/publications.yaml`](content/publications.yaml)                   |
| an open position      | add it to [`content/positions.yaml`](content/positions.yaml)                                    |
| a TFM/TFG project     | add it to [`content/student-projects.yaml`](content/student-projects.yaml)                      |
| a cover for a page    | drop it in [`content/covers/`](content/covers), named after the page                            |
| a logo for a link     | drop it in [`content/logos/`](content/logos), named after the link                              |
| an affiliation logo   | list it in `site.yaml`, drop the file in [`content/logos/`](content/logos)                      |
| an award              | add it to [`content/awards.yaml`](content/awards.yaml)                                          |
| press or TV coverage  | add it to [`content/press.yaml`](content/press.yaml)                                            |
| a crop or caption fix | add `media.yaml` next to the picture - see [`content/README.md`](content/README.md)             |
| a YouTube video       | add it to [`content/media.yaml`](content/media.yaml)                                            |

News posts, research topics, people, and papers each get their own page; for the
first three the folder name becomes the address. Everything else appears on a
single shared page. **Join us** is a small section of its own: a landing page
with **Open positions** and **Student projects** under it.

Anything with its own page gets its own folder, holding the text as `index.md`
and its pictures next to it:

```
content/news/2026-09-04-new-paper/
  index.md
  01-first-photo.jpg
```

Pictures in the folder are used automatically - the first as the header and the
thumbnail, the rest as a carousel. Nothing to list.

You never start from a blank file. Each collection has a `_template/` folder:
copy the whole thing, rename the copy after what you are adding, and fill it
in. It already holds `index.md` with every field explained, and a `media.yaml`
for the times a picture needs framing. A leading underscore is what keeps the
template itself off the site.

Media files are picked up automatically. Name them after their date -
`YYYY-MM-DD.jpg` - and write the caption in `content/media/media.yaml`. Keep GIFs and clips small, and
put long videos on [our YouTube channel](https://www.youtube.com/@SwarmSystemsLab)
instead. There is a worked example for every kind of picture (gallery, news,
research, people) in
[content/README.md](content/README.md#photos-gifs-and-video).

If you get something wrong - a missing field, a malformed date - the build stops
and the Actions tab tells you which file and which line to fix. Nothing broken
reaches the live site.

## Running it locally

Requires [Bun](https://bun.sh).

```sh
bun install
bun run dev      # http://localhost:4321
```

`bun run build` produces the static site in `dist/`.

Working on the code rather than the content? See [docs/developing.md](docs/developing.md).
