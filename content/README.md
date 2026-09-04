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
