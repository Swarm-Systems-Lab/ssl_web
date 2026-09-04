# Content

The website is built from Markdown files in these folders:

- `news/` for announcements and updates
- `research/` for research areas or detailed notes
- `team/` for people and collaborators

Copy an existing file, change the filename to a URL-safe slug, and edit the frontmatter and text. A new file is automatically included in the next build.

Required frontmatter:

```md
---
title: A clear page title
summary: One sentence used on the list page
---
```

Optional fields are `date`, `role`, `tags`, and `image`. Keep dates in `YYYY-MM-DD` format. Images, GIFs, and videos that are specific to a post should be stored outside the repository when they are large; link to them from the Markdown frontmatter or body.
