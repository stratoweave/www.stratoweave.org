+++
title = "Running SORESPO on macOS with Colima"
weight = 90
description = "Use Colima as a lighter-weight container runtime on macOS before starting the SORESPO lab."

[extra]
track = "resource"
platform = "macOS"
upstream = "https://github.com/stratoweave/sorespo/blob/main/docs/colima.md"
+++

This note is adapted from the upstream SORESPO documentation. Use it if you want
an open-source alternative to Docker Desktop on macOS before starting the main
SORESPO tutorials.

## Install Colima

Install Colima and Docker with Homebrew, then start a VM sized for the Nokia SR
Linux quicklab:

```shell
brew install colima docker
colima start --cpu 4 --memory 8
colima status
```

## Add Kernel Modules for cRPD Labs

If you want to run the Juniper cRPD-based labs, install the extra modules inside
the Colima VM:

```shell
colima ssh
sudo apt update
sudo apt install linux-modules-extra-$(uname -r)
exit
```

If you recreate the VM or boot into a new kernel, repeat that step.

## Next

1. Continue to [Running SORESPO on macOS](@/learn/run-on-macos.md).
2. If you are ready to modify the transforms, jump to [Developing SORESPO on macOS](@/learn/develop-on-macos.md).
3. For the full upstream note, see the [original Colima guide](https://github.com/stratoweave/sorespo/blob/main/docs/colima.md).