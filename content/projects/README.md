# Projects

The bookshelf: the things the lab has built and their documentation. One folder per
project. Copy the `_template/` folder here, rename the copy after the project,
and fill in the `index.md` inside it. The folder name becomes the address:

```
content/projects/python-simulation-environment/
  index.md
  01-screenshot.png
```

`/projects/python-simulation-environment`.

## A project is not a repository

That is the distinction the whole section rests on. One project can be made of a
dozen repositories, or of none at all:

- **Python simulation environment** - eight repositories, one project.
- **Palomo** - the autopilot. No public repository yet, and still worth a page
  for its history and philosophy.
- **A tutorial** - a compiled PDF and a link, no code at all.
- **A hardware project** - photos, a bill of materials, maybe a repository of
  print files.

So `repos:` is a list, and everything about where code lives is optional.

## What to write, and what not to

Write what it is for, how the parts fit together, why it exists, what it
replaced. That is the thing no repository can say about itself, it is what a new
student needs on day one, and it changes perhaps twice a year.

Do not copy installation steps, API reference or tutorials out of a repository.
That copy is next to the code, it is the one people trust, and a second copy
here starts rotting the day it is written. Link to it instead.

## Fields

Everyone needs `title`, `role`, `group`, `order`, and `summary`.

`group` decides the shelf: `software`, `hardware`, or `tutorial`.

| Optional  |                                                                    |
| --------- | ------------------------------------------------------------------ |
| `status`  | shown beside the title - "Not public yet", "Work in progress"       |
| `repos`   | the repositories it is made of, each with a `role`, a `group` and what it `needs` |
| `links`   | documentation sites, PDFs, anything worth opening                   |
| `works`   | papers it implements, by their reference in `publications.yaml`     |
| `image`   | only when the folder holds several pictures                         |
| `draft`   | hides it from the built site, shows it on `bun run dev`             |

`needs` names other entries in the same `repos:` list, so the dependency chain
is written once and drawn from there.

Each repo's `group` puts it in a block: `core` (the default - what someone
reads first), `tooling` (what holds the pipeline together), or `example` (what
is there to be copied from). The blocks show in that order, and one with
nothing in it is left out, so a project whose repos are all `core` looks
exactly as it would with no groups at all. A `works:` reference that is not in
`publications.yaml` stops the build.

## Whether it gets its own page

Anything with body text or a picture gets one, the same rule the team and fleet
pages use. Without either, it is still listed - the card just does not link.
