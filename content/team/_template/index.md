---
# HOW TO ADD SOMEONE
#
# Copy this whole folder into the category they belong to, and name the copy
# after them:
#
#   content/team/members/jane-doe/
#     index.md        ← this file, already named right
#     media.yaml      ← how their photo is framed; delete it if not needed
#     jane.jpg        ← their photo, picked up automatically
#
# Categories: members/ (current), visitors/, alumni/ - this template sits one
# level up, outside all three, so it is never mistaken for a person.
#
# The folder name becomes the address: /team/jane-doe - so keep it lowercase
# with dashes.

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
