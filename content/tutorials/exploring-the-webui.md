+++
title = "Exploring the SORESPO Web UI"
weight = 15
description = "Take a zero-install, in-browser tour of the SORESPO web UI — topology dashboard, devices, config queue, layers, and service editing on sample data."

[extra]
track = "run"
+++

## Introduction

SORESPO ships with a web UI: a frontend to a running SORESPO system that
talks to its RESTCONF northbound interface. It shows the network topology
live, lets you inspect every device and every configuration layer, and lets
you create and edit services through guided forms instead of hand-written
payloads.

You don't need to install anything to try it. The interactive demo below is
the real web UI, statically built with realistic sample data — the same
four-router Nokia SR Linux topology used by the
[running SORESPO](@/tutorials/running-sorespo.md) tutorial — running entirely
in your browser. Nothing you do in it touches a real network, and the
built-in guided tour walks you through every page.

{{ demo_cta() }}

*Note*: the demo starts a short guided tour on your first visit. You can
restart it (or reset the sample data) at any time from the demo bar at the
bottom of the screen.

The sections below describe each area of the UI and link straight to the
matching page in the demo, so you can read and click along.

## The Dashboard

<a href="/demo/webui/#/" target="_blank" rel="noopener">Open the Dashboard</a>
— the landing page draws the network topology straight from the `netinfra`
service model: the four core routers (`AMS`, `FRA`, `STO`, and `LJU`), the
backbone links between them with live traffic counters, and the customer
sites attached to each router. The map refreshes every few seconds; below it,
a device table summarizes queue depth, pending approvals, and config status,
and service cards jump straight into the service editors.

Everything on the map is clickable: routers open their device page, links
open the backbone-link editor, and site cards open the L3VPN site editor.

## Devices

<a href="/demo/webui/#/devices" target="_blank" rel="noopener">Open Devices</a>
— the inventory of routers SORESPO manages. Each device page shows its
metadata, addresses, feature flags, the YANG modules it advertises over
NETCONF, and two further views:

* **Configuration** — the device's *running* and *target* configuration in
  JSON, XML, GData, or AData form. When changes are waiting for approval the
  two differ; that difference is exactly what the config queue holds.
* **Configuration Log** — the history of every config push to the device,
  with its diff, polled live.

Try <a href="/demo/webui/#/devices/AMS-CORE-1" target="_blank" rel="noopener">AMS-CORE-1</a>
in the demo: it is configured to require manual approval and has changes
waiting in its queue.

## The Config Queue

<a href="/demo/webui/#/operations/config-queue" target="_blank" rel="noopener">Open the Config Queue</a>
— when a device requires approval (or is unreachable), rendered configuration
changes wait in a per-device queue instead of being pushed immediately. This
page shows all queues across the network: review each change as an XML,
JSON, AData, or GData diff, then *Approve & Apply* or *Reject* it.

In the demo, approve one of the pending AMS-CORE-1 changes and watch it move
into the device's configuration log.

## Applying Config

<a href="/demo/webui/#/configure" target="_blank" rel="noopener">Open Apply Config</a>
— the UI equivalent of the `make send-config-wait` step from the
[running SORESPO](@/tutorials/running-sorespo.md) tutorial: paste (or drop) a
JSON or XML payload and apply it to the orchestrator's customer-facing
service state through `/restconf/data`. This is how you bootstrap an empty
system or apply bulk changes; in the demo, applying a payload enqueues the
resulting per-device changes.

## Configuration Layers

<a href="/demo/webui/#/layers" target="_blank" rel="noopener">Open Layers</a>
— SORESPO transforms configuration through four declarative layers, the same
ones you inspected with `make get-config0` through `get-config3` in the lab
tutorial: **CFS** (customer-facing intent) → **Intermediate** → **RFS**
(resource-facing services) → **Device** (fully rendered per-device config).
This page renders any layer in XML, JSON, or AData, so you can watch intent
become device configuration step by step.

## Service Modules

<a href="/demo/webui/#/services" target="_blank" rel="noopener">Open Services</a>
— guided editors for the service models: *Netinfra Router*, *Netinfra
Backbone Link*, *L3VPN VPN Service*, and *L3VPN Site*. Each editor offers
local validation, a live RESTCONF payload preview, and a diff against the
saved entry; saving writes straight to RESTCONF and the resulting device
changes appear in the config queue.

For the full experience, recreate the lab tutorial's "add a router" exercise
in the browser: create a new
<a href="/demo/webui/#/services/netinfra-router/new" target="_blank" rel="noopener">Netinfra Router</a>,
save it, and watch it appear on the dashboard topology — then check the
config queue for its rendered base configuration. Existing entries can also
be cloned as a starting point, e.g. a new
<a href="/demo/webui/#/services/l3vpn-site" target="_blank" rel="noopener">L3VPN site</a>
from one of `SITE-1` through `SITE-6`.

## Global Settings

<a href="/demo/webui/#/global-settings" target="_blank" rel="noopener">Open Global Settings</a>
— network-wide settings from `netinfra:netinfra/global-settings`, such as the
iBGP authentication key. Change it in the demo and save: one edit queues a
configuration change for every router at once — a compact illustration of
intent fanning out across the network.

## Taking the Guided Tour

The demo includes a step-by-step tour of everything above: spotlight
popups explain each page, and *Next*/*Back* move you through the UI. It
starts automatically on your first visit; afterwards you can restart it from
the demo bar, or open the demo with the tour forced on:

<a href="/demo/webui/?tour=1#/" target="_blank" rel="noopener">Launch the demo with the guided tour</a>

*Note*: the demo keeps its data in memory. Reloading the page — or the
*Reset data* button in the demo bar — restores the initial sample network.

## What's Next

{{ demo_cta(label="Revisit the interactive demo") }}

The demo is the real web UI running on simulated data — the natural next
step is pointing it at a real system. Follow
[running SORESPO](@/tutorials/running-sorespo.md) to start the containerized
Nokia SR Linux lab, then launch the same UI against it with
`make -C test/quicklab-srl start WEBUI=true`. From there,
[developing SORESPO](@/tutorials/developing-sorespo.md) shows how to change
the automation code itself.
