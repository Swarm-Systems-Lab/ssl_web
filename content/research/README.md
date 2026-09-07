# Research

One folder per project. Copy `_template.md` into a new folder named after the
project, save it as `index.md`, and fill it in. The folder name becomes the
address:

```
content/research/aerosense/
  index.md
  01-avionics.jpg
```

-> `/research/aerosense`

This section is about the **funded projects** the lab runs: what each one set
out to do, who pays for it, who is on it, and the papers that came out of it.

## Papers

List them by their reference on the publications page - the `[J20]` labels -
rather than typing them out again:

```yaml
works: ["J20", "C15", "U1"]
```

Each one is then shown in full, exactly as on the publications page, in the
order written. A reference that does not exist stops the build and says so, so
a paper can never quietly vanish from a project page.

## Funding and partners

```yaml
funding:
  - name: ERC
    programme: Starting Grant
    reference: "101076091"
    href: https://cordis.europa.eu/project/id/101076091
    logo: erc
partners:
  - name: Company S.L.
    href: https://example.com
```

Only `name` is needed. `logo:` is a file name in `content/affiliations/`, and
shows the mark next to the name. Use `partners:` for the companies and groups
we run a project with, `funding:` for whoever pays.

## Links

```yaml
links:
  - label: Canal Sur, EnRed
    href: https://www.canalsurmas.es/videos/380711-enred-aerosense
```

For anything the project should point at that is not a paper: its own site, the
code, a dataset, or a video that lives somewhere it cannot be embedded from.
YouTube videos are different - those play on the page, so they go in
`images.yaml` under `videos:`.

## People

```yaml
members: ["hector-garcia-de-marina", "A collaborator elsewhere"]
```

A folder name under `content/team/` becomes that person, linked to their page
when they have one. Anything else is shown as written.

## Pictures

`image:` is the picture shown beside the project in the list. Every other
picture in the folder appears as a carousel at the end of the project's page,
in file-name order. A video can lead instead - a `.mp4` in the folder, or a
YouTube link in `images.yaml` under `videos:` with `cover: true`. Cropping and captions work as everywhere else - see
[`content/README.md`](../README.md).

Projects are ordered by the `order` field - lower numbers first.
