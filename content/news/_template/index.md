---
# HOW TO ADD A POST
#
# Copy this whole folder, leave the copy here beside the others, and name it
# after the post:
#
#   content/news/2026-09-04-new-paper/
#     index.md        ← this file, already named right
#     media.yaml      ← how the pictures are framed; delete it if not needed
#     01-photo.jpg    ← pictures you add yourself, if you have any
#
# Then fill in the two lines below and write the post underneath.
#
# The folder name becomes the address: /news/2026-09-04-new-paper - so keep it
# lowercase with dashes, and start it with the date, which is what keeps the
# folders in order on disk.
#
# A post with no pictures can also be a single file, 2026-09-04-new-paper.md,
# with no folder around it.

title: "Short headline for the post"
date: 2026-01-01

# Optional ------------------------------------------------------------------
# Papers the post is about, by their reference on the publications page. Each
# one is shown in full underneath the post, so there is no need to type out
# the authors and the venue again.
# works: ["C42", "C41"]
# summary: "The line shown under the title in the news list. Left out, it is
#           taken from the post itself, starting after the opening sentence."
# image: ./01-photo.jpg            # the big picture at the top of the post
# imageAlt: "What the picture shows"
# tags: ["paper", "field-test"]
# draft: true                      # hides the post until you remove this line
---

Write the post here in Markdown.

Leave a blank line between paragraphs. You can use **bold**, *italics*, and
[links](https://example.com). A bullet list looks like this:

- first point
- second point

Every other picture in the folder is shown as a carousel at the end of the post,
in file-name order - that is why the example above starts with `01-`. You do not
have to list them anywhere.

To put a picture in the middle of the text instead, copy this line out of the
fence below and point it at a file that is really in the folder:

```
![What the picture shows](./02-another-photo.jpg)
```

And to embed a YouTube video, this one, with the id after `embed/` changed:

```
<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" allowfullscreen></iframe>
```

Both are shown fenced rather than written out, so that copying this folder and
building it works before you have added a single picture. A picture that is not
in the folder stops the build.
