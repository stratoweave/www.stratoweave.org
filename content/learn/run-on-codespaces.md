+++
title = "Running SORESPO on GitHub Codespaces"
weight = 40
description = "Start the SORESPO quicklab entirely in GitHub Codespaces and learn StratoWeave from a browser."

[extra]
track = "run"
platform = "GitHub Codespaces"
upstream = "https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/run-on-codespaces.md"
+++

This is the fastest zero-local-setup path into StratoWeave. It uses GitHub
Codespaces to run the SORESPO dev container, the lab tooling, and the source
tree in a browser-based VS Code session.

## Before You Start

- Use a GitHub account with Codespaces enabled.
- Choose a machine with 4 CPU cores and 16 GB of RAM for the Nokia SR Linux lab.
- Expect the initial Codespace setup to take a few minutes.

Open the SORESPO Codespace from the upstream project:

[Open SORESPO in GitHub Codespaces](https://github.com/codespaces/new?devcontainer_path=.devcontainer%2Fdocker-in-docker%2Fdevcontainer.json&hide_repo_select=true&repo=872963408&skip_quickstart=true&machine=standardLinux32gb)

## Start the SORESPO Lab

In the Codespaces terminal:

```shell
cd test/quicklab-srl
make tutorial
```

When the lab is up, open a second terminal in the Codespaces UI.

## Load Declarative Intent

In the second terminal:

```shell
cd test/quicklab-srl
make send-config-wait FILE="tutorial-netinfra.xml"
make send-config-wait FILE="tutorial-l3vpn-svc.xml"
```

These two files seed the infrastructure and service intent that the transform
stack turns into the running lab state.

## Verify the Result

```shell
make cli-ams-core-1
/ show network-instance default protocols bgp neighbor
ping network-instance default 10.0.0.2
```

You can also inspect the accepted top-level model:

```shell
make get-config0
```

## What This Teaches

- You can learn StratoWeave without setting up a local lab host.
- The same model-driven flow applies in Codespaces: intent in, layered outputs out.
- SORESPO shows the platform in a realistic environment from the start.

## Next

1. Continue to [Developing SORESPO on GitHub Codespaces](@/learn/develop-on-codespaces.md).
2. For the upstream walkthrough and exact Codespaces details, see the [original Codespaces run guide](https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/run-on-codespaces.md).