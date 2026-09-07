---
# HOW TO ADD A POST
#
# Make a folder in content/news/ named after the post, and put this file in it
# as index.md:
#
#   content/news/2026-09-04-new-paper/index.md      ← this file, renamed
#   content/news/2026-09-04-new-paper/01-photo.jpg  ← pictures, if you have any
#
# The folder name becomes the address: /news/2026-09-04-new-paper
# A post with no pictures can also be a single file, 2026-09-04-new-paper.md.

title: "Short headline for the post"
date: 2026-01-01

# Optional ------------------------------------------------------------------
# Papers the post is about, by their reference on the publications page. Each
# one is shown in full underneath the post, so there is no need to type out
# the authors and the venue again.
# works: ["C42", "C41"]
# summary: "The line shown under the title in the news list. Left out, it is
#          taken from the post itself, starting after the opening sentence.
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

To put a picture in the middle of the text instead, write:

![What the picture shows](./02-another-photo.jpg)

To embed a YouTube video, paste this and change the id after `embed/`:

<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" allowfullscreen></iframe>
