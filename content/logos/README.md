# Logos

Two kinds of mark live here, found the same way:

- **our outside links** — GitHub, YouTube, Discord — shown beside the link
- **institutions and funders** — the university, the institutes, the ERC —
  shown in the band on the front page and beside a project's funding

Drop the official file in, named after the label it belongs to:

```
content/logos/
  github.svg
  erc.png
  ugr/squared.png          an institution that publishes a whole set
  ec/horizontal/…
```

The name is matched loosely, so `MICIU_AEI_GE.svg`, `miciu-aei-ge.svg` and
`MICIU AEI GE.svg` all answer to the same label. A file in a subfolder can be
named by its path — `logo: ugr/squared` — or by its bare name where that is
still free.

Any of `.svg .png .webp .avif .jpg` works. SVGs are served untouched; anything
else is resized, so hand over the largest version you have.

## Using one

For an outside link, in `../site.yaml` under `elsewhere:`, the logo is found
from the label — no extra line needed. Add `logo:` only when the file is named
differently.

For an institution, in `../site.yaml` under `affiliations:`:

```yaml
affiliations:
  - label: European Research Council (ERC)
    href: https://erc.europa.eu
    logo: erc
```

and on a project, under `funding:` or `partners:` in its `index.md`.

Without a file the label is shown as text, so the list is useful before any
artwork has been collected.

## How they are drawn

An institution's logo sits on a white plate, which is what makes a PNG
downloaded from a university look right whether or not it has a transparent
background. A clean transparent file can instead be flattened to a single mark
in the theme's ink — black on the light page, white on the dark one — with
`mono: true`.
