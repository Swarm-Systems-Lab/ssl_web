# Images used by the YAML pages

Pictures for publications, awards, positions, and student projects go here,
because those pages are built from the `.yaml` files rather than from Markdown.

Organise them in folders however you like, then write the path **relative to
`content/`**:

```yaml
image: images/awards/erc.jpg
imageAlt: "The ERC logo on a lab wall"
```

```yaml
photos:
  - images/granada/alhambra.jpg
  - images/granada/albaicin.jpg
```

Pictures that belong to a news post, a research topic, or a person do **not**
go here - they live next to that content, in `news/images/`, `research/images/`,
and `team/photos/`.

If a path is wrong, the build stops and tells you which file it could not find
and what the closest match was.
