# Homepage Hero Guide

## Controlling Files

- `templates/index.html` contains the hero markup and both custom animation systems.
- `sass/juice.scss` controls hero layout, label placement, overlays, colors, and responsive behavior.
- `static/hero-transform-flow.json` contains the base Lottie drawing for the hero illustration.

## Hero Composition

The homepage hero visual is a hybrid illustration rather than a single animation file.

- The Lottie JSON provides the persistent diagram geometry and router icons.
- HTML overlays provide the readable labels, pills, protocol chips, service and network word clouds, device adapter labels, and router labels.
- A custom SVG telemetry overlay adds continuous state and telemetry motion.
- A custom DOM sparkle system represents intent and configuration movement through the layered system.

## What The Hero Represents

The hero is a layered network orchestration system.

- Top source systems: `OSS/BSS` and `Customer/CRM`
- Northbound interfaces: `NETCONF`, `RESTCONF`, and `TMF640/641`
- Service abstraction layer: `Service Layer`
- Network abstraction layer: `Network Layer`
- Service examples inside the service layer: `L3VPN`, `L2VPN`, `Internet access`, `DCI`
- Network examples inside the network layer: `PE Router`, `Access Switch`, `CPE Router`, `ROADM`
- Device adapters:
  - `IOS-XR / NETCONF / Adapter`
  - `JunOS / NETCONF / Adapter`
  - `IOS-XE / CLI / Adapter`
- Routers at the bottom:
  - `KRK Router`
  - `FRA Router`
  - `STO Router`

The overall orchestration box encloses the protocol row through the device and router sections. The top source pills sit outside that box and feed into it.

## Lottie Drawing Elements

The current Lottie file includes these important named groups and layers:

- `Router Icons`: three router symbols at the bottom of the diagram. The icon center uses crossed arrows rotated to form an X-like routing symbol.
- `Service Layer`: the first large box inside the orchestrator.
- `Network Layer`: the second large box below the service layer.
- `Device Layers`: the three device boxes below the network layer.

The following legacy Lottie animation layers exist but are intentionally disabled and should stay disabled unless a task explicitly asks to revive them:

- `Flow Lines`
- `Packet Left`
- `Packet Center`
- `Packet Right`

Those older packet and line layers are present in the JSON with opacity set to zero. The active motion now comes from the custom telemetry and sparkle overlays, not from those legacy Lottie layers.

## Active Animation Semantics

There are two distinct motion systems in the hero, and they represent different meanings.

- Red telemetry overlay:
  - Implemented by `createHeroTelemetry` in `templates/index.html`
  - Uses SVG paths inside `#hero-telemetry`
  - Represents live state and streaming telemetry flowing upward
  - Flows from routers up through adapters toward the network layer
  - Also flows from the northbound protocol row upward toward `OSS/BSS` and `Customer/CRM`
  - This is continuous, lower-intensity background motion

- Cyan sparkle and configuration flow:
  - Implemented by `createHeroSparkles` in `templates/index.html`
  - Uses animated DOM particles inside `#hero-sparkles`
  - Represents intent and configuration moving downward through the layered system
  - Starts from source systems, enters through protocol interfaces, passes through service and network layers, then branches toward device adapters and routers
  - This is the more pronounced transactional motion layer

In short:

- Telemetry is upward state feedback.
- Sparkles are downward intent and configuration flow.

## Layout And Synchronization Rules

When editing the hero, keep these three surfaces synchronized:

- CSS positions in `sass/juice.scss`
- Animation coordinates in `templates/index.html`
- Lottie group positions in `static/hero-transform-flow.json`

If a task moves the service, network, device, or router rows, update all three of these together:

- Overlay positions such as `.hero-lottie__layer--service`, `.hero-lottie__layer--network`, device pill positions, router labels, and service and network cloud positions in `sass/juice.scss`
- Geometry metrics in `createHeroSparkles` in `templates/index.html`
- Telemetry SVG path coordinates in `templates/index.html`
- Group positions in the Lottie JSON for `Service Layer`, `Network Layer`, `Device Layers`, and any related router geometry

Do not change only one surface and assume the others will follow automatically.

## Reduced Motion Behavior

- Reduced motion support is active in `templates/index.html`.
- In reduced motion mode, the custom telemetry and sparkle systems stop, and the Lottie animation is frozen on a static frame.
- Preserve that behavior when editing the hero animation code.

## Editing Guidance For The Hero

- Preserve the semantic distinction between intent and configuration flow and telemetry and state flow.
- Avoid reintroducing heavy line clutter that makes the layered diagram hard to read.
- Prefer curved or offset telemetry lanes when adding more flows so they do not visually compete with the main config path.
- Keep the source systems visually outside the orchestrator, and keep the layered abstraction model visually inside it.
- Maintain a clear top-to-bottom reading order: sources, protocols, service, network, device adapters, routers.
- If router, service, network, or device geometry is moved, verify that labels, telemetry, sparkles, and Lottie boxes still align.
- Treat the current hero as a deliberate product diagram, not a decorative animation.
