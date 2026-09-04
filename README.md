# Swarm Systems Lab

Static website for the Swarm Systems Lab. It is built with Vite, React, and TanStack Router, then deployed to GitHub Pages.

## Add content

Create or copy a Markdown file in [`src/content`](src/content):

- [`news`](src/content/news) for announcements
- [`research`](src/content/research) for research areas and notes
- [`team`](src/content/team) for people and collaborators

The filename becomes the page URL. Use the frontmatter shown in [`src/content/README.md`](src/content/README.md), write the page below it, and push the change. The GitHub Actions workflow builds and publishes the site automatically.

News, research, and team entries have their own detail pages. Publications, media, and positions remain collection pages and are edited in their route files until they need the same content workflow.

## Local development

Requires [Bun](https://bun.sh).

```sh
bun install
bun run dev
```

Run the checks before opening a pull request:

```sh
bun run lint
bunx tsc --noEmit
bun run build
```

## Structure

- `src/content/` is editor-facing content.
- `src/routes/` contains page shells and navigation.
- `src/components/` contains shared presentation.
- `public/` contains files copied directly to the published site.
- `.github/workflows/deploy.yml` builds and deploys GitHub Pages.

Large or fast-growing media should not live in Git. Use YouTube for video, and use an object store or media service for original photos, GIFs, and video files. Keep only small optimized thumbnails in `public/` when a local preview is useful. Git LFS is an option for source archives, but it does not reduce the hosting burden of a public media-heavy website.
