# Page covers

The picture across the top of a page. Drop a file in here named after the page
and it appears - there is nothing to switch on:

```
content/covers/
  home.png          the front page
  news.jpg          /news
  research.jpg      /research
  publications.jpg  /publications
  team.jpg          /team
  fleet.jpg         /fleet
  join-us.jpg       /join-us
  positions.jpg     /join-us/positions
  student-projects.jpg  /join-us/student-projects
  awards.jpg        /awards
  media.jpg         /media
```

Any of `.jpg .jpeg .png .webp .avif .gif` works. A page with no file here simply
has no cover, which is fine - none of them are required.

## Captions, cropping, and alt text

An `media.yaml` in this folder works exactly as it does anywhere else, so a
cover can say how it should be cropped and what it should be called:

```yaml
# content/covers/media.yaml
research.jpg:
  focus: top          # keep the top of the picture when it is cropped
  zoom: 1.2           # or 0.8 to show it whole, smaller than the banner
  caption: Field testing near Granada
  alt: A fixed-wing drone being launched by hand
```

See [`../README.md`](../README.md) for what each setting does.

Captions can also be written in `../site.yaml` under `coverCaptions:`, keyed by
the page name - the older way, still supported. When a picture is named in both
places the one here wins, being the more specific of the two.

The caption doubles as the description read out by screen readers, so it is
worth adding either way.

## Shape

`home.png` is shown whole, never cropped - it is the team photo, and nothing
should be cut off. Covers on the other pages are cropped to a wide banner, so
put the interesting part near the middle, or say where it is with `focus:`.
Wide pictures work best there; something around 1600 x 700 is plenty.
