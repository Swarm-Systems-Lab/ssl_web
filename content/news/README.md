# News

One folder per post. Copy the `_template/` folder here, rename the copy
`YYYY-MM-DD-a-few-words`, and fill in the `index.md` inside it. The folder name
becomes the address:

```
content/news/2026-09-04-new-paper/
  index.md                     ← the post
  01-first-photo.jpg           ← pictures live next to it
  02-second-photo.jpg
```

-> `/news/2026-09-04-new-paper`

Every picture in the folder except the one used as `image:` is shown as a
carousel at the end of the post, in file-name order - hence the `01-`, `02-`
prefixes. Nothing to list.

A post with no pictures can also be a plain file, `2026-09-04-new-paper.md`.

Newest posts appear first, sorted by the `date` field.
