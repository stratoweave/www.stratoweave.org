+++
title = "Developing SORESPO"
weight = 20
description = "Finally: install Acton, change the SORESPO automation code, and apply your build in the lab."
aliases = [
    "/tutorials/develop-on-linux/",
    "/tutorials/develop-on-macos/",
    "/tutorials/develop-on-windows/",
    "/tutorials/develop-on-codespaces/",
]

[extra]
track = "develop"
full_width = true
platform_selector = true
+++

## Introduction

This tutorial guides you through making your first changes to the SORESPO
automation code and building the application. It builds on the
[browser Web UI tour](@/tutorials/exploring-the-webui.md) and the tutorial on
[running SORESPO](@/tutorials/running-sorespo.md). Complete
those first if you are not yet familiar with applying intent and inspecting
SORESPO's automation layers.

{% <platform only="codespaces"> %}
GitHub Codespaces is a VM managed by GitHub that runs the Dev Container (part
of this project) and Visual Studio Code that is made available in your browser
or as a Remote environment you connect to from your local VS Code.

To start your codespace you will need a free GitHub account. Your GitHub
account includes a free monthly quota of compute hours. You will need to run a
machine with 4 CPU cores and 16 GB of RAM to be able to start the "Nokia SR
Linux" lab used throughout this tutorial. With the free *core hours* GitHub
provides (120 at the time of writing) you will be able to run the lab 30 hours
per month.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?devcontainer_path=.devcontainer%2Fdocker-in-docker%2Fdevcontainer.json&hide_repo_select=true&repo=872963408&skip_quickstart=true&machine=standardLinux32gb)

Setting up a fresh VM will take a couple of minutes. After is it done you have
access to VS Code running in Dev Container with all the tools and source code
available in your browser.
{% </platform> %}

## Preparing the Environment

{% <platform only="linux"> %}
* Install the following prerequisites:
  * [Docker Engine](https://docs.docker.com/engine/install/)
  * [Git](https://git-scm.com/downloads/linux)
    * [Acton](https://acton.guide/install.html) (*Note:* This is an additional prerequisite compared to [running SORESPO](@/tutorials/running-sorespo.md))
* Install the  `vrf` kernel module, on Ubuntu or Debian this can be done with:
``` shell
sudo apt update
sudo apt install linux-modules-extra-$(uname -r)
```
{% </platform> %}

{% <platform only="macos"> %}
* Install the following prerequisites:
  * [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or
    [Colima](@/tutorials/colima.md) for an open-source alternative)
  * [Git](https://git-scm.com/downloads/mac), *coreutils* , and
    [Acton](https://acton.guide/install.html), all of which
    you can install with [Homebrew](https://brew.sh/):
    * *Note:* Acton is an additional prerequisite compared to [running SORESPO](@/tutorials/running-sorespo.md)
  ```shell
  brew install git coreutils actonlang/acton/acton
  ```
* After the installation has completed, start your container runtime.
    * For *Docker Desktop*, open *Settings* and in the *Resources* section make
        sure you've allocated at least 4 CPU cores and 8GB of RAM to Docker.
    * Or, start your Colima VM with the appropriate resources:
      ```shell
      colima start --cpu 4 --memory 8
      ```
{% </platform> %}

{% <platform only="windows"> %}
* First, install the [Windows Subsytem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install)
  * During the Windows Subsytem for Linux installation keep the default WSL
    version, `WSL2`.
  * Also keep the default Linux distribution, `Ubuntu`.
* Then, install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  * *Note*: Install the Windows Subsytem for Linux first!
* After the installation has completed, start *Docker Desktop*
  * The CPU and memory resources allocation to Docker Desktop are controlled by
  the [WSL configuration](https://learn.microsoft.com/en-us/windows/wsl/wsl-config).
  By default 50% of the overall RAM is allocated to WSL2, you may need to tweak
  this to allocate at least 8GB of RAM to Docker Desktop.
* Open your `Ubuntu` (`WSL2`) shell and run:
```shell
sudo apt update
sudo apt install make
```
* Install [Acton](https://acton.guide/install.html) (*Note:* This is an additional prerequisite compared to [running SORESPO](@/tutorials/running-sorespo.md))
  * Follow the instructions for `Debian / Ubuntu` in your `Ubuntu` (`WSL2`) shell

Perform all further instructions in this tutorial from the `Ubuntu` (`WSL2`) shell.
{% </platform> %}

{% <platform only="codespaces"> %}
GitHub Codespaces needs no local installation. Click the **Open in GitHub
Codespaces** button above to launch a ready-to-use environment with all the
tools and source code, then continue below.
{% </platform> %}

## Starting the SORESPO Network

If you completed [running SORESPO](@/tutorials/running-sorespo.md) and its
Containerlab environment is still active, keep it running and skip ahead to
[modifying the SORESPO application](#modifying-the-sorespo-application). The
same environment is used for tutorials and development.

{% <platform only="linux macos windows"> %}
Clone the project:
```shell
git clone https://github.com/stratoweave/sorespo.git
```

Go into the `sorespo/test/quicklab-srl` directory and start the development
tutorial:
```shell
cd sorespo/test/quicklab-srl
make dev-tutorial
...
... # Containerlab starts the SR Linux lab, this may take a few minutes ...
...
StratoWeave/sorespo running..
...
All config files applied
...
```
{% </platform> %}

{% <platform only="codespaces"> %}
Go into the `/workspaces/sorespo/test/quicklab-srl` directory and start the
development tutorial:
```shell
cd test/quicklab-srl
make dev-tutorial
...
... # Containerlab starts the SR Linux lab, this may take a few minutes ...
...
StratoWeave/sorespo running..
...
All config files applied
...
```
{% </platform> %}

You now have a running lab topology with fully configured containerized
routers. The current state of the lab is identical to the final step in the
[tutorial on running SORESPO](@/tutorials/running-sorespo.md). SORESPO runs
interactively so you can stop, rebuild, and replace it as you make changes.

----

{% <platform only="linux macos windows"> %}
*Notes*:
* The SORESPO process runs interactively in this shell window. When you
  kill it with *Ctrl+C*, SORESPO itself will stop, but the lab and all the
  routers will continue to run.
* **Open a second shell** to continue with the tutorial.
* The lab can be shut down with `make stop`.
{% </platform> %}

{% <platform only="codespaces"> %}
*Notes*:
* The SORESPO process runs interactively in this Terminal window. When you
  kill it with *Ctrl+C*, SORESPO itself will stop, but the lab and all the
  routers will continue to run.
* **Open a second Terminal** to continue with the tutorial.
Click the *+* button in the top right of the VS Code Terminal window to do so.
* The lab can be shut down with `make stop`.
{% </platform> %}

## Modifying the SORESPO application

Changing the application typically involves modifying the RFS transforms to
modify the output configuration and optionally modifying the models.

Retrieve the current configuration on the `ams-core-1` router, by connecting to
the router directly over NETCONF.

{% <platform only="linux macos windows"> %}
In a new shell navigate to the `sorespo/test/quicklab-srl`
directory and get the configuration:
```shell
cd sorespo/test/quicklab-srl
make get-dev-config-ams-core-1 | sed -n '/<interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">/,/<\/interface>/{H; /<\/interface>/{x; /<name>ethernet-1\/3<\/name>/p;};}'
```
{% </platform> %}

{% <platform only="codespaces"> %}
In a new Terminal navigate to the `/workspaces/sorespo/test/quicklab-srl`
directory and get the configuration:
```shell
cd test/quicklab-srl
make get-dev-config-ams-core-1 | sed -n '/<interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">/,/<\/interface>/{H; /<\/interface>/{x; /<name>ethernet-1\/3<\/name>/p;}}'
```
{% </platform> %}

*NOTE*: The `sed` command filters the output down to the interface ethernet-1/3 section.

We see the VRF interface configuration for the `ethernet-1/3` interface on the `ams-core-1` router:
```xml
<interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>ethernet-1/3</name>
    <admin-state>enable</admin-state>
    <vlan-tagging xmlns="urn:nokia.com:srlinux:chassis:interfaces-vlans">true</vlan-tagging>
    <subinterface>
        <index>100</index>
        <description>Customer VPN access SITE-1 [SNA-1-1] in VPN acme-65501</description>
        <admin-state>enable</admin-state>
        <ipv4>
            <admin-state>enable</admin-state>
            <address>
                <ip-prefix>10.201.1.1/30</ip-prefix>
            </address>
        </ipv4>
        <vlan xmlns="urn:nokia.com:srlinux:chassis:interfaces-vlans">
            <encap>
                <single-tagged>
                    <vlan-id>100</vlan-id>
                </single-tagged>
            </encap>
        </vlan>
    </subinterface>
</interface>
```

Notice how SORESPO filled in a handy interface description for the
subinterface, but there is no description on the main `ethernet-1/3`
interface. Modify the SORESPO code to add in a description.

Open `sorespo/src/sorespo/rfs.act` in your favorite editor and find the
following section of the code:

{% raw %}
```python
class VrfInterface(base.VrfInterface):
    def transform(self, i, di):
        ...
        elif "srl_nokia-system" in di.modules:
            print("RFS /rfs{{{di.name}}}/vrf-interface transform running {i.name} for Nokia SRLinux", err=True)
            dev = srl25.root()

            # Create the main interface
            intf = dev.interface.create(main_intf, admin_state="enable", vlan_tagging=True)
```
{% endraw %}

Modify `sorespo/src/sorespo/rfs.act` to set an interface description on
VRF interfaces:
{% raw %}
```diff
class VrfInterface(base.VrfInterface):
    def transform(self, i, di):
        ...
        elif "srl_nokia-system" in di.modules:
            print("RFS /rfs{{{di.name}}}/vrf-interface transform running {i.name} for Nokia SRLinux", err=True)
            dev = srl25.root()

            # Create the main interface
            intf = dev.interface.create(main_intf, admin_state="enable", vlan_tagging=True)
+           intf.description = "VRF Interface for customer connections"
```
{% endraw %}

After you have saved the file to disk, re-build the SORESPO binary
to incorporate the change.


Press *Ctrl+C* in the terminal window where SORESPO is running.
In the same terminal window trigger a build:

{% <platform only="linux codespaces"> %}
```shell
make -C ../../ build
```
{% </platform> %}

{% <platform only="windows"> %}
```shell
make -C ../../ build-linux-x86_64
```
{% </platform> %}

{% <platform only="macos"> %}
* If you are running macOS on Apple Silicon use:
```shell
make -C ../../ build-linux-aarch64
```
* If you are running macOS on Intel use:
```shell
make -C ../../ build-linux-x86_64
```
{% </platform> %}

*NOTE*: With `-C ../../` `make` runs the `build` recipe two
levels up from the current directory, saving us the hassle of moving around in
the directory structure.

After the build has completed copy your updated binary into the lab and
re-run and re-configure SORESPO:

*WARNING*: Make sure the earlier SORESPO process has been stopped with *Ctrl+C*
before starting it again. Otherwise you will end up with competing instances
trying to manage the same lab.

```shell
make copy run-and-configure
```

Wait a few seconds for SORESPO to apply your changes to the routers and
repeat the steps above to validate your change was successful.
```shell
make get-dev-config-ams-core-1 | sed -n '/<interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">/,/<\/interface>/{H; /<\/interface>/{x; /<name>ethernet-1\/3<\/name>/p;}}'
```

The interface description has been applied to each of the VRF interfaces:
```diff
<interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>ethernet-1/3</name>
+   <description>VRF Interface for customer connections</description>
    <admin-state>enable</admin-state>
    <vlan-tagging xmlns="urn:nokia.com:srlinux:chassis:interfaces-vlans">true</vlan-tagging>
    <subinterface>
        <index>100</index>
        <description>Customer VPN access SITE-1 [SNA-1-1] in VPN acme-65501</description>
        <admin-state>enable</admin-state>
        <ipv4>
            <admin-state>enable</admin-state>
            <address>
                <ip-prefix>10.201.1.1/30</ip-prefix>
            </address>
        </ipv4>
        <vlan xmlns="urn:nokia.com:srlinux:chassis:interfaces-vlans">
            <encap>
                <single-tagged>
                    <vlan-id>100</vlan-id>
                </single-tagged>
            </encap>
        </vlan>
    </subinterface>
</interface>
```

### Modifying the SORESPO YANG models

Besides modifying transform code, you may also want to modify the YANG models
themselves to be able to pass different parameters from layer to layer.

Retrieve the current input to the RFS layer, i.e. `layer2`:
```shell
make get-config2 2>/dev/null | sed -n '/<vrf-interface[[:space:]>]/,/<\/vrf-interface>/p'
```

Part of the output will be a configuration instance for the `vrf-interface` on `ams-core-1`:
```xml
...
  <vrf-interface>
    <name>ethernet-1/3.100</name>
    <description>Customer VPN access SITE-1 [SNA-1-1] in VPN acme-65501</description>
    <vrf>acme-65501</vrf>
    <ipv4-address>10.201.1.1</ipv4-address>
    <ipv4-prefix-length>30</ipv4-prefix-length>
  </vrf-interface>
</rfs>
...
```

This RFS instance at present does not have an input for MTU configuration.
Review the YANG model for this layer in `sorespo/spec/yang/rfs/sorespo-rfs.yang`.
```yang
...
list vrf-interface {
    key "name";
    sw:rfs-transform sorespo.rfs.VrfInterface;
    leaf name {
        type string;
    }
    leaf description {
        type string;
    }
    leaf vrf {
        type string;
        description
            "VRF name";
        mandatory true;
    }
    leaf ipv4-address {
        type inet:ipv4-address;
    }
    leaf ipv4-prefix-length {
        type uint8 {
            range "1..31";
        }
        default "30";
    }
}
```

Modify the YANG module to add in the `mtu` leaf:
```diff
...
    leaf ipv4-prefix-length {
        type uint8 {
            range "1..31";
        }
        default "30";
    }
+   leaf mtu {
+       type uint16 {
+           range "1..9000";
+       }
+   }
}
```

Open `sorespo/src/sorespo/inter.act` in your favorite editor and find the
following section of the code:

```python
...
class L3Vpn(base.L3Vpn):
    def transform(self, i):
...
            rfs.vrf_interface.create(ep.interface,
                description="Customer VPN access %s [%s] in VPN %s" % (ep.site, ep.site_network_access, i.name),
                vrf=i.name,
                ipv4_address=ep.provider_ipv4_address,
                ipv4_prefix_length=ep.ipv4_prefix_length)
```

Modify `sorespo/src/sorespo/inter.act` to set an MTU on VRF interfaces:
```diff
                 description="Customer VPN access %s [%s] in VPN %s" % (ep.site, ep.site_network_access, i.name),
                 vrf=i.name,
                 ipv4_address=ep.provider_ipv4_address,
-                ipv4_prefix_length=ep.ipv4_prefix_length)
+                ipv4_prefix_length=ep.ipv4_prefix_length,
+                mtu=1500)
```


After you have saved the files to disk, you can re-build the SORESPO binary
to incorporate the change. Press *Ctrl+C* in the terminal window
where SORESPO is running.

In the same terminal window, request the StratoWeave build system and
Acton YANG parser to re-generate the codebase from the SORESPO YANG modules:
```shell
make -C ../../ gen
```

In the same terminal window trigger a build:

{% <platform only="linux codespaces"> %}
```shell
make -C ../../ build
```
{% </platform> %}

{% <platform only="windows"> %}
```shell
make -C ../../ build-linux-x86_64
```
{% </platform> %}

{% <platform only="macos"> %}
* If you are running macOS on Apple Silicon use:
```shell
make -C ../../ build-linux-aarch64
```
* If you are running macOS on Intel use:
```shell
make -C ../../ build-linux-x86_64
```
{% </platform> %}

After the build has completed copy your updated binary into the lab and
re-run and re-configure SORESPO:

*WARNING*: Make sure the earlier SORESPO process has been stopped with *Ctrl+C*
before starting it again. Otherwise you will end up with competing instances
trying to manage the same lab.

```shell
make copy run-and-configure
```

Wait a few seconds for SORESPO to start and retrieve the configuration for
`layer2`.
```shell
make get-config2 2>/dev/null | sed -n '/<vrf-interface[[:space:]>]/,/<\/vrf-interface>/p'
```

Part of the output will be a configuration instance for the `vrf-interface` on
`ams-core-1`:
```diff
...
  <vrf-interface>
    <name>ethernet-1/3.100</name>
    <description>Customer VPN access SITE-1 [SNA-1-1] in VPN acme-65501</description>
    <vrf>acme-65501</vrf>
    <ipv4-address>10.201.1.1</ipv4-address>
    <ipv4-prefix-length>30</ipv4-prefix-length>
+   <mtu>1500</mtu>
  </vrf-interface>
...
```

*Note*: In reality, You wouldn't likely hard-code the MTU in the Intermediate
Transform. We would expect the MTU to be passed down from higher layers, e.g.
from the CFS intent all the way down to the device configuration. But the
development process from here on out is always the same.

## What's Next

You have completed the path from exploring SORESPO in a browser to changing
its automation code. Continue experimenting with the other SORESPO labs and
apply the same workflow to more network operating systems and scenarios.

{{<tutorial_cta href="https://github.com/stratoweave/sorespo/blob/main/test/README.md" label="Explore More SORESPO Labs" note="Choose from additional Containerlab environments, router vendors, and test scenarios in the SORESPO repository."/>}}
