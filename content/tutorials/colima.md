+++
title = "Colima Guidelines"
weight = 90
description = "Use Colima as a lighter-weight container / ContainerLab runtime on macOS."

[extra]
track = "resource"
platform = "macOS"
upstream = "https://github.com/stratoweave/sorespo/blob/main/docs/colima.md"
+++

## Install Colima

Install Colima and Docker with Homebrew, then start a VM that is sufficiently
powerful to run the labs:

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
