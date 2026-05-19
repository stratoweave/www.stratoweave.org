+++
title = "Technology"
weight = 3
description = "How StratoWeave's architecture and design principles enable scalable, declarative automation for modern networks."
+++

# Transforms and layering

<figure class="technology-diagram">
	<img src="../TransformLayersSVG.svg" alt="Diagram of layered transforms in StratoWeave">
</figure>

## Declarative automation through transforms

Automation in StratoWeave is carried out by transforms. A transform owns the
relevant service or device configuration for the entire lifecycle, and it is
instantiated from configuration intent. Once instantiated, a transform
continues to exist for as long as the configuration is present.

Transforms are declarative, so the application programmer does not need to
define separate update or delete cases. They are also layered, breaking complex
macro tasks into smaller, manageable sub-tasks, and reactive, acting on input
events from northbound configuration or southbound telemetry. In practice,
declarative configuration management in StratoWeave is realised through
transforms.

## Layered transforms for scalable automation

Service automation in StratoWeave is implemented in layers. As you move up the
layers, services become more abstract, which makes complex behavior simpler to
configure and manage. That same layered structure also improves scalability,
because end-to-end services that require configuration across many devices can
be driven from a single order.

The result is a service definition that stays stable across different devices
and environments, while the platform handles the complexity needed to realize
that service lower down in the automation stack.

## Multi-stage transforms for complex logic

Multi-stage transforms provide a mechanism for implementing complex,
conditional logic across multiple configuration steps. Because that logic lives
inside the transform, the complexity does not need to be exposed at the
northbound interface.

That is essential to how StratoWeave stays declarative and scalable. Users
specify the target state rather than the intermediate steps required to get
there, while state and complexity can be distributed closer to the managed
devices where that behavior scales more naturally. It also makes real
abstraction possible at each automation layer, which in turn makes complex
automation tasks across diverse device types and network domains much easier to
configure and manage.

## Reactive transforms for closed-loop automation
StratoWeave is designed to support closed-loop automation driven by telemetry
and operational state. By making a transform reactive, it can subscribe to
telemetry events and react to changes in the network as they happen. Any
transform, at any layer, can be made reactive, so the platform supports a wide
range of use cases.

Each reactive transform can itself expose operational state for higher-layer
transforms to subscribe to. It becomes natural to abstract and encapsulate
implementation details at each layer, while still making it possible to drive
complex closed-loop behavior across the stack and expose the overall network
state to operators and applications.

# Northbound interfaces
StratoWeave is flexible enough to interface with existing OSS/BSS systems while
also serving as the core orchestration platform for a wider automation
architecture. As a YANG-native orchestration platform, StratoWeave supports
both NETCONF and RESTCONF as its northbound interfaces by default.

## TMF Open APIs

StratoWeave supports TM Forum Open APIs by mapping its native YANG models
into TMF633 Service Catalog entries and allowing Service Ordering and Inventory
through TMF640 and TMF641 interfaces. That allows operators to keep a single
model-driven source of truth inside StratoWeave while still presenting catalog,
ordering, and activation interfaces that fit naturally into TMF-based OSS and
BSS environments.

# Southbound adapters
The StratoWeave Device Manager provides a framework for building southbound
adapters to interface with different device types, cloud services, and network
domains.

To build a NETCONF/YANG adapter, all you need to do is supply a set of YANG
modules for the software version you want to support in the system
specification. During the system generation process, the platform will
automatically generate the necessary adapter code to interface with those
devices from the transforms.

Other adapter types, such as a REST API adapter for a cloud service, or CLI
adapters for network devices that lack NETCONF support, can be built using a
generic adapter framework. No matter the adapter type, the StratoWeave platform
maintains a declarative interface for transform developers to use.

# Brownfield and migrations
Most networks are brownfields with a topology, devices, and services that have
been build up over decades. StratoWeave is designed to support onboarding and
migration in those environments, with a focus on making it easy to get started and
show value quickly.

## Service discovery

In StratoWeave, service discovery means reading an existing brownfield network
and reconstructing the declarative service intent that would produce the same
running state through transforms. Instead of treating the live network as an
opaque starting point, StratoWeave treats the current device and service
configuration as evidence of which lower-layer and higher-layer services are
already present. That makes discovery a practical onboarding path for teams
that want to bring long-lived networks under model-driven automation without
first rebuilding them from scratch.

The process is best approached from the bottom up and in an isolated working
environment. Lower-layer services and device-facing intent are discovered
first, then higher-level services are reconstructed on top of them, with each
iteration checked against the original brownfield state to see what is still
uncovered or modeled incorrectly. If the generated service-driven state differs
from the real network, StratoWeave can extend the models, transforms, or
discovery logic and repeat until coverage is good enough to let the platform
take ownership safely, without forcing risky changes into the production
network during discovery itself.

## Co-existence and migration

StratoWeave is designed to fully manage network devices, from day zero
including zero-touch provisioning, but often, real-world networks need to be
migrated gradually, with a mix of manual and automated processes. StratoWeave
supports that by allowing you to use the platform for a subset of devices or
services while continuing to operate the rest of the network manually, through
stand-alone scripts or other OSS tools.

StratoWeave's brownfield-friendly design means you can attribute each
configuration element to a transform, or to another source (either manual or
another automation system), and then use that attribution to ensure that the
platform only manages the lifecycle of the configuration it is responsible for.

# Quality and developer experience

StratoWeave is designed to be a platform that enables service developers to
build and maintain complex automation systems with confidence by providing a
world-class type system, testing framework, and development environment.

## YANG-native transform definitions
StratoWeave is a YANG-native platform. The interface to each transform is
defined by a YANG model, and all major Network Operating Systems are now
configurable over NETCONF/YANG as well. In the generation phase, the platform
takes the YANG models from the System Specification and generates Acton types
from them. That allows us to leverage the static type system of the
[Acton programming language](https://acton.now) to catch errors at compile
time.

## Testing and validation
StratoWeave includes a testing framework that allows developers to write
complete end-to-end tests for their orchestration logic. By simulating
the entire system, including the devices and the network, developers can
validate their transforms and automation logic as part of their development
workflow, rather than waiting for integration testing or production deployment
to catch issues.

## Developer tools and documentation
StratoWeave and the Acton programming language have a Visual Studio Code
extension that provides syntax highlighting, code completion, and syntax
checking for all Acton code through the Acton Language Server. Since all
YANG models are expressed as Acton types, that means you get code completion
and static error checking for your YANG-modelled transforms as you write them.

## Migrating from CLI to model-driven

Developers and network engineers moving from CLI-driven workflows to YANG
model-driven automation can use [netclics](https://github.com/stratoweave/netclics)
as a practical bridge. As a web-service, netclics provides a straightforward
approach to converting CLI configuration snippets into YANG-compliant `adata`
code, which you can paste straight into your StratoWeave transforms.

# Platform design principles

The platform in itself is purely reactive, acting on input events, either
configuration changes from northbound APIs or subscriptions on streaming
telemetry from devices.

We try to "left shift" run time errors to compile / development time so we can
detect and avoid bugs before committing code, building better and more robust
automation systems. For example by turning YANG models into types, we can
utilize the static type system of the programming language compiler to detect
spelling mistakes or other data errors at compile time.

The ideas behind StratoWeave has its roots in ideas from functional programming
combined with some influence from a decade of experience in operating large IP
networks using automation.