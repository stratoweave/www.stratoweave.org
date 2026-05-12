+++
title = "Developing SORESPO on Windows"
weight = 70
description = "Use WSL2 to modify SORESPO, rebuild the binary, and validate the change from a Windows workstation."

[extra]
track = "develop"
platform = "Windows"
upstream = "https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/develop-on-windows.md"
+++

This path keeps the Windows-specific setup, but all of the development work runs
 inside the Ubuntu WSL environment.

## Before You Start

- Complete [Running SORESPO on Windows](@/learn/run-on-windows.md) first.
- Use Ubuntu on WSL2 and keep Docker Desktop configured through WSL.
- Install `make` in the Ubuntu shell:

```shell
sudo apt update
sudo apt install make
```

- Install [Acton](https://acton.guide/install_tip.html) using the Debian/Ubuntu
  instructions inside the Ubuntu shell.

## Start the Development Lab

```shell
git clone https://github.com/stratoweave/sorespo.git
cd sorespo/test/quicklab-srl
make dev-tutorial
```

## Change the Transform Logic

Query the current interface configuration:

```shell
cd sorespo/test/quicklab-srl
make get-dev-config-ams-core-1 | sed -n '/<interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">/,/<\/interface>/p'
```

Then edit `sorespo/src/sorespo/rfs.act` so the Nokia SR Linux branch of
`VrfInterface.transform()` adds a description to the main interface:

```python
intf = dev.interface.create(main_intf)
intf.admin_state = "enable"
intf.vlan_tagging = True
intf.description = "VRF Interface for customer connections"
```

## Rebuild and Re-run SORESPO

```shell
make -C ../../ build
make copy run-and-configure
```

Query the device configuration again and confirm the new description is present.

## Keep Going

Once you are comfortable changing transforms, extend the YANG-backed layers by
adding new fields to the RFS model and propagating them down to the device layer.

## Next

1. Review the [upstream Windows development guide](https://github.com/stratoweave/sorespo/blob/main/docs/tutorials/develop-on-windows.md) for the complete version.
2. Browse additional lab variants in the [SORESPO lab documentation](https://github.com/stratoweave/sorespo/blob/main/test/README.md#quicklabs).