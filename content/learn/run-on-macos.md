+++
title = "Running SORESPO on macOS"
weight = 20
description = "Run the SORESPO quicklab on macOS with Docker Desktop or Colima and load your first intent configuration."

[extra]
track = "run"
platform = "macOS"
upstream = "https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/run-on-macos.md"
+++

This version of the SORESPO tutorial is adapted for the StratoWeave Learn
section. It focuses on the steps you need to get a working lab and understand
what StratoWeave is doing.

## Before You Start

- Use a macOS system with Apple Silicon or an Intel Mac with enough Docker
  resources available.
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or
  use [Colima](@/learn/colima.md) as an open-source alternative.
- Install Git and coreutils with Homebrew:

```shell
brew install git coreutils
```

- Allocate at least 4 CPU cores and 8 GB of RAM to your container runtime.

## Start the SORESPO Lab

```shell
git clone https://github.com/stratoweave/sorespo.git
cd sorespo/test/quicklab-srl
make tutorial
```

SORESPO runs in the foreground. Keep that shell open and use a second shell to
load intent.

## Load Declarative Intent

```shell
cd sorespo/test/quicklab-srl
make send-config-wait FILE="tutorial-netinfra.xml"
make send-config-wait FILE="tutorial-l3vpn-svc.xml"
```

This loads the network infrastructure model and the customer L3VPN service
model into the system.

## Verify the Network

Use the router CLI to verify that the core is up and routing is established:

```shell
make cli-ams-core-1
/ show network-instance default protocols bgp neighbor
ping network-instance default 10.0.0.2
```

If you want to inspect the abstract input model directly, run:

```shell
make get-config0
```

## What This Teaches

- The same intent model can drive a realistic lab from macOS.
- StratoWeave keeps the northbound view separate from the lower-level device
  realization.
- The running lab gives you real state to compare against the declarative model.

## Next

1. Continue to [Developing SORESPO on macOS](@/learn/develop-on-macos.md).
2. If you want a lighter runtime, review [Running SORESPO on macOS with Colima](@/learn/colima.md).
3. For full upstream detail, see the [original macOS run guide](https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/run-on-macos.md).