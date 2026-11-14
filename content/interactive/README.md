# A paper's own pages: the explainer and the playground

Some papers come with two pages of their own:

- the **explainer** (`explained.html`): the paper written out step by step, with
  interactive figures;
- the **playground** (`playground.html`): simulators where a reader tests the
  paper's results by hand.

They are made in the paper's repository, not here. The instructions for making
them are in `Workspace/papers/howto/interactive.md`. What arrives here are two
finished, self-contained HTML files, one each, which work on their own and know
nothing about this site. The site puts its own header, tabs and footer around
them.

## Adding them to a paper

1. **Copy the two files** into a folder named after the paper:

   ```
   content/interactive/<folder>/
     explained.html
     playground.html
   ```

   Use a short, lowercase name with dashes (`affine-formation-control`). In the
   paper's repository, `make site` in its `web/` folder does this copy.

2. **Point the paper at them** in `content/publications.yaml`, next to its `doi`
   and `pdf`. The paths are relative to `content/`:

   ```yaml
     - ref: J25
       title: "..."
       doi: ...
       pdf: ...
       explainer: interactive/affine-formation-control/explained.html
       playground: interactive/affine-formation-control/playground.html
   ```

   A paper can have one of the two, or both.

3. **Build** with `bun run build`, or look at it with `bun run dev`. The build
   stops if a path is wrong or the file is missing, and the message names the
   paper and the field.

That is all. Do not add them under `links:` as well.

## What the reader gets

- Two buttons on the paper, right after DOI and PDF: **Explainer** and
  **Playground**. They appear in the list of publications and on the paper's
  own page.
- A page for each, at `/publications/<paper>/explainer` and
  `/publications/<paper>/playground`. It has the site's header with every tab,
  then a bar with a way back to the paper, a tab for each of its pages, and
  "open on its own". The HTML file fills the rest of the window and scrolls by
  itself.
- The site's light/dark switch drives the page too.
- A link from one page to the other (`playground.html` written inside
  `explained.html`) opens the site's page for it. Every other link opens in the
  whole window.
- An anchor in the address (`/publications/<paper>/explainer#sec-checks`)
  opens the page at that section.

The words on the buttons and in the bar are in `content/pages.yaml`, under
`publications: labels:` (`explainer`, `playground`, `back-to-paper`,
`open-alone`).

## What a file must be

- **One self-contained file.** It loads nothing from next to it and nothing from
  the network (Quarto's `embed-resources: true`). Each page should stay under
  about 4 MB, because every reader downloads it whole.
- **Named `explained.html` and `playground.html`**, so the links between them
  keep working here and anywhere else.
- **Light and dark.** Quarto pages with a light and a dark theme follow the site
  without anything else. A page made another way can follow it by listening for
  the message the site sends it:

  ```js
  addEventListener("message", (e) => {
    if (e.data?.type === "ssl-theme") document.documentElement.dataset.theme = e.data.theme;
  });
  ```

- A name starting with `_` stays off the site, as everywhere in `content/`.

## How it works, for whoever changes it

- `tools/interactive.mjs` copies `content/interactive/` to `/interactive/` in
  the build, and serves it from there in `bun run dev`. The bare files stay
  reachable: that is the "open on its own" link.
- `src/lib/data.ts` reads `explainer:` and `playground:`, checks the files, and
  gives every paper its `views` and their buttons.
- `src/pages/publications/[slug]/[view].astro` is the page with the frame. Its
  script follows the theme, rewrites the links inside the frame, hides the
  page's own theme toggle and keeps the anchor in the address bar.
