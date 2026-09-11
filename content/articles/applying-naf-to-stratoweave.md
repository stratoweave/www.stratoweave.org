+++
title = "Applying the Network Automation Framework to StratoWeave"
description = "How StratoWeave implements the six NAF building blocks through YANG models, transforms, device adapters and telemetry collection."
date = 2026-09-05
[extra]
author = "kris-lambrechts"
cover = "images/articles/naf/framework-map.svg"
social_image = "images/articles/naf/framework-map.png"
cover_alt = "The six NAF building blocks mapped to StratoWeave components, with collection on the left and execution on the right."
+++

The [Network Automation Framework](https://reference.networkautomation.forum/Framework/Framework/) separates network automation into six building blocks: Intent, Executor, Collector, Observability, Orchestrator, and Presentation. StratoWeave covers all six within an integrated architecture. In this article, we'll explore how StratoWeave implements each building block and how they work together to provide a complete network automation solution.

## StratoWeave and the NAF architecture

The following diagram shows how StratoWeave implements each block, with the web UI and APIs at the top, the various device adapters at the bottom, and the shared platform components that make it all come together in the middle.

{{<article_figure src="images/articles/naf/framework-map.svg" alt="NAF mapping: Presentation maps to the web UI, RESTCONF, NETCONF, TMF APIs and inspection APIs; Observability to operational trees and state transforms; Orchestration to the transaction engine and transforms; Intent to YANG models and the datastore; Collector to subscriptions and read adapters; Executor to device managers and write adapters. Infrastructure sits below the read and write paths." caption="StratoWeave components mapped to the NAF reference architecture." />}}


## Presentation: web UI and APIs

All interactions with a StratoWeave deployment, whether through the [web interface](@/tutorials/exploring-the-webui.md) (web UI) or programmatically via APIs, are designed to be consistent and driven by the underlying YANG models. The YANG datastore can be accessed through [RESTCONF](https://stratoweave.guide/operations/restconf/), [NETCONF](https://stratoweave.guide/operations/run/#netconf-server-ssh-transport), and [TMF APIs](https://stratoweave.guide/developer/system-spec/#defining-tmf-serviceresource-mappings), providing a unified interface for service ordering applications.

An additional [inspection/operator API](https://stratoweave.guide/operations/http-api/) exposes a read-only view of the internal layers, device configurations, and approval queues for troubleshooting and operational insight.

## Intent: YANG models and service abstractions

Each StratoWeave orchestrator is layered. The number of layers in the stack is configurable, and defined in the [system specification](https://stratoweave.guide/developer/system-spec/). The system specification also contains the set of YANG modules that form the schema for each layer. At the very bottom of the layer stack, the **device layer** holds the vendor YANG modules for each of the device types we support. The layers above are **service layers**. They provide increasing levels of abstraction, allowing you to compose an intent for a vendor-neutral view of the network and even the business services it provides. 

Let's review a practical example, our [SORESPO reference project](https://github.com/stratoweave/sorespo/blob/main/README.md) for managing an service-provider L3VPN service/network. At the **Device layer (L3)** we have adapters for Cisco IOS-XR, JunOS and Nokia SR Linux. The **RFS layer (L2)** is a vendor-neutral expression of the building blocks we require to configure each core router, e.g. a base configuration, an eBGP session towards a customer etc.. The **Network layer (L1)** abstracts this to a level where a network operator can reason about the network as a whole. Finally, the **Service layer (L0)** allows a customer or BSS system to order entire services, e.g. a L3VPN connectivity offer. Each of these layers express an **intent** appropriate to its level of abstraction.

{{<article_figure src="images/articles/naf/layered-flow.svg" alt="StratoWeave’s shared platform services sit beside four model layers. Rose arrows carry intent and configuration downward from the northbound interfaces to the network; turquoise arrows carry operational state upward." caption="Rose arrows carry configuration toward the network; turquoise arrows return operational state. Interface labels show the architecture’s protocol families; adapter support depends on the implementation." width={1128} height={720} />}}

You have no need for so much abstraction? Not a problem! A single service layer above your vendor models is a great starting point. And you can always add more layers later, as your service models evolve. The layered architecture allows you to express intent at the right level of abstraction for your use case.

## Executor: device configuration and transactions

StratoWeave's [device manager](https://stratoweave.guide/operations/devices/) implements the **Executor** building block. It receives configuration intent from the transaction engine and applies it to the devices through the southbound adapters. The device manager holds both the target configuration and the running configuration known for each device. This dual view allows it to compute a minimal set of changes required to reach the desired state.

StratoWeave supports several southbound adapters. YANG-model-based adapters such as for NETCONF, RESTCONF, and gNMI are trivial to build and maintain since we can rely on the devices themselves to apply the configuration from an intent. But the adapter framework also supports other interfaces and device-specific implementations such as for CLI, SNMP, or proprietary APIs. It is the adapter's responsibility to provide a declarative & idempotent absstraction of the device, so the service layers above do not have to concern themselves with any issues around ordering of operations, retries, or device-specific quirks.

For devices that support configuration transactions, StratoWeave makes optimal use of them by grouping changes into atomic transactions, ensuring consistency and simplifying error handling. Where support is lacking, StratoWeave can emulate transactions by computing the minimal set of changes and applying them in a controlled manner.

## Collector: operational subscriptions

StratoWeave's [device manager](https://stratoweave.guide/operations/devices/) and southbound adapters also implement the **Collector** building block. Each southbound adapter implements telemetry-based subscriptions, polling-based equivalents, or both, depending on protocol and device support. Today, the NETCONF adapter supports dynamic YANG Push subscriptions over UDP notifications as well as polling. The gNMI adapter supports dynamic subscriptions.

A unique feature of StratoWeave is that the device manager provides one unified subscription interface to the service layers above, regardless of the underlying protocol or device. You specify the operational paths you want to subscribe to, and the device manager handles the details of selecting the appropriate transport, protocol, and handling of any device-specific quirks.


## Orchestrator: transforms, transform actors, and the transaction engine

We've already seen how StratoWeave can hold intent at multiple layers of abstraction, and how it can apply that intent to the devices through the device manager. But how do we actually get from a service intent to a device configuration? That is where [**transforms**](https://stratoweave.guide/developer/transforms/) and [**transform methods**](https://stratoweave.guide/developer/transforms/#the-transform-method) come in.

**A transform method takes YANG-modeled input and transforms it into YANG-modeled output for the layer below.** You, as a service developer, can express exactly how the input should be mapped to the output, including any necessary computations, validations, resource allocation, or conditional logic.

Transform methods by themselves are great for straightforward mappings. But sometimes you require more advanced state management and coordination, including multi-step procedures and complex workflows. That's where [**transform actors**](https://stratoweave.guide/developer/transforms/#the-transform-actor) come in. These actors can maintain procedure state, coordinate multiple steps, and determine the next action from telemetry updates and execution results. This keeps workflow logic alongside the service models it operates on. The **transaction engine** coordinates configuration updates through the layers, while transform actors manage the procedure and its response to changing state.

## Observability: operational state and service health

[Transform actors](https://stratoweave.guide/developer/transforms/) are also the key to StratoWeave's implementation of the **Observability** building block. They can subscribe to device state or the state of other transforms, process the updates, and publish a higher-level operational view. This allows service health to be expressed in the same model hierarchy used to derive configuration. The YANG modeling language has a natural way to express operational state with its `config false` schema nodes.

The entire platform is subscription-based, with operational state propagated through the system via the collector and transform actors. This ensures that service health and operational views are always up-to-date and consistent with the underlying device state. It also allows a StratoWeave orchestrator to scale to large networks with many devices, as the subscription model is efficient and avoids unnecessary polling.

## NAF coverage and future development

In the [NAF definition](https://reference.networkautomation.forum/Framework/Framework/), **MUST** denotes a requirement, **SHOULD** a recommendation, and **MAY** an optional capability. The protocol examples do not prescribe every named technology for every implementation.

<div class="article-table" role="region" aria-label="NAF requirement mapping" tabindex="0">

| Block | Requirement level | Current capabilities and future extensions |
| :--- | :--- | :--- |
| Intent | MUST: modeling, CRUD, API. SHOULD: neutrality, unified view, governance, transactions, validation and versioning. MAY: intent logic. | Completely implemented through the YANG data store, NETCONF/RESTCONF/TMF APIs, abstraction layers, and the transaction engine. |
| Executor | MUST: supported writes. SHOULD: operations, intent inputs, dry-run, transactions, idempotence. MAY: imperative or declarative execution. | Declarative & idempotent configuration management with adapter support for NETCONF/RESTCONF/gNMI/CLI/HTTP APIs and more including transactional support. Dry-run support is planned for future development. |
| Collector | MUST: live reads. SHOULD: normalization. | Operational subscriptions and adapter reads provide collection, with vendor-neutral abstractions handled by transform actors. |
| Observability | MUST: history and access. SHOULD: querying, insights, discrepancy events. MAY: enrichment. | Discreet state processing, enrichment, and discrepancy detection are handled by transform actors. Historical data storage and processing are planned for future development. |
| Orchestrator | MUST: coordination without direct device access. SHOULD: events, compensation, dry-run, scheduling, traceability. MAY: correlation. | Transform actors implement multi-step workflows, event handling, scheduling, tracing, correlation, etc. Dry-run support is planned for future development. |
| Presentation | MUST: authentication and authorization. MAY: varied interfaces, reads and writes. | Read & write supported over NETCONF/RESTCONF/TMF APIs and the web UI. Basic authentication is implemented, fine-grained authorization is planned for future development. |

</div>

## Bringing the NAF building blocks together

StratoWeave implements the six NAF building blocks as one continuous, model-driven system. Intent enters through the web UI or northbound APIs, transforms carry it through progressively more concrete service layers, and ultimately generates the resulting device configuration. The device manager and adapters then apply that configuration and simultaneously collect operational state from the network.

That operational state flows back through the same modeled layers, where transforms can derive service health and drive further orchestration. By connecting presentation, intent, orchestration, execution, collection, and observability through shared YANG models, we give service developers one consistent architecture for expressing desired outcomes and responding to the network's actual state.

A strong model-driven architecture is already in place, enabling StratoWeave to provide consistent, automated, and reliable network management across all layers of the system. Some work remains to be done to fully implement all the NAF requirements, such as fine-grained authorization, dry-run support, and historical data storage. The core development team is actively working on these features.

We encourage you to [try out StratoWeave for yourself](@/tutorials/_index.md)!