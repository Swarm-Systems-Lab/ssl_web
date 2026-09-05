# Team

People are filed by what they are to the lab, one folder each:

```
content/team/
  members/          current members
    hector-garcia-de-marina/
      index.md
      hector.jpg
  visitors/         people visiting us
  alumni/           people who have moved on
```

The folder name inside the category becomes the address:
`members/diego-vela/` → `/team/diego-vela`.

Copy `_template.md` into a new folder, save it as `index.md`, and fill it in.

## Which fields you need

Everyone needs `name`, `role`, `order`, and `summary`.

Only people under `members/` need a `group:` line, which decides the block they
appear in: `lead`, `postdoc`, `phd`, or `assistant`. Visitors and alumni take
their group from the folder they are in.

`order` sorts people inside their block — lower numbers first.

## Photos

Put the photo in the person's own folder. It is picked up automatically, so
`photo:` is only needed if there is more than one picture there — in which case
the first by file name wins, so a `01-` prefix decides it:

```
members/diego-vela/
  index.md
  diego.jpg          ← used, no need to mention it anywhere
```

This works the same for everyone. Members show theirs large at the top of their
card; alumni and visitors show a small one beside their name, and simply have no
picture if the folder holds none.

Square pictures look best.

## Pages

Someone gets their own page only if their file has text below the frontmatter.
Alumni and visitors are usually a single line with no text, so they stay on the
team page.

## When things change

Someone leaving: move their folder into `alumni/`, drop the `group:` line, and
add a `note` saying where they went. A visitor arriving: a folder under
`visitors/` with a `note` giving the dates.
