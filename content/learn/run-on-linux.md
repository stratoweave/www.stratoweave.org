+++
title = "Running SORESPO on Linux"
weight = 10
description = "Start the Nokia SR Linux quicklab, load intent, and inspect a working StratoWeave system from a Linux host."

[extra]
track = "run"
platform = "Linux"
upstream = "https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/run-on-linux.md"
+++

This guide is adapted from the upstream SORESPO tutorial and keeps the core
learning loop on-site: start a lab, load declarative intent, and inspect the
resulting network state.

## Before You Start

- Use a Linux host with at least 4 CPU cores and 8 GB of RAM available.
- Install [Docker Engine](https://docs.docker.com/engine/install/).
- Install [Git](https://git-scm.com/downloads/linux).

## Start the SORESPO Lab

Clone the repository and start the Nokia SR Linux quicklab:

```shell
git clone https://github.com/stratoweave/sorespo.git
cd sorespo/test/quicklab-srl
make tutorial
```

Containerlab will start the lab and SORESPO will run in the foreground. Leave
that shell open and open a second shell for the next steps.

## Load Declarative Intent

In a second shell, load the network infrastructure and service intent:

```shell
cd sorespo/test/quicklab-srl
make send-config-wait FILE="tutorial-netinfra.xml"
make send-config-wait FILE="tutorial-l3vpn-svc.xml"
```

That gives SORESPO enough information to build the core network, the customer
attachment points, and the L3VPN service instance.

## Inspect the Result

Log into a router and verify that the core is up:

```shell
make cli-ams-core-1
/ show network-instance default protocols bgp neighbor
ping network-instance default 10.0.0.2
```

Use `Ctrl+C` to stop the ping, then `quit` to leave the router CLI.

You can also inspect the top-level configuration that StratoWeave accepted at
layer 0:

```shell
make get-config0
```

This is where the platform value starts to show up: intent enters through a
declarative northbound model, then StratoWeave drives the lower layers.

## What This Teaches

- Intent is loaded declaratively through the northbound interface.
- The lab is a concrete example of layered transforms turning high-level models
  into device-facing outputs.
- You can immediately verify the result against live network state.

## Next

1. Continue to [Developing SORESPO on Linux](@/learn/develop-on-linux.md).
2. For the full upstream walkthrough, see the [original Linux run guide](https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/run-on-linux.md).