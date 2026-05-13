# Project Guidelines

## Build And Validate

- Use `zola build` as the default validation command for site changes.
- When editing the homepage hero, validate both build success and the rendered visual result.

## Brand And Style Guide

- StratoWeave's brand concept is an interwoven orchestration fabric: layered paths flowing across domains, technologies, intent, and telemetry.
- Prefer the existing brand mark at `content/stratoweave-mark.svg` when adding or adjusting logo usage.
- Primary typography is Inter. Keep the visual language clean, modern, and technical rather than decorative or playful.
- Use the current brand palette as the default source of truth:
  - `#081020` for deep background surfaces
  - `#2563EB` for primary blue accents
  - `#22D3EE` for cyan accents and flow highlights
  - `#8B5CF6` and `#A855F7` for violet and magenta support accents
  - `#64748B` for muted steel-blue neutrals
  - `#E2E8F0` for light text and high-contrast surfaces
- Favor dark, high-contrast surfaces with luminous blue/cyan/purple accents over light or flat treatments.
- Iconography should stay thin-line, geometric, and infrastructure-oriented. Avoid rounded cartoon icons or generic consumer-app visuals.
- Background textures and illustrations should feel like interwoven paths, network meshes, flowing light, or orchestration fabrics rather than abstract blobs.
- Keywords that fit the brand direction: unified, interwoven, orchestration, flow, layered, scalable, open, intelligent.

## Homepage Hero

- See `docs/homepage-hero.md` for the detailed hero image guide, including the Lottie elements, overlay layers, animation semantics, reduced-motion behavior, and synchronization rules across template, Sass, and JSON geometry.