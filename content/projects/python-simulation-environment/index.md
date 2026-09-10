---
title: "Python simulation environment"
role: "Simulation, visualization, and the pipeline around them"
group: software
status: "Stable"
order: 0
summary: >-
  The stack the lab simulates with: an engine that steps N agents at once, a GPU
  viewer for the runs it produces, a link layer that makes a simulated vehicle
  and a real one look the same downstream, and the tooling that keeps a dozen
  repositories building the same way.

repos:
  - name: ssl_simulator
    href: https://github.com/Swarm-Systems-Lab/ssl_simulator
    role: >-
      The engine. A data-oriented core: mutable state lives in a World as
      component arrays, behaviour is Systems that vectorize over N agents, and a
      scheduler orders them by their dependencies.
    needs: ["ssl_link"]
  - name: ssl_simulator_vista
    href: https://github.com/Swarm-Systems-Lab/ssl_simulator_vista
    role: >-
      The viewer, published as ssl_vista. Loads a run and plays it back through
      configurable multi-panel windows, PyVista for the 2D and 3D scenes.
    needs: ["ssl_simulator", "ssl_link"]
  - name: ssl_link
    href: https://github.com/Swarm-Systems-Lab/ssl_link
    role: >-
      The ground data plane, and the reason the rest composes. One interface for
      reading robot data - a log, a running simulation, a vehicle over telemetry
      - and one for sending commands back. It owns the log format, so every
      producer writes what every consumer reads.
  - name: lieplusplus_py
    href: https://github.com/Swarm-Systems-Lab/lieplusplus_py
    role: >-
      Lie group operations - SO(3) and friends - as a Python wrapper over Lie++.
      Optional: the engine pulls it in through its `lie` extra, for the work
      that needs it.
  - name: ssl_py_template
    group: tooling
    href: https://github.com/Swarm-Systems-Lab/ssl_py_template
    role: >-
      Where a new project starts. A Copier template wiring up uv, just, ruff and
      pytest; `project_kind` chooses between a publishable package and a
      notebook-driven research project.
  - name: ssl_pydev
    group: tooling
    href: https://github.com/Swarm-Systems-Lab/ssl_pydev
    role: >-
      The command every Python project here is developed through. Installed once
      per machine rather than copied into each project, and it is the same code
      the CI runs, not a second copy of it.
  - name: ssl_ci
    group: tooling
    href: https://github.com/Swarm-Systems-Lab/ssl_ci
    role: >-
      One source of truth for CI across the organisation. Projects call into its
      reusable workflows instead of each carrying its own YAML.
  - name: gvf_so3
    group: example
    href: https://github.com/Swarm-Systems-Lab/gvf_so3
    role: >-
      A worked end-to-end example, and the simulation code behind the
      singularity-free path following paper.
    needs: ["ssl_simulator", "ssl_simulator_vista", "lieplusplus_py"]

links:
  - label: Simulator docs
    href: https://swarm-systems-lab.github.io/ssl_simulator
  - label: Vista docs
    href: https://swarm-systems-lab.github.io/ssl_simulator_vista

works: ["U1"]
---

Everything the lab simulates runs through these repositories. They are separate
because they answer separate questions, and the separation is what lets a paper
reuse the parts it needs without inheriting the rest.

## How the pieces fit

`ssl_simulator` is the engine. State lives in a `World` as component arrays, and
behaviour is `System` callables vectorized over all N agents at once rather than
looped per robot; a scheduler orders them by their dependencies and an `Engine`
ticks and logs.

`ssl_link` is what everything else agrees on. Its two contracts are worth
learning before anything else: a frame is `(time, {name: array})` (a snapshot of
named, entity-indexed arrays) and data flows through a `DataSource` while
commands flow back through a `Commander`. Because a frame is the same whether it
came from a solver an hour ago or a radio a millisecond ago, a simulated vehicle
and a flying one look identical to everything downstream, and a plot that reads
`"p"` does not care which it was.

`ssl_simulator_vista` reads those runs back. `lieplusplus_py` is pulled in only
where Lie group operations are needed, which is why it sits behind the engine's
`lie` extra rather than in its dependencies.

## Starting something new

Every Python project here is generated from `ssl_py_template`, developed through
`ssl_pydev`, and tested by `ssl_ci`. That is deliberate: the build, publish and
docs logic exists once, in `ssl_pydev`, and both a laptop and a CI runner
execute that same code rather than two copies that start identical and drift.

`gvf_so3` is the end-to-end example. It is a real paper's simulation code, and
it shows the whole chain in use: the engine for the dynamics, Lie++ for the
attitude work, vista for the figures, with dependencies exact-pinned and the
lockfile committed so the environment behind the published figures can be
reproduced.

Work that turns out to be generally useful moves down into `ssl_simulator` or
`ssl_simulator_vista`. What stays in a project like `gvf_so3` is what is only
true of that paper.
