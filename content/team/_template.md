---
# HOW TO ADD SOMEONE
#
# Make a folder for them inside the right category and put this file in it as
# index.md, with their photo next to it:
#
#   content/team/members/jane-doe/index.md     ← this file, renamed
#   content/team/members/jane-doe/jane.jpg     ← picked up automatically
#
# Categories: members/ (current), visitors/, alumni/
# The folder name becomes the address: /team/jane-doe

name: "Jane Doe"
role: "Ph.D. student"        # free text, shown above the name
order: 20                    # lower numbers appear first inside the block
summary: "One sentence shown on the team page card."

# Only for people in members/ - which block they belong in.
# One of: lead, postdoc, phd, assistant
group: phd

# Optional ------------------------------------------------------------------
# photo: ./jane.jpg              # only needed if the folder has several pictures
# note: "After: engineer at ..."   # used for alumni and visitors
# links:
#   - label: Google Scholar
#     href: https://...
#   - label: GitHub
#     href: https://...
# draft: true
---

Write the longer description here. Anything below the `---` becomes the person's
own page. Leave this part empty and no page is created - the card on the team
page just won't link anywhere, which is what we do for most alumni and visitors.
