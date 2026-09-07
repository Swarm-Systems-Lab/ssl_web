# Affiliation logos

The university, institutes, and funders shown in a band at the foot of the front
page.

## Two steps

**1. List it** in [`../site.yaml`](../site.yaml) under `affiliations:`:

```yaml
affiliations:
  - label: Universidad de Granada
    href: https://www.ugr.es
    logo: ugr
```

`href` is optional - an institution with no link is shown, just not clickable.
`logo` is optional too; without it the file name is taken from the label, so
`European Research Council` looks for `european-research-council.svg`. Short
names like `ugr` or `erc` are easier to type, which is what `logo:` is for.

**2. Drop the file in here**, matching that name:

```
content/affiliations/
  erc.jpg
  imag.png
```

### Folders

Institutions often publish a whole pack - vertical and horizontal, colour and
mono. Keep the pack as it comes and name the one you want by its path:

```
content/affiliations/
  ugr/
    vertical/UGR-MARCA-01-color.svg
    horizontal/UGR-MARCA-02-color.svg
```

```yaml
  - label: Universidad de Granada
    logo: ugr/vertical/UGR-MARCA-01-color
```

Capitals, spaces, and underscores do not matter - `UGR-MARCA-01-color`,
`ugr marca 01 color`, and `UGR_MARCA_01_COLOR` all find the same file. Leave the
extension off.

If a file's name is unique across the whole folder you can use it on its own,
without the path. Where two files would end up with the same name the build
prints a warning naming both, and you should use the full path for those.

Until the file exists the institution's **name is shown as text** in its place,
so the band is useful straight away and it is obvious which artwork is still
missing.

## Any file will do

Use the official logo **exactly as the institution publishes it**. There is no
need to hunt for a transparent version, recolour it, or shrink it first.

Each logo sits on a small white plate, so it reads correctly on our dark page in
its own colours - including the common case of a PNG or JPG flattened onto a
white rectangle, which would otherwise disappear.

- `.png`, `.jpg`, `.webp` are all fine, and are resized and converted
  automatically. Hand over the largest version you can find.
- `.svg` is used as it is, and stays sharp at any size.

Every logo is scaled to the same height, so a wide wordmark and a square seal sit
together without one dwarfing the other.

If you happen to have a clean **transparent** file and would rather it appeared
as a plain white mark with no plate, add `white: true` to that entry in
`site.yaml`. Do not use it on a logo with a solid background - the whole
rectangle would turn white.

## Where to get them

Most institutions publish a press or brand-assets page. The ERC and the ministry
both have downloadable logo packs, and universities usually keep theirs under a
communications or identity section. Check each one's rules on use - acknowledging
funding is normally exactly what they are for.
