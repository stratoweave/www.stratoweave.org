+++
title = "Running SORESPO"
weight = 15
description = "Next: launch a live Nokia SR Linux lab, then follow the Web UI path or use the equivalent terminal commands."
aliases = [
    "/tutorials/run-on-linux/",
    "/tutorials/run-on-macos/",
    "/tutorials/run-on-windows/",
    "/tutorials/run-on-codespaces/",
]

[extra]
track = "run"
full_width = true
platform_selector = true
tutorial_mode_selector = true
+++

## Introduction

SORESPO is a network automation system built on StratoWeave. It configures an
IP network and L3VPN services and manages their full lifecycle, including the
core network infrastructure.

If you have not used SORESPO before, start with the zero-install
[Web UI tour](@/tutorials/exploring-the-webui.md). This tutorial takes the next
step: one command starts the Containerlab environment, including the Nokia SR
Linux network and Web UI, then runs SORESPO in the `sweave` container. From
there, choose the default Web UI path or follow the same tutorial entirely
through Make targets in a terminal. Both paths use the same environment and
produce the same result.

{% <platform only="linux"> %}
You will need a Linux host with 4 CPU cores and 8 GB of RAM available to be
able to start the "Nokia SR Linux" lab used throughout this tutorial.
CPU virtualization (KVM extensions) is **NOT** required. The tutorial was
written and validated for Ubuntu / Debian but should work on any modern Linux
distribution.
{% </platform> %}

{% <platform only="macos"> %}
With the advent of router vendors shipping ARM64 images of their containerized
routers, running labs and development environments on macOS with Apple Silicon
has become really attractive. It should also work on macOS on Intel but you'll
likely need more CPU cores and memory allocated to Docker than described here.
{% </platform> %}

{% <platform only="windows"> %}
Thanks to the introduction of the `Windows Subsytem for Linux` and container
technology, software development and running router labs on Windows
has become really easy to do.
{% </platform> %}

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
access to VS Code running in a Dev Container with all the tools and source code
available in your browser.
{% </platform> %}

## Preparing the Environment

{% <platform only="linux"> %}
* Install the following prerequisites:
  * [Docker Engine](https://docs.docker.com/engine/install/)
  * [Git](https://git-scm.com/downloads/linux)
{% </platform> %}

{% <platform only="macos"> %}
* Install the following prerequisites:
  * [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or
    [Colima](@/tutorials/colima.md) if you prefer an open-source alternative)
  * [Git](https://git-scm.com/downloads/mac) and *coreutils* , both of which
    you can install with [Homebrew](https://brew.sh/):
  ```shell
  brew install git coreutils
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

Perform all further instructions in this tutorial from the `Ubuntu` (`WSL2`) shell.
{% </platform> %}

{% <platform only="codespaces"> %}
GitHub Codespaces needs no local installation. Click the **Open in GitHub
Codespaces** button above to launch a ready-to-use environment with all the
tools and source code, then continue below.
{% </platform> %}

## Starting the Tutorial Environment

{% <platform only="linux macos windows"> %}
Clone the project:
```shell
git clone https://github.com/stratoweave/sorespo.git
```

Go into the `sorespo/test/quicklab-srl` directory and start the tutorial:
```shell
cd sorespo/test/quicklab-srl
make tutorial
...
... # Containerlab starts the SR Linux lab, this may take a few minutes ...
...
SORESPO Web UI: http://localhost:3000
...
SWeave: stratoweave.app.StartupBootstrap[-201]: StratoWeave running..
```

SORESPO runs in the foreground and writes its log output to this shell. Open a
second shell to continue with the tutorial.
{% </platform> %}

{% <platform only="codespaces"> %}
Go into the `/workspaces/sorespo/test/quicklab-srl` directory and start the tutorial:
```shell
cd test/quicklab-srl
make tutorial
...
... # Containerlab starts the SR Linux lab, this may take a few minutes ...
...
SORESPO Web UI: http://localhost:3000
...
SWeave: stratoweave.app.StartupBootstrap[-201]: StratoWeave running..
```

SORESPO runs in the foreground and writes its log output to this Terminal.
Open a second Terminal to continue with the tutorial. Select the *+* button in
the top right of the VS Code Terminal window to do so.
{% </platform> %}

The first image download can take several minutes. Later starts reuse the
downloaded router and Web UI images. If port `3000` is already occupied, stop
the other process or choose another port with `WEBUI_PORT=3100 make tutorial`.

When you finish, stop SORESPO with *Ctrl+C*, then shut down the complete
Containerlab environment from this directory with `make stop`.

At this point, your containerized routers are running with only management
access configured, allowing SORESPO to connect and push configuration. The
SORESPO system is also running but has no network or service intent
configuration loaded.

The tutorial mode selector changes the instructions shown below, not the
environment. Both modes use the same SORESPO process, so you can switch
between them at any point.

## Loading the Initial Intent

The environment starts empty. First load the core routers and backbone links
from `tutorial-netinfra.xml`, then load the L3VPN and its customer sites from
`tutorial-l3vpn-svc.xml`.

{% <tutorial_mode only="webui" platform="linux macos windows"> %}
Open [http://localhost:3000](http://localhost:3000) in your browser.
{% </tutorial_mode> %}

{% <tutorial_mode only="webui" platform="codespaces"> %}
Open the **Ports** panel, find port `3000`, and select its forwarded address.
Keep the port visibility private.
{% </tutorial_mode> %}

{% <tutorial_mode only="webui"> %}

The Dashboard initially has no topology because the orchestrator is empty.
Use **Apply Config** in the navigation to bootstrap it:

1. Open `tutorial-netinfra.xml` from the `test/quicklab-srl` directory in your
   editor and copy its full contents.
2. In **Apply CFS Config**, select **XML**, paste the payload into the editor,
   and select **Apply**. Confirm the operation when prompted.
3. Wait for the accepted status, then return to the Dashboard. The core
   routers and backbone links now appear as SORESPO renders and applies their
   device configuration.
4. Repeat the process with `tutorial-l3vpn-svc.xml`. This adds the customer
   L3VPN service and its three sites.

On a local desktop you can drag either XML file directly onto the Apply CFS
Config editor instead of copying it. The filename lets the UI select XML
automatically.
{% </tutorial_mode> %}

{% <tutorial_mode only="terminal"> %}

In the second shell or Terminal, stay in the `test/quicklab-srl` directory.
This mode is useful when the Web UI is not reachable, such as in a remote
environment without port forwarding. The Web UI remains part of the
Containerlab environment; the terminal workflow simply does not use it.

Apply the same two files with the synchronous RESTCONF Make target:

```shell
make send-config-wait FILE="tutorial-netinfra.xml"
make send-config-wait FILE="tutorial-l3vpn-svc.xml"
```

Each command returns after SORESPO has processed the intent and applied the
resulting device configuration.
{% </tutorial_mode> %}

## Inspecting the Live System

{% <tutorial_mode only="webui"> %}

The Web UI is now connected to real SORESPO state rather than the simulated
data from the first tutorial:

* Open **Devices** and select a core router to compare its target and running
  configuration and inspect its configuration log.
* Open **Config Queue** to see whether any rendered changes are still waiting
  for a device. Changes move into each device's log after they are applied.
* Open **Layers** and move from CFS through Intermediate and RFS to Device.
  These are the live outputs of the declarative transforms described below.
* Open **Services** to inspect or edit the routers, backbone links, VPN, and
  customer sites through guided forms rather than raw payloads.
{% </tutorial_mode> %}

{% <tutorial_mode only="terminal"> %}

Retrieve the complete customer-facing state as JSON:

```shell
make get-config-restconf-json
```

Inspect the intended, running, and pending configuration for one router:

```shell
make get-target-ams-core-1
make get-running-ams-core-1
make get-diff-ams-core-1
```

The corresponding layer-specific commands are introduced in the next section.
{% </tutorial_mode> %}

The resulting network lab has three core SR Linux routers, each with an attached
customer edge device running FRRouting. This diagram shows the topology:

```
+-------------------+                                                                     +-------------------+   
|    cust-1-frr     |                                                                     |    cust-3-frr     |   
|    10.200.1.1     |                                                                     |    10.200.1.3     |   
|    (FRRouting)    |                                                                     |    (FRRouting)    |   
+----+--------------+                                                                     +--+----------------+   
     |eth1                                                                                   |eth1       
     |                                                                                       |                    
     +-------------------+                                                                   |                    
                         |                                                                   |                    
                         |ethernet1/3.100                                                    |                    
                      +--+----------------+                          +-------------------+   |                    
                      |    ams-core-1     |ethernet1/2               |    sto-core-1     |   |                    
                      |     10.0.0.1      +--------------------------+     10.0.0.3      +---+                    
                      |  (Nokia SR Linux) |               ethernet1/1|  (Nokia SR Linux) |ethernet1/4.100                
                      +--+----------------+                          +--+--------------+-+                        
                         |ethernet1/1                                   |ethernet1/2        
                         |                                              |
                         |                                              |
                         |                                              |
                         |                            +-----------------+  
                         |                            |
                         |                            |      
                         |                            |      
                         |                            |          
                         |ethernet1/1                 |            
                      +--+----------------+ethernet1/2|           
                      |    fra-core-1     +-----------+
                      |     10.0.0.2      |
                      |  (Nokia SR Linux) +             
                      +---+---------------+                   
                          |ethernet1/4.100        
                          |
 +-------------------+    |
 |    cust-2-frr     |    | 
 |    10.200.1.2     +----+ 
 |    (FRRouting)    |eth1 
 +-------------------+                                                               
```

## Verifying the Network

{% <tutorial_mode only="webui"> %}

On the Dashboard, confirm that all three core routers and their customer sites
are visible. Open **Devices**, select `AMS-CORE-1`, and check that its running
and target configurations agree and that its configuration log contains the
recent changes.
{% </tutorial_mode> %}

Run the automated customer-connectivity test:

```shell
make test-ping
```

You can also inspect the routing state directly. Log into a core router:

Log in to the `ams-core-1` router:
```
make cli-ams-core-1
```

On the SR Linux CLI issue the following commands:
```
/ show network-instance default protocols bgp neighbor
ping network-instance default 10.0.0.2
```

These commands show that the loopback addresses are reachable and iBGP has been
established between the 3 core routers. Use *Ctrl+C* to stop the `ping` command
and `quit` to log out of the router.

*Note*: The [SR Linux Configuration Basics](https://documentation.nokia.com/srlinux/24-3/title/basics.html)
are a great introduction to the Nokia SR Linux CLI.

## Service Automation Layering In SORESPO

SORESPO implements highly abstracted device and service configuration through
layers of automation. While SORESPO is implemented using four discrete layers,
StratoWeave does not place any limitations on the number of layers that can be
implemented - as few or many as necessary can be used.

```
                        +-------------------------------+
+-----------------------| RESTCONF Northbound Interface |-----------------------+
|                       +-------------------------------+                       |
|               +-----------------------------------------------+               |
|               |    Customer Facing Service (CFS) - Layer 0    |               |
|               +-----------------------------------------------+               |
|               +-----------------------------------------------+               |
|               |            Intermediate - Layer 1             |               |
|               +-----------------------------------------------+               |
|               +-----------------------------------------------+               |
|               |    Resource Facing Service (RFS) - Layer 2    |               |
|               +-----------------------------------------------+               |
|               +-----------------------------------------------+               |
|               |                Device - Layer 3               |               |
|               +-----------------------------------------------+               |
|                       +-------------------------------+                       |
+-----------------------|  NETCONF Southbound Interface |-----------------------+
                        +-------------------------------+
```


The SORESPO system implements a RESTCONF northbound interface, which is
model-driven by StratoWeave based on the top-level CFS YANG model of the SORESPO
system.

{% <tutorial_mode only="webui"> %}
Use the **Layers** page to move through these outputs.
{% </tutorial_mode> %}

{% <tutorial_mode only="terminal"> %}
The `get-config0` through `get-config3` Make targets send the equivalent
RESTCONF requests.
{% </tutorial_mode> %}

The XML excerpts below are shared by both modes.


### Configuration at Layer 0 - Customer Facing Service (CFS)

The Customer Facing Service (top-level) YANG model defines SORESPO's northbound
interface for users and/or BSS/OSS platforms. The YANG modules for `layer0` are
located in `sorespo/spec/yang/cfs`.

{% <tutorial_mode only="webui"> %}

Open **Layers**, select **CFS**, and choose XML as the display format.
{% </tutorial_mode> %}

{% <tutorial_mode only="terminal"> %}

Retrieve the top-level CFS configuration (`layer0`) from SORESPO:

```shell
make get-config0
```

*Note*: XML is used for all of the examples throughout this tutorial, but if
you prefer JSON format, use:
```shell
make get-config-json0
```
{% </tutorial_mode> %}

The resulting output has two top-level containers, `<netinfra>` (the first
 configuration file you loaded), which describes the configuration of the
network devices and topology, and `<l3vpn-svc>` (the second configuration file
you loaded) which is an implementation of `ietf-l3vpn-svc.yang` defined
in [RFC8299](https://datatracker.ietf.org/doc/html/rfc8299). The L3VPN Service
Model is used to define the VPNs, customer attachment points and other
parameters necessary for provisioning customer L3VPN services.

```xml
<netinfra xmlns="http://example.com/netinfra">
...
</netinfra>
<l3vpn-svc xmlns="urn:ietf:params:xml:ns:yang:ietf-l3vpn-svc">
...
</l3vpn-svc>
```


#### Core Network Topology Configuration `<netinfra>`

`<netinfra>` holds the router and backbone link configuration. At `layer0`,
this is highly abstracted with only the essential parameters being exposed.
The other automation layers implement the logic necessary to create the device
level configuration (described by vendor supplied YANG modules).

```xml
<netinfra xmlns="http://example.com/netinfra">
  <router>
    <name>AMS-CORE-1</name>
    <id>1</id>
    <role>edge</role>
    <asn>65001</asn>
  </router>
  ...
  <backbone-link>
    <left-router>AMS-CORE-1</left-router>
    <left-interface>ethernet1-1</left-interface>
    <right-router>FRA-CORE-1</right-router>
    <right-interface>ethernet1-1</right-interface>
  </backbone-link>
  ...
</netinfra>  
```

The `<router>` container defines the router's name and its role in the network
topology (`core` / `edge`).

The `<backbone-link>` container defines the necessary endpoint paramaters to
configure a link between two routers.



#### L3VPN Service Configuration `<ietf-l3vpn-svc>`

The configuration for the L3VPN services itself contains two top-level
containers as well. These are defined in the IETF's L3VPN Service YANG model.
The first, `<vpn-services>`, defines the customer's VPN and the second,
`<sites>`, is a list of connection points which configure the edge router's
links to customer's sites, as follows:

```xml
<l3vpn-svc xmlns="urn:ietf:params:xml:ns:yang:ietf-l3vpn-svc">
  <vpn-services>
    <vpn-service>
      <vpn-id>acme-65501</vpn-id>
      <customer-name>CUSTOMER-1</customer-name>
    </vpn-service>
  </vpn-services>
  <sites>
    <site>
      <site-id>SITE-1</site-id>
      <locations>
        <location>
          <location-id>MAIN</location-id>
        </location>
      </locations>
      <management>
        <type>customer-managed</type>
      </management>
      <site-network-accesses>
        <site-network-access>
          <site-network-access-id>SNA-1-1</site-network-access-id>
          <location-reference>MAIN</location-reference>
          <bearer>
            <bearer-reference>AMS-CORE-1,ethernet1-3.100</bearer-reference>
          </bearer>
          <ip-connection>
            <ipv4>
              <address-allocation-type>static-address</address-allocation-type>
              <addresses>
                <provider-address>10.201.1.1</provider-address>
                <customer-address>10.201.1.2</customer-address>
                <prefix-length>30</prefix-length>
              </addresses>
            </ipv4>
          </ip-connection>
          <service>
            <svc-input-bandwidth>1000000000</svc-input-bandwidth>
            <svc-output-bandwidth>1000000000</svc-output-bandwidth>
            <svc-mtu>9000</svc-mtu>
          </service>
          <routing-protocols>
            <routing-protocol>
              <type>bgp</type>
              <bgp>
                <autonomous-system>65501</autonomous-system>
                <address-family>ipv4</address-family>
              </bgp>
            </routing-protocol>
          </routing-protocols>
          <vpn-attachment>
            <vpn-id>acme-65501</vpn-id>
          </vpn-attachment>
        </site-network-access>
      </site-network-accesses>
    </site>
</l3vpn-svc>
```


### Configuration at Layer 1 - Intermediate 

In SORESPO, the next layer down is the *Intermediate* layer. At this layer,
the implemented YANG modules are less abstracted than at `layer0`. Additional
parameters are calculated by the service automation. The YANG modules for `layer1` are
located in `sorespo/spec/yang/inter`.

{% <tutorial_mode only="webui"> %}

On **Layers**, select **Intermediate** and keep XML as the display format.
{% </tutorial_mode> %}

{% <tutorial_mode only="terminal"> %}

Retrieve the `layer1` configuration:

```shell
make get-config1
```
{% </tutorial_mode> %}

This excerpt from the output shows the intermediate layer configuration for the
`AMS-CORE-1` router. The IPv4 and IPv6 addressing for the loopback interface
for the device are added. These have been calculated according to a pre-defined
set of addressing rules.

Additionally, there is configuration for the customer's `acme-65501` VPN which
has been defined in the layer0 `ietf-l3vpn-svc` configuration.

```xml
<netinfra xmlns="http://example.com/netinfra-inter">
  <router>
    <name>AMS-CORE-1</name>
    <id>1</id>
    <role>edge</role>
    <base-config>
      <asn>65001</asn>
      <ipv4-address>10.0.0.1</ipv4-address>
      <ipv6-address>2001:db8:0:0::1</ipv6-address>
    </base-config>
    <l3vpn-vrf>
      <vpn-id>acme-65501</vpn-id>
      <ebgp-customer-address>10.201.1.2</ebgp-customer-address>
    </l3vpn-vrf>
  </router>
```

At the Intermediate layer, we also introduce a new container for configuring
iBGP between the core routers. As the configuration for this is entirely
deterministic, we don't need to expose it at `layer0`. All of the iBGP
configuration is created through SORESPO's automation, derived from the CFS
intent. The logic is simple, all core routers will form an iBGP full-mesh.

*Note*: it would be trivial to add route-reflectors, suitable for larger networks

The Intermediate layer calculates the IPv4 addresses used for each
of the peering routers and configures authentication.

```xml
<netinfra xmlns="http://example.com/netinfra-inter">
  ...
  <ibgp-fullmesh>
    <asn>65001</asn>
    <authentication-key>ibgp-authentication-key</authentication-key>
    <router>
      <name>AMS-CORE-1</name>
      <ipv4-address>10.0.0.1</ipv4-address>
    </router>
    <router>
      <name>FRA-CORE-1</name>
      <ipv4-address>10.0.0.2</ipv4-address>
    </router>
    <router>
      <name>STO-CORE-1</name>
      <ipv4-address>10.0.0.3</ipv4-address>
    </router>
  </ibgp-fullmesh>
  ...
<netinfra>
```

At the Intermediate layer, the L3VPN service configuration is re-structured as
follows:

```xml
<l3vpns xmlns="http://example.com/l3vpn-inter">
  <l3vpn>
    <name>acme-65501</name>
    <description>Customer VPN for CUSTOMER-1</description>
    <endpoint>
      <device>AMS-CORE-1</device>
      <interface>ethernet1-3.100</interface>
      <site>SITE-1</site>
      <site-network-access>SNA-1-1</site-network-access>
      <provider-ipv4-address>10.201.1.1</provider-ipv4-address>
      <customer-ipv4-address>10.201.1.2</customer-ipv4-address>
      <ipv4-prefix-length>30</ipv4-prefix-length>
      <bgp>
        <as-number>65501</as-number>
      </bgp>
    </endpoint>
    ...
</l3vpn>
```



### Configuration at Layer 2 - Resource Facing Service (RFS)

`layer2` is the Resource Facing Service (RFS) layer. Once again, configuration
at this layer is more explicit and concrete, with more parameters being 
filled-in by the automation. The main role of the RFS layer is to provide a 
stable vendor-agnostic abstraction to the upper layers. This means that new 
device type's YANG models and versions, or other device management protocol
integrations can be added without needing to make any changes to the
Intermediate or CFS layers above. All RFS transforms are written per device,
that is, a single RFS transform only writes to a single device. This enables
RFS transforms to be re-run in order to react to changes on the device.

The YANG modules for `layer2` are located in `sorespo/spec/yang/rfs`.

At this layer, there is an instance of `<device>` container per managed device
and a corresponding `<rfs>` container defining the devices SORESPO is
managing and the RFS services that SORESPO defines.

{% <tutorial_mode only="webui"> %}

On **Layers**, select **RFS** and inspect the per-device services.
{% </tutorial_mode> %}

{% <tutorial_mode only="terminal"> %}

Retrieve the configuration for `layer2`:
```shell
make get-config2
```
{% </tutorial_mode> %}

Which gives the following output:
```xml
<rfs>
  <name>AMS-CORE-1</name>
  <base-config>
    <name>AMS-CORE-1</name>
    <ipv4-address>10.0.0.1</ipv4-address>
    <ipv6-address>2001:db8:0:0::1</ipv6-address>
    <asn>65001</asn>
    <ibgp-authentication-key>ibgp-authentication-key</ibgp-authentication-key>
  </base-config>
  <backbone-interface>
    <name>ethernet1-1</name>
    <ipv4-address>10.0.7.1</ipv4-address>
    <remote>
      <device>FRA-CORE-1</device>
      <interface>ethernet1-1</interface>
    </remote>
  </backbone-interface>
  <backbone-interface>
    <name>ethernet1-2</name>
    <ipv4-address>10.0.20.1</ipv4-address>
    <remote>
      <device>STO-CORE-1</device>
      <interface>ethernet1-1</interface>
    </remote>
  </backbone-interface>
  <ibgp-neighbor>
    <address>10.0.0.2</address>
    <asn>65001</asn>
    <description>FRA-CORE-1</description>
  </ibgp-neighbor>
  <ibgp-neighbor>
    <address>10.0.0.3</address>
    <asn>65001</asn>
    <description>STO-CORE-1</description>
  </ibgp-neighbor>
  <ibgp-neighbor>
    <address>10.0.0.4</address>
    <asn>65001</asn>
    <description>LJU-CORE-1</description>
  </ibgp-neighbor>
  <vrf>
    <name>acme-65501</name>
    <description>Customer VPN for CUSTOMER-1</description>
    <id>65501</id>
    <router-id>1</router-id>
    <asn>65001</asn>
  </vrf>
  <vrf-interface>
    <name>ethernet1-3.100</name>
    <description>Customer VPN access SITE-1 [SNA-1-1] in VPN acme-65501</description>
    <vrf>acme-65501</vrf>
    <ipv4-address>10.201.1.1</ipv4-address>
    <ipv4-prefix-length>30</ipv4-prefix-length>
  </vrf-interface>
  <ebgp-customer>
    <vrf>acme-65501</vrf>
    <address>10.201.1.2</address>
    <peer-asn>65501</peer-asn>
    <description>Customer eBGP SITE-1 [SNA-1-1] in VPN acme-65501 to 10.201.1.2</description>
    <authentication-key>acme-65501</authentication-key>
    <local-asn>65001</local-asn>
  </ebgp-customer>
</rfs>
```


### Configuration at Layer 3 - The Device Layer

The vendor proprietary device YANG models are located on this layer. The YANG
modules are organized in directories by device and software version:

* For Cisco IOS-XR: `sorespo/spec/yang/CiscoIosXr_25_3_1`
* For Jupiper JUNOS: `JuniperCRPD_24_4R1_9`
* For Nokia SR-Linux: `NokiaSRLinux_25_3_2`

{% <tutorial_mode only="webui"> %}

On **Layers**, select **Device**. You can also open **Devices**, choose a core
router, and inspect its fully rendered target configuration.
{% </tutorial_mode> %}

{% <tutorial_mode only="terminal"> %}

Retrieve the configuration for `layer3`:
```
make get-config3
```
{% </tutorial_mode> %}

The output is several hundred lines of XML defining the full configuration of
each of the core router devices. The XML namespaces
( `xmlns="urn:nokia.com:srlinux:`) indicate that these are the vendor models.


## Adding a New Core Router to the Topology

{% <platform only="linux macos windows"> %}
In order to add a new router to the network, including provisioning the
backbone links and iBGP peering, all we need to do is send in the
configuration for that router. The configuration is defined in
`test/quicklab-srl/tutorial-add-lju.xml`:
{% </platform> %}

{% <platform only="codespaces"> %}
In order to add a new router to the network, including provisioning the
backbone links and iBGP peering, all we need to do is send in the
configuration for that router. The configuration is defined in
`/workspaces/sorespo/test/quicklab-srl/tutorial-add-lju.xml`:
{% </platform> %}

```xml
<?xml version="1.0" encoding="utf-8"?>
<data>
    <netinfra xmlns="http://example.com/netinfra">
       <router>
            <name>LJU-CORE-1</name>
            <id>4</id>
            <role>core</role>
            <asn>65001</asn>
       </router>
       <backbone-link>
            <left-router>FRA-CORE-1</left-router>
            <left-interface>ethernet-1/3</left-interface>
            <right-router>LJU-CORE-1</right-router>
            <right-interface>ethernet-1/1</right-interface>
        </backbone-link>
        <backbone-link>
            <left-router>STO-CORE-1</left-router>
            <left-interface>ethernet-1/3</left-interface>
            <right-router>LJU-CORE-1</right-router>
            <right-interface>ethernet-1/2</right-interface>
        </backbone-link>
    </netinfra>
</data>
```

### Applying the Router Intent

{% <tutorial_mode only="webui"> %}

Open **Apply Config**, select XML, and drop `tutorial-add-lju.xml` onto the
editor (or paste its contents). Select **Apply** and confirm the operation.
Return to the Dashboard and watch `LJU-CORE-1` and its two backbone links
appear. Open **Devices** and select `LJU-CORE-1` to inspect its rendered and
running configuration.
{% </tutorial_mode> %}

{% <tutorial_mode only="terminal"> %}

Send the same configuration to SORESPO:

```shell
make send-config-wait FILE="tutorial-add-lju.xml"
```

Confirm that layer 0 now contains four routers:

```shell
make get-config0
```
{% </tutorial_mode> %}

Optionally, log in to the new router:

```shell
make cli-lju-core-1
```

Run the following command to review the BGP neighbor state:
```shell
/ show network-instance default protocols bgp neighbor
```

The resulting output shows that iBGP sessions with the other 3 core routers
have been established:
```
A:root@LJU-CORE-1# / show network-instance default protocols bgp neighbor
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
BGP neighbor summary for network-instance "default"
Flags: S static, D dynamic, L discovered by LLDP, B BFD enabled, - disabled, * slow
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
+--------------------+-----------------------------+--------------------+-------+-----------+----------------+----------------+--------------+-----------------------------+
|      Net-Inst      |            Peer             |       Group        | Flags |  Peer-AS  |     State      |     Uptime     |   AFI/SAFI   |       [Rx/Active/Tx]        |
+====================+=============================+====================+=======+===========+================+================+==============+=============================+
| default            | 10.0.0.1                    | IPV4-IBGP          | S     | 65001     | established    | 0d:0h:0m:46s   | evpn         | [0/0/0]                     |
|                    |                             |                    |       |           |                |                | ipv4-unicast | [0/0/0]                     |
| default            | 10.0.0.2                    | IPV4-IBGP          | S     | 65001     | established    | 0d:0h:0m:47s   | evpn         | [0/0/0]                     |
|                    |                             |                    |       |           |                |                | ipv4-unicast | [0/0/0]                     |
| default            | 10.0.0.3                    | IPV4-IBGP          | S     | 65001     | established    | 0d:0h:0m:47s   | evpn         | [0/0/0]                     |
|                    |                             |                    |       |           |                |                | ipv4-unicast | [0/0/0]                     |
+--------------------+-----------------------------+--------------------+-------+-----------+----------------+----------------+--------------+-----------------------------+
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Summary:
3 configured neighbors, 3 configured sessions are established, 0 disabled peers
0 dynamic peers
```

The new LJU-CORE-1 router has been configured and the necessary
configuration, iBGP neighbors, on all the other routers was automatically
added as per the updated intent (4 routers) as well.

### Connecting a Customer Site

{% <tutorial_mode only="webui"> %}

Use **Apply Config** again with `tutorial-add-cust-4.xml`. Return to the
Dashboard and confirm that the fourth customer site is attached to
`LJU-CORE-1`. The new site is also available under **Services**.
{% </tutorial_mode> %}

{% <tutorial_mode only="terminal"> %}

```shell
make send-config-wait FILE="tutorial-add-cust-4.xml"
```
{% </tutorial_mode> %}

The resulting topology is as follows:

```
+-------------------+                                                                     +-------------------+   
|    cust-1-frr     |                                                                     |    cust-3-frr     |   
|    10.200.1.1     |                                                                     |    10.200.1.3     |   
|    (FRRouting)    |                                                                     |    (FRRouting)    |   
+----+--------------+                                                                     +--+----------------+   
     |eth1                                                                                   |eth1       
     |                                                                                       |                    
     +-------------------+                                                                   |                    
                         |                                                                   |                    
                         |ethernet1/3.100                                                    |                    
                      +--+----------------+                          +-------------------+   |                    
                      |    ams-core-1     |ethernet1/2               |    sto-core-1     |   |                    
                      |     10.0.0.1      +--------------------------+     10.0.0.3      +---+                    
                      |  (Nokia SR Linux) |               ethernet1/1|  (Nokia SR Linux) |ethernet1/4.100                
                      +--+----------------+                          +--+--------------+-+                        
                         |ethernet1/1                                   |ethernet1/2   |ethernet1/3                          
                         |                                              |              |                          
                         |                                              |              |                          
                         |                                              |              |                          
                         |                            +-----------------+              |                          
                         |                            |                                |                          
                         |                            |                                |                          
                         |                            |                                |                          
                         |                            |                                |                          
                         |ethernet1/1                 |                     ethernet1/2|                          
                      +--+----------------+ethernet1/2|              +-----------------+-+                        
                      |    fra-core-1     +-----------+              |    lju-core-1     |                        
                      |     10.0.0.2      |ethernet1/3               |     10.0.0.4      |                        
                      |  (Nokia SR Linux) +--------------------------+  (Nokia SR Linux) |                        
                      +---+---------------+               ethernet1/1+--------+----------+                        
                          |ethernet1/4.100                                    |ethernet1/3.100                           
                          |                                                   |                                   
 +-------------------+    |                                                   |              +-------------------+
 |    cust-2-frr     |    |                                                   |              |    cust-4-frr     |
 |    10.200.1.2     +----+                                                   |          eth1|    10.200.1.4     |
 |    (FRRouting)    |eth1                                                    +--------------+    (FRRouting)    |
 +-------------------+                                                                       +-------------------+
```

### Verifying the Expanded Topology

{% <tutorial_mode only="webui"> %}

Confirm that all four routers and customer sites appear on the Dashboard.
Check **Config Queue** for outstanding changes, then open `LJU-CORE-1` under
**Devices** and confirm that its target and running configurations agree.

The Web UI submits Apply Config requests asynchronously, so you can follow
their progress in **Config Queue** and each device's configuration log.
{% </tutorial_mode> %}

Test connectivity between all customer routers:

```shell
make test-ping
```
*NOTE*: It may take up to a minute for the customer and provider routers to establish a BGP session and exchange routes.

{% <tutorial_mode only="terminal"> %}

The `send-config-wait` target waits for StratoWeave to process the configuration
before returning. To use asynchronous submission from the terminal, run
`make send-config-async FILE="<file>.xml"` and observe that the command returns
as soon as SORESPO accepts the intent.
{% </tutorial_mode> %}

## What's Next

You have run SORESPO against a live network and followed its intent through
every automation layer. The final step is to change those transforms, build
SORESPO yourself, and see your code update the network.

{{<tutorial_cta href="/tutorials/developing-sorespo/" label="Develop SORESPO" note="Install the Acton toolchain, modify an RFS transform and YANG model, then deploy your own build in the same lab."/>}}
