+++
title = "Running SORESPO on Windows"
weight = 30
description = "Use WSL2 and Docker Desktop to run the SORESPO quicklab from a Windows machine."

[extra]
track = "run"
platform = "Windows"
upstream = "https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/run-on-windows.md"
+++

This guide keeps the essential SORESPO workflow on-site while preserving the
Windows-specific setup from the upstream tutorial.

## Before You Start

- Install [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install)
  and keep the default WSL2 Ubuntu setup.
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) after WSL2 is in place.
- Make sure WSL has enough memory available for Docker Desktop to reach at least 8 GB.
- In the Ubuntu shell, install `make`:

```shell
sudo apt update
sudo apt install make
```

Run the remainder of the tutorial from the Ubuntu WSL shell.

## Start the SORESPO Lab

```shell
git clone https://github.com/stratoweave/sorespo.git
cd sorespo/test/quicklab-srl
make tutorial
```

Keep that shell open while SORESPO runs and open a second Ubuntu shell for the
intent-loading steps.

## Load Declarative Intent

```shell
cd sorespo/test/quicklab-srl
make send-config-wait FILE="tutorial-netinfra.xml"
make send-config-wait FILE="tutorial-l3vpn-svc.xml"
```

This provisions the infrastructure model first, then the L3VPN service model on
top of it.

## Verify That the Lab Is Working

```shell
make cli-ams-core-1
/ show network-instance default protocols bgp neighbor
ping network-instance default 10.0.0.2
```

To inspect the top-level intent model directly, run:

```shell
make get-config0
```

## What This Teaches

- StratoWeave’s declarative northbound model works cleanly from a WSL-based dev environment.
- SORESPO gives you a realistic lab instead of a synthetic hello-world demo.
- The result is visible both in the input model and on the network itself.

## Next

1. Continue to [Developing SORESPO on Windows](@/learn/develop-on-windows.md).
2. For the full upstream walkthrough, see the [original Windows run guide](https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/run-on-windows.md).