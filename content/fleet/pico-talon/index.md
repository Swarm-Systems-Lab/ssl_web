---

name: "pico Talon"
role: "Mission platform"
group: fixed-wing
order: 3
summary: "The most serious aircraft we fly. It is sized around its payload: an edge-compute node for perception, aerosense for relative-state awareness, and the autopilot running our guidance algorithms. We are working towards a full mission demonstration with more than five of them."
count: 1

specs:
  - label: Wingspan
    value: 0.9 m
  - label: Endurance
    value: 20 min*
  - label: Payload
    value: 500g
  - label: Computer
    value: Jetson Orin Nano
  - label: Material
    value: ASA AERO
  - label: Print time
    value: 48h, one printer
  - label: Autopilot
    value: Paparazzi

research: ["aerosense"] 

links:
  - label: Design
    href: https://flightory.com/product/pico-talon/
---

<!-- Anything written here becomes the machine's own page: how it came to be, what
it is good and bad at, what we learned flying it. Leave this part empty and no
page is created - the card on the fleet page just won't link anywhere, which is
fine for a machine that only needs a photo and three numbers.

Every other picture in the folder is shown as a carousel at the end of the
page, in file-name order. -->
