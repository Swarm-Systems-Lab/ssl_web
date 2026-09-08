---
# HOW TO ADD A PROJECT
#
# Make a folder in content/research/ named after the project, and put this file
# in it as index.md:
#
#   content/research/aerosense/index.md      ← this file, renamed
#   content/research/aerosense/01-field.jpg  ← pictures, if any
#
# The folder name becomes the address: /research/aerosense

title: "Name of the project"
summary: "One or two sentences shown on the projects list."
order: 10          # lower numbers appear first

# Optional ------------------------------------------------------------------

# acronym: "iSwarm"          # the short name the project goes by
# period: "2023 - 2028"

# Who pays for it. `name` is the only part you need; add the rest when it is
# worth showing. `logo:` is a file name in content/logos/.
# funding:
#   - name: ERC
#     programme: Starting Grant
#     reference: "101076091"
#     href: https://cordis.europa.eu/project/id/101076091
#     logo: erc

# Who we run it with - a company, an institute, another group. Same fields.
# partners:
#   - name: Company S.L.
#     href: https://example.com

# Papers from the project, by their reference on the publications page. Each
# one is shown in full, in the order written here.
# works: ["J20", "C15", "U1"]

# People on the project. A folder name under content/team/ links to that
# person; anything else is shown as written.
# members: ["hector-garcia-de-marina", "A collaborator elsewhere"]

# Anything else worth pointing at: the project's own site, the code, a dataset,
# a television piece that cannot be embedded.
# links:
#   - label: Canal Sur, EnRed
#     href: https://www.canalsurmas.es/videos/380711-enred-aerosense

# image: ./01-field.jpg            # the picture beside the project in the list
#                                  # (a video can lead instead - put it in
#                                  #  media.yaml under `videos:` with
#                                  #  `cover: true`)
# imageAlt: "What the picture shows"
# tags: ["control", "uav"]
# draft: true
---

Describe the project here in Markdown: what it set out to do, where it has got
to, what is next. Any other picture in the folder is shown as a carousel at the
end of the page, in file-name order.
