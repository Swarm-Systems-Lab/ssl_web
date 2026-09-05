# Swarm Systems Lab

The website of the [Swarm Systems Lab](https://www.swarmsystemslab.eu), University of Granada.

Everything you can edit lives in [`content/`](content). Push a change there and
the site rebuilds and republishes itself within a couple of minutes.

## Adding content

| I want to add…        | Do this                                                                       |
| --------------------- | ----------------------------------------------------------------------------- |
| a news post           | copy [`content/news/_template.md`](content/news/_template.md)                 |
| a research topic      | copy [`content/research/_template.md`](content/research/_template.md)         |
| a person              | copy [`content/team/_template.md`](content/team/_template.md)                 |
| a photo, GIF, or clip | drop the file in [`content/media/`](content/media)                            |
| a paper               | add it at the top of [`content/publications.yaml`](content/publications.yaml) |
| an open position      | add it to [`content/positions.yaml`](content/positions.yaml)                  |
| a TFM/TFG project     | add it to [`content/projects.yaml`](content/projects.yaml)                    |
| an award              | add it to [`content/awards.yaml`](content/awards.yaml)                        |
| a YouTube video       | add it to [`content/media.yaml`](content/media.yaml)                          |

News posts, research topics, and people each get their own page; the file name
becomes the address. Everything else appears on a single shared page.

Each folder has a `_template.md` with the fields explained, and a `README` next
to the files. Copy the template, rename it, fill it in — that is the whole job.

**Prefer a form?** Open the repository's **Actions** tab → **Add a post** → **Run
workflow**. Fill in the fields and the post is written and published for you.

Media files are picked up automatically. Name them `YYYY-MM-DD_short-caption.jpg`
and the date and caption come from the file name. Keep GIFs and clips small, and
put long videos on [our YouTube channel](https://www.youtube.com/@SwarmSystemsLab)
instead. There is a worked example for every kind of picture (gallery, news,
research, people) in
[content/README.md](content/README.md#photos-gifs-and-video).

If you get something wrong — a missing field, a malformed date — the build stops
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
