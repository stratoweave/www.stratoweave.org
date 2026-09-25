+++
title = "VPN Services"
description = "Accept customer connectivity requests and coordinate the network configuration behind each VPN. Report on operational state and SLA compliance."
weight = 2

[extra.screenshot]
src = "images/use-cases/vpn-services.png"
alt = "SORESPO topology showing four L3VPN customer sites attached to backbone routers, with a warning on Site 1 and green status on the other sites."
caption = "L3VPN customer sites shown alongside the backbone, connecting service status to its network context."
width = 3380
height = 2156
+++

Business connectivity over L2 or L3 VPNs is a common service for service providers.
Customers expect self-service ordering, fast provisioning, and reliable operation.
StratoWeave helps you model the service your customers want, translate it into
network resources, and keep its configuration aligned as customer requirements
change.

## Support IETF standard service models

The IETF [RFC899 L3VPN](https://www.rfc-editor.org/info/rfc8299/) and
[RFC 8466 L2VPN](https://www.rfc-editor.org/info/rfc8466) service models, provide
a standardized way to express customer connectivity. StratoWeave's multilayer
architecture lets you expose those models in your service catalog to your BSS
or customer portal while handling the complete implementation (OSS) on a single
open-source platform. You can also extend the models to meet your unique sevice
offerings, such as adding a service-level agreement (SLA) to the L3VPN model.

## Keep service changes consistent

Separate customer intent from the details of each device. The same layered
approach maps L3VPN services onto the reference implementation's MPLS-based and
EVPN/VXLAN-based networks. When service intent changes, StratoWeave updates the
configuration owned by its transforms. Removing intent removes that owned
configuration, giving the service one declarative lifecycle across its
participating devices.

## Expose SLA compliance and operational state

Avoid inconsistencies between service provisioning and network monitoring /
observability platforms. In StratoWeave, the operational state of a service
lives right inside the same set of transforms that provision it.

Collect telemetry from the network and correlate it layer by layer.
StratoWeave's transform actors can combine the state of multiple devices and
related services into a single service health view for your customers.
