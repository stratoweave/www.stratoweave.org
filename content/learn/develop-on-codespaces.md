+++
title = "Developing SORESPO on GitHub Codespaces"
weight = 80
description = "Modify SORESPO and rebuild it entirely inside GitHub Codespaces, without setting up a local dev machine."

[extra]
track = "develop"
platform = "GitHub Codespaces"
upstream = "https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/develop-on-codespaces.md"
+++

This is the lightest path into StratoWeave development. The Codespace already
contains the source tree and tooling, so you can move directly from a running lab
to a code change.

## Before You Start

- Complete [Running SORESPO on GitHub Codespaces](@/learn/run-on-codespaces.md) first.
- Use the SORESPO Codespace size recommended for the run path: 4 CPU cores and
  16 GB of RAM.
- Open a second terminal inside Codespaces before you start the validation steps.

## Start the Development Lab

```shell
cd test/quicklab-srl
make dev-tutorial
```

This starts the lab and applies the baseline configuration so you can focus on
the code changes.

## Make the First Change

Inspect the current interface configuration:

```shell
cd test/quicklab-srl
make get-dev-config-ams-core-1 | sed -n '/<interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">/,/<\/interface>/p'
```

Then update `sorespo/src/sorespo/rfs.act` so the Nokia SR Linux branch of
`VrfInterface.transform()` sets the main interface description:

```python
intf = dev.interface.create(main_intf)
intf.admin_state = "enable"
intf.vlan_tagging = True
intf.description = "VRF Interface for customer connections"
```

## Rebuild and Re-apply

```shell
make -C ../../ build
make copy run-and-configure
```

Once the new binary is running, repeat the device query and verify that the
description has been applied.

## Next

1. Review the [upstream Codespaces development guide](https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/develop-on-codespaces.md) for the complete walkthrough.
2. Explore additional lab topologies in the [SORESPO lab documentation](https://github.com/stratoweave/sorespo/blob/main/test/README.md#quicklabs).