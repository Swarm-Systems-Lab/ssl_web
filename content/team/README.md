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
`members/diego-vela/` -> `/team/diego-vela`.

Copy the `_template/` folder - it sits at the top of `content/team/`, outside
the three categories - into the category they belong to, rename the copy after
them, and fill in the `index.md` inside it.

## Which fields you need

Everyone needs `name`, `role`, `order`, and `summary`.

Only people under `members/` need a `group:` line, which decides the block they
appear in: `lead`, `postdoc`, `phd`, or `assistant`. Visitors and alumni take
their group from the folder they are in.

`order` sorts people inside their block - lower numbers first.

## Group photos

Photos of the whole lab go in `photos/`, not in a person's folder; they become
the carousel at the top of the page. See the README in there.

## Photos

Put the photo in the person's own folder. It is picked up automatically, so
`photo:` is only needed if there is more than one picture there - in which case
the first by file name wins, so a `01-` prefix decides it:

```
members/diego-vela/
  index.md
  diego.jpg          ← used, no need to mention it anywhere
```

This works the same for everyone. Members show theirs large at the top of their
card; alumni and visitors show a small one beside their name, and simply have no
picture if the folder holds none.

On the person's own page the shape of the picture decides the layout, and this
is worked out automatically - there is nothing to set:

- a **passport-style** picture (square or taller than it is wide) sits to the
  left of the name, as a neat portrait;
- a **wide** picture - someone in the field, or a photo with the lab around
  them - goes underneath the name at full width, because it would be squeezed
  to nothing in a narrow column.

So a portrait crop is best if you want the compact layout, and a wide shot is
best if the surroundings are part of the picture. Either works.

## Pages

Anyone with a photo or some text below the frontmatter gets their own page, so
alumni and visitors are shown properly rather than only as a line on the team
page. Someone with neither simply has no page, and their name is not a link.

Write as much or as little below the frontmatter as you like - the page works
either way.

## When things change

Someone leaving: move their folder into `alumni/`, drop the `group:` line, and
add a `note` saying where they went. A visitor arriving: a folder under
`visitors/` with a `note` giving the dates.
