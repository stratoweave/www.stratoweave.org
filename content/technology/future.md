+++
title = "Current State and Roadmap"
+++

# Current state

StratoWeave is still early, but the core shape is established. The project is
centered on model-driven declarative transforms, YANG-backed abstraction
layers, and reactive automation driven by streaming telemetry.

The current public on-ramp is SORESPO, the reference implementation used to
exercise the platform in a realistic lab. That is intentional: the goal is not
to present a toy demo, but to show the full control loop from northbound intent
to layered outputs and live network validation.

The deployment shape is also intentionally narrow. StratoWeave is focused on a
single-binary experience with no external runtime dependencies, so operators can
move from source to lab without assembling a large supporting stack first.

# Near-term direction

The next stretch of work is about deepening the parts that make the platform
useful in practice:

- strengthen the YANG-backed layering between service, resource, and device models
- expand adapters and validation across major network operating systems
- improve closed-loop behavior driven by streaming telemetry
- make transform iteration, testing, and debugging easier for developers
- keep SORESPO current as the primary sample implementation and learning surface

# Longer-term direction

Longer term, the aim is to grow the reusable model and transform library
without turning the platform into a monolith. The project should stay open,
focused, and practical for operators building real orchestration systems.

That means preserving the same core principles as the platform evolves:

- declarative intent instead of imperative workflow sprawl
- explicit layers instead of giant mixed-purpose automation code
- validation against live state instead of assuming rendered config is enough
- a small operational footprint instead of a dependency-heavy control plane

