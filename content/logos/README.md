# Logos

The small marks beside our outside links — on the front page under **Find us
elsewhere**, and in the **Elsewhere** column of the footer.

## Adding one

Name the file after the link and drop it in here:

```
content/logos/
  github.svg
  youtube.svg
  discord.svg
```

The name is the link's label, lowercased with dashes for spaces, so a link
labelled `Google Scholar` looks for `google-scholar.svg`. If the file has to be
called something else, say so in `../site.yaml`:

```yaml
social:
  - label: Our code
    href: https://github.com/Swarm-Systems-Lab
    logo: github
```

A link with no matching file simply shows its text, which is what happened
before any of these existed.

## Colour does not matter

Whatever colour the brand publishes, the site renders the mark **pure white** —
there is no need to find or make a white version. Hand over the official file as
downloaded.

`.svg` is best because it stays sharp at any size. `.png` and `.webp` work too;
use one with a transparent background.

## Where these came from

The three above are the official marks from
[Simple Icons](https://simpleicons.org), which publishes them under CC0. The
logos themselves remain the trademarks of their owners — fine for linking to our
own profiles, which is all we do with them.
