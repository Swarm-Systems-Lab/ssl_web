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
  join-us.jpg       /join-us
  positions.jpg     /join-us/positions
  projects.jpg      /join-us/projects
  awards.jpg        /awards
  media.jpg         /media
```

Any of `.jpg .jpeg .png .webp .avif .gif` works. A page with no file here simply
has no cover, which is fine - none of them are required.

## Captions

Optional, and written in `../site.yaml` under `coverCaptions:`, keyed by the
same page name:

```yaml
coverCaptions:
  home: "The Swarm Systems Lab"
  news: "Field testing near Granada"
```

The caption doubles as the description read out by screen readers, so it is
worth adding.

## Shape

`home.png` is shown whole, never cropped - it is the team photo, and nothing
should be cut off. Covers on the other pages are cropped to a wide banner, so
put the interesting part near the middle. Wide pictures work best there;
something around 1600 x 700 is plenty.
