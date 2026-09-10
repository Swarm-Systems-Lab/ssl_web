---
# HOW TO ADD A PROJECT
#
# Copy this whole folder, leave the copy here beside the others, and name it
# after the project:
#
#   content/projects/python-simulation-environment/
#     index.md        ← this file, already named right
#     media.yaml      ← how the pictures are framed; delete it if not needed
#     01-screenshot.png
#
# The folder name becomes the address: /projects/python-simulation-environment
#
# An entry is a project, not a repository. One project can be made of a dozen
# repos, or of none at all - a tutorial is a PDF, and the autopilot is a project
# whose code is not public yet.
#
# Write what it is and how its parts fit. Leave installing and using it to the
# repository: that copy is next to the code and cannot go stale.

title: "Name of the project"
role: "What it is in a few words"   # e.g. "Simulation and analysis stack"
group: software                     # software, hardware, tutorial
order: 10                           # lower numbers appear first on the shelf
summary: "One or two sentences: what it is for, and who would want it."

# Optional ------------------------------------------------------------------
# status: "Not public yet"          # shown beside the title, when worth saying
#
# The repositories it is made of. `needs` names others in this same list, so
# the dependency chain is written once and drawn from here.
# repos:
#   - name: ssl_simulator
#     href: https://github.com/Swarm-Systems-Lab/ssl_simulator
#     role: The engine. Components in a World, systems over N agents.
#     group: core            # core (the default), tooling, example
#     needs: ["ssl_link"]
#   - name: gvf_so3
#     href: https://github.com/Swarm-Systems-Lab/gvf_so3
#     role: A worked end-to-end example.
#     group: example
#
# The three blocks are shown in that order, and a block with nothing in it is
# left out - so a project whose repos are all `core` shows no headings at all.
#
# links:                            # docs sites, PDFs, anything worth opening
#   - label: Documentation
#     href: https://swarm-systems-lab.github.io/...
#
# works: ["U1"]                     # papers it implements, by their reference
# image: ./01-screenshot.png        # only if the folder has several pictures
# imageAlt: "What the picture shows"
# draft: true                       # hides it until you remove this line
---

Anything written here becomes the project's own page, and this is where the
documentation goes: what it is for, how the pieces fit together, why it exists,
what it replaced. Leave it empty and no page is created - the card on the
projects page just won't link anywhere.

Every other picture in the folder is shown at the end of the page.
