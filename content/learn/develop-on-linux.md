+++
title = "Developing SORESPO on Linux"
weight = 50
description = "Modify a transform, rebuild the binary, and validate the effect on a running SORESPO lab from Linux."

[extra]
track = "develop"
platform = "Linux"
upstream = "https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/develop-on-linux.md"
+++

This guide is adapted from the upstream SORESPO development tutorial. It assumes
you already know how to start the lab and load intent.

## Before You Start

- Complete [Running SORESPO on Linux](@/learn/run-on-linux.md) first, or be ready to start
  the lab directly in development mode.
- Install [Acton](https://acton.guide/install_tip.html) in addition to Docker and Git.
- Install the `vrf` kernel module on Ubuntu or Debian:

```shell
sudo apt update
sudo apt install linux-modules-extra-$(uname -r)
```

## Start the Development Lab

```shell
git clone https://github.com/stratoweave/sorespo.git
cd sorespo/test/quicklab-srl
make dev-tutorial
```

This starts the lab and applies the baseline configuration so you can focus on
the automation code.

## Make Your First Transform Change

Retrieve the current device configuration for a VRF interface:

```shell
cd sorespo/test/quicklab-srl
make get-dev-config-ams-core-1 | sed -n '/<interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">/,/<\/interface>/p'
```

Then open `sorespo/src/sorespo/rfs.act` and update the Nokia SR Linux branch of
`VrfInterface.transform()` to add a description to the main interface:

```python
intf = dev.interface.create(main_intf)
intf.admin_state = "enable"
intf.vlan_tagging = True
intf.description = "VRF Interface for customer connections"
```

## Rebuild and Re-apply

Stop SORESPO with `Ctrl+C`, then rebuild and copy the new binary into the lab:

```shell
make -C ../../ build
make copy run-and-configure
```

After SORESPO has pushed the changes, repeat the configuration query and confirm
that the interface description now appears on the router.

## Extend the Model

The next natural step is to thread a new parameter through the YANG-backed
layers, for example by extending `sorespo/spec/yang/rfs/sorespo-rfs.yang` and
then using the new value inside the transform.

## Next

1. Explore the [SORESPO repository](https://github.com/stratoweave/sorespo) for the full source tree.
2. Review the [upstream Linux development guide](https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/develop-on-linux.md) for the complete walkthrough.
3. For other lab variants, see the [SORESPO lab documentation](https://github.com/stratoweave/sorespo/blob/main/test/README.md#quicklabs).