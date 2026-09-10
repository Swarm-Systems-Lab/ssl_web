# Fleet

One folder per machine. Copy the `_template/` folder here, rename the copy
after the robot, and fill in the `index.md` inside it. The folder name becomes
the address:

```
content/fleet/delta-wing/
  index.md
  01-in-the-field.jpg
  02-close-up.jpg
```

`/fleet/delta-wing`. The first picture in the folder is the one on the card;
the rest become a carousel at the end of the machine's page.

## What goes here, and what does not

This page answers "what does this lab fly, and why", not "what is inside it".
A visitor wants to know that the fixed-wings are the platform the formation
work runs on, and that there are eight of them. The bill of materials, the
firmware branch, and the wiring belong in the repository or the paper.

So: `role` is what the machine is to us, `summary` is how we use it, and
`specs` is the two or three numbers someone would actually ask about. If you
find yourself writing a fourth, ask whether it changes how anyone reads the
machine.

## Which fields you need

Everyone needs `name`, `role`, `group`, `order`, and `summary`.

`group` decides the block it appears in, and is the one field with a fixed set
of values:

| `group`      | Block             |
| ------------ | ----------------- |
| `fixed-wing` | Fixed-wing        |
| `rotorcraft` | Rotorcraft        |
| `rover`      | Rovers            |
| `ground`     | Ground and comms  |
| `retired`    | Retired           |

Unlike people, a machine is not filed by folder - its block is a line in its
own `index.md`. Retiring something is a one-word edit, not a move.

Empty blocks are left out of the page, so the fleet can start with one robot.

## Optional fields

- `count` - how many there are, shown as `x8`. Leave it out for a one-off.
- `specs` - `label` / `value` pairs, shown in the order written.
- `research` - folder names from `content/research/`, which become links. A
  name that is not a project folder stops the build.
- `photo` - only needed when the folder holds several pictures and the first
  one is not the right cover.
- `note` - for the retired block: when it flew, or what replaced it.
- `links`, `draft` - as everywhere else.

## Whether it gets its own page

Anything with body text or a photo gets one, the same rule the team page uses.
A machine with neither is still listed; its card just does not link anywhere.
