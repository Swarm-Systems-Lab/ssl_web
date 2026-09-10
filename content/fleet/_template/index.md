---
# HOW TO ADD A ROBOT
#
# Copy this whole folder, leave the copy here beside the others, and name it
# after the machine:
#
#   content/fleet/delta-wing/
#     index.md        ← this file, already named right
#     media.yaml      ← how the pictures are framed; delete it if not needed
#     01-photo.jpg    ← pictures you add yourself
#
# The folder name becomes the address: /fleet/delta-wing - so keep it
# lowercase with dashes.
#
# This is not a datasheet. Say what the machine is to us and how we use it;
# leave the full build log to the paper. Three specs is usually plenty.

name: "Name we call it"
role: "What it is to the lab"   # e.g. "Fixed-wing testbed", shown above the name
group: fixed-wing               # fixed-wing, rotorcraft, rover, ground, retired
order: 10                       # lower numbers appear first inside the block
summary: "One or two sentences: what we use it for, and why this one."

# Optional ------------------------------------------------------------------
# count: 8                       # how many we have, shown as "x8"
# specs:                         # the two or three numbers worth showing
#   - label: Wingspan
#     value: 2.0 m
#   - label: Endurance
#     value: 45 min
#   - label: Autopilot
#     value: "[Palomo](/projects/palomo)"
# research: ["aerosense"]        # folder names from content/research/
# photo: ./01-photo.jpg          # only needed if the folder has several pictures
# note: "Flew 2019-2023"         # for anything in the retired block
# links:
#   - label: Build notes
#     href: https://...
# draft: true                    # hides it until you remove this line
---

Anything written here becomes the machine's own page: how it came to be, what
it is good and bad at, what we learned flying it. Leave this part empty and no
page is created - the card on the fleet page just won't link anywhere, which is
fine for a machine that only needs a photo and three numbers.

Every other picture in the folder is shown as a carousel at the end of the
page, in file-name order.
