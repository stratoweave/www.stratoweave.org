+++
title = "Developing SORESPO on macOS"
weight = 60
description = "Use Docker Desktop or Colima on macOS to modify SORESPO, rebuild it, and validate the resulting configuration change."

[extra]
track = "develop"
platform = "macOS"
upstream = "https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/develop-on-macos.md"
+++

This macOS path follows the same StratoWeave learning loop as Linux: start the
lab, change a transform, rebuild the binary, and verify the new state on a real
router model.

## Before You Start

- Complete [Running SORESPO on macOS](@/learn/run-on-macos.md) first.
- Install Git and coreutils with Homebrew:

```shell
brew install git coreutils
```

- Install [Acton](https://acton.guide/install_tip.html).
- Use Docker Desktop or [Colima](@/learn/colima.md) with at least 4 CPU cores and 8 GB of RAM.

## Start the Development Lab

```shell
git clone https://github.com/stratoweave/sorespo.git
cd sorespo/test/quicklab-srl
make dev-tutorial
```

## Change an RFS Transform

Inspect the current interface configuration:

```shell
cd sorespo/test/quicklab-srl
make get-dev-config-ams-core-1 | sed -n '/<interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">/,/<\/interface>/p'
```

Then edit `sorespo/src/sorespo/rfs.act` and add the interface description inside
the Nokia SR Linux branch of `VrfInterface.transform()`:

```python
intf = dev.interface.create(main_intf)
intf.admin_state = "enable"
intf.vlan_tagging = True
intf.description = "VRF Interface for customer connections"
```

## Rebuild and Reconfigure the Lab

```shell
make -C ../../ build
make copy run-and-configure
```

Re-run the device configuration query and confirm the description is now present.

## Push Further

If you want to move beyond transform edits, add a new leaf to
`sorespo/spec/yang/rfs/sorespo-rfs.yang` and carry it forward through the
layers. That is where the YANG-based abstraction model starts to pay off.

## Next

1. Review the [upstream macOS development guide](https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/develop-on-macos.md) for the full walkthrough.
2. See [Running SORESPO on macOS with Colima](@/learn/colima.md) if you want the lighter runtime path.
3. Explore additional labs in the [SORESPO lab documentation](https://github.com/stratoweave/sorespo/blob/main/test/README.md#quicklabs).