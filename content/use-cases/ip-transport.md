+++
title = "IP Transport"
description = "Complete lifecycle management for IP transport networks, from address management and provisioning to fault management."
weight = 1

[extra.screenshot]
src = "images/use-cases/ip-transport.png"
alt = "SORESPO dashboard showing four configured routers connected by five backbone links, all reported up."
caption = "SORESPO brings router configuration and backbone link status into a shared network view."
width = 3380
height = 2156
+++

Whether you operate an MLPS, IP-only, or hybrid network, StratoWeave provides a
foundation for managing your IP transport. Its reference implementation,
the **[Somewhat Realistic Service Provider Orchestrator](https://github.com/stratoweave/sorespo) (SORESPO)**,
demonstrates how to model and configure a backbone network with multiple routers
and links. It also shows how to gather and correlate operational state from
across the network.

## Keep backbone configuration consistent

Define routers and the links between them. Layered transforms derive interface
addressing, routing configuration, and peering from those definitions. In the
reference implementation, router intent drives loopback addresses and iBGP
peering, while backbone links drive the configuration of both endpoints.
Network-wide settings can flow through the same layers to all participating
routers.

## Work across vendor boundaries

Keep the network model separate from device-specific details. SORESPO provides
examples for Cisco IOS XR, Juniper Junos, and Nokia SR Linux. Its transforms
configure IS-IS and iBGP, with MPLS/LDP transport for the Cisco and Juniper
examples and VXLAN with BGP EVPN for Nokia. You can adapt the models and
transforms to the addressing, platforms, and policies your network requires.

## Operational state for the whole network

Each StratoWeave transform can subscribe to operational state from the services
or devices below it. For example, a transform that configures a router's interfaces
can subscribe to the operational state of those interfaces, while a transform that
configures a backbone link can subscribe to the operational state of both endpoints.

Device telemetry is collected by StratoWeave's streaming telemetry framework,
including gNMI, YANG push, and SNMP. As a service developer, all you must express
are the operational data paths you want to subscribe to. The framework handles the
rest, including establishing the subscription, receiving updates, and converting
them into a format that is easy to consume in your transforms.

Provide complete visibility into the operational state of your network, including
complete correlation of individual data points or events into a service-oriented view.