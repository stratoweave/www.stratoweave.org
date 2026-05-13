+++
title = "Technology"
weight = 3
+++
# Why StratoWeave exists

Modern network automation too often collapses service logic, vendor syntax, and
operational feedback into one pile of scripts. That makes systems hard to test,
hard to evolve, and hard to trust once they are connected to real networks.

StratoWeave exists to separate those concerns cleanly. It captures declarative
northbound intent, models each layer explicitly, and uses transforms to move
that intent down into device-facing outputs. With streaming telemetry in the
loop, the platform can also react to live network state instead of treating
operations as a one-way push.

The result is a network orchestration platform that stays focused on one job:
turn intent into layered automation that can be reasoned about, validated, and
adapted as networks grow.

# What makes StratoWeave different?

StratoWeave is built around model-driven declarative transforms rather than
imperative device workflows. YANG models define the boundaries between service
intent, resource intent, and rendered device configuration, which keeps the
automation stack typed and explicit at each layer.

That structure matters in practice. Smaller transforms are easier to test and
maintain than giant scripts. Turning YANG models into types helps move data and
model errors earlier into development time. The same layered approach also
makes it practical to target Cisco XR, Juniper, Nokia, and other major network
operating systems without rewriting the whole system for each vendor.

Telemetry is equally central. The platform is designed to consume streaming
state and drive reactive closed-loop behavior, not bolt observability on after
the fact.

If you want to see the full loop in a working system, start with
[SORESPO](https://github.com/stratoweave/sorespo), the reference implementation
used throughout the Learn section.

# What exists today?

StratoWeave is open source under Linux Foundation Networking and intentionally
focused in operational shape: one binary, zero external runtime dependencies,
and a straight path from source to working lab.

Today the project already includes the core transform model, the closed-loop
control approach driven by telemetry, and SORESPO as a complete sample
implementation for learning and experimentation. The site Learn section turns
that sample into a concrete path for running the system, inspecting layered
outputs, and then modifying the transforms yourself.

# Now and the road ahead

The direction is to keep the platform narrow, typed, and practical: deepen the
YANG-backed abstraction layers, improve model reuse, expand real network
coverage, and make it easier to move from lab validation to production-grade
workflows.

For the current project outlook, see the [current state and roadmap](@/technology/future.md).
