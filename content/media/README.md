# Media

Everything the media page shows lives here: the files in this folder, and the
YouTube videos listed in `media.yaml` beside them.

## Files

Drop photos, GIFs, and short clips in and they appear automatically. Name them

    YYYY-MM-DD_short-caption.jpg

for example `2026-04-17_group-photo-in-granada.jpg`, which shows as "Group
photo in granada" dated 2026-04-17. A name that is only a date works too - use
`media.yaml` for the caption in that case.

Accepted: `.jpg .jpeg .png .webp .avif .gif .mp4 .webm`

Photos are resized automatically. GIFs and clips are served as they are, so
keep them small - under a few megabytes.

A file whose name starts with `_` is kept out of the gallery. That is how the
poster frames pulled from clips (`_poster.<name>.jpg`) can sit next to them
without being listed twice.

## Videos

A clip of yours and a video on YouTube are both videos, so both appear in the
same shelf at the top of the page, newest first. A clip is a file here; a
YouTube video has nothing to drop in, so it goes in `media.yaml`:

```yaml
videos:
  - youtube: 55N0cbsjq08
    caption: Fully autonomous fixed-wing aerobatics (without GPS)
    date: "2026-08-01"
```

## On the front page

The strip under *From the field* names what it shows, one item at a time, under
`fromTheField` in [`../site.yaml`](../site.yaml) - a file in this folder or one
of the videos above. Nothing here decides it.

A clip shows the frame it opens on until someone presses play. That still is
pulled out of the video automatically when the site is built, and saved beside
it as `_poster.<name>.jpg` - there is nothing to prepare and nothing to commit.
Delete one and it comes back on the next build; replace a clip and its still is
taken again.

## Captions and cropping

`media.yaml` also carries the per-file settings used everywhere else on the
site - `caption`, `alt`, `focus`, `zoom`. See the
[content README](../README.md).

The page's own settings - the intro line, how many photos per page, the channel
box - are in [`../media.yaml`](../media.yaml), one level up. Nothing about an
individual picture or video belongs there.
