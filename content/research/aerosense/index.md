---
title: "Aerosense: Spatial Awareness Avionics Network for Drone Swarms Aerosense"
summary: "Aerosense delivers an avionics system purpose-built for distributed spatial awareness and clock synchronization without external infrastructure by integrating Ultra-Wideband (UWB) transceivers with custom protocols operating immediately above the physical layer."
acronym: "aerosense"
period: "2026 - 2027"
order: 1
funding:
  - name: ERC
    programme: Proof of Concept
    reference: "101289893"
    href: https://cordis.europa.eu/project/id/101289893
    logo: erc
partners:
  - name: Universidad de Granada
    href: https://www.ugr.es
works: []
members: ["jose-hinojosa-hidalgo", "jesus-bautista-villar", "diego-vela"]
---

The drone swarm revolution promises to transform industries from defense to disaster relief, yet a
fundamental bottleneck prevents its realization. Current systems lack true distributed spatial awareness—the
ability for each drone to understand not only its neighbor’s positions but the swarm’s overall distribution.
Today’s swarms rely on either centralized coordination or generic protocols that saturate with few units,
forcing a tradeoff: accept external dependencies like GPS, or endure non-scalable swarms under network
overload. Regarding distributed systems, sophisticated drones operate on primitive infrastructures,
like smartphones trying to function on dial-up connections.

Aerosense delivers an avionics system purpose-built for distributed spatial awareness and clock
synchronization without external infrastructure by integrating Ultra-Wideband (UWB) transceivers with
custom protocols operating immediately above the physical layer. Building on advances from our ERC
Starting Grant, we implement distributed consensus algorithms that let each drone estimate relative positions
as well as global swarm properties such as centroid and spatial moments. Unlike existing approaches that
route distributed algorithms through centralized layers, Aerosense provides native distributed computation as
a network service.

Our proof-of-concept focuses in four areas: embedded firmware, theoretical refinement, flight testing, and
business development. We employ commercial UWB modules for real-time performance (microcontrollers),
while refining protocols with graph-theoretic methods and multi-channel architectures to ensure scalability.
Market pathways include licensing, consultancy, and an open-source ecosystem. An iterative “fail fast, fix
fast” process drives near-weekly flight tests. Initial demonstrations target 10-drone swarms—the current
market sweet spot—i.e., the critical step toward future 100+ unit deployments. Aerosense brings swarm
coordination into an operational reality.