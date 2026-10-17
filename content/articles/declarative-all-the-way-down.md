+++
title = "Declarative all the way down: How StratoWeave transforms handle change"
description = "Follow an iBGP full mesh from network intent to vendor configuration and see how in StratoWeave service developers don't need separate update or delete procedures."
date = 2026-09-22
draft = false
[extra]
author = "kris-lambrechts"
cover = "images/articles/declarative-transforms/declarative-all-the-way-down.png"
social_image = "images/articles/declarative-transforms/declarative-all-the-way-down.png"
cover_alt = "Three blue nesting dolls reveal successively smaller dolls, each bearing the same braces symbol, beneath the headline Declarative all the way down."
+++

When you write a StratoWeave transform, you describe what should exist. You map the current input into the desired configuration at the next layer. When that input changes, you describe what should exist now. You don't write a second implementation for updates or a third one to undo your work.

That's already quite something at the service layer. It becomes all the more interesting when the same approach continues all the way down to vendor-specific configuration. StratoWeave is a platform for building orchestration systems around these layered, model-driven transforms. At every modeled layer, the service developer works with the same contract: produce the desired output, and let the platform handle the transition.

Think of a set of nesting dolls. Open one layer and you find another, with the same principle inside. Let's follow an iBGP full mesh through those layers, from network intent to individual neighbors and finally to vendor-specific device configuration.

{{<article_figure src="images/articles/declarative-transforms/declarative-all-the-way-down.png" alt="Three blue nesting dolls reveal successively smaller dolls, each marked with braces to represent the same declarative contract at every layer." caption="Different models at each layer. The same declarative contract throughout: describe what should exist." width={1536} height={1024} />}}

## A transform describes its desired contribution

A [transform function](https://stratoweave.guide/developer/transforms/) receives input typed according to a YANG model and returns output typed for the layer below. The output describes that transform's contribution to the desired state. Other transforms can contribute to the same layer too.

The transform function can iterate over input, calculate values, and perform resource allocations (e.g. IP addresses, VLAN IDs). It must return a desired configuration tree. It doesn't send commands to devices or compare its output with the previous version. The transaction engine takes care of that comparison.

In the code snippets, you'll see methods named `.create()`. **Here, `.create()` builds an entry in the output tree; it does not issue a create operation to a device.** A transform starts with a fresh output tree and constructs what it wants to contribute, whether its input is new or has changed for the tenth time.

The following snippets are Acton code from [SORESPO](https://github.com/stratoweave/sorespo), our reference implementation of a Service Provider Orchestration system.

## Each router adds itself to the iBGP full mesh

SORESPO's customer-facing router model contains information such as the router's identity and autonomous system number. Its [router transform](https://github.com/stratoweave/sorespo/blob/main/src/sorespo/cfs.act) derives loopback addresses and contributes the router to an intermediate iBGP full-mesh model.

`o_router` in this transform function represents the output router on the layer below.

```acton
class Router(base.Router):
    def transform(self, i, linked):
        o = base.o_root()
        o_router = o.netinfra.router.create(i.name, id=i.id, type=i.type, role=i.role)

        bc = o_router.base_config
        bc.ipv4_address = "10.0.0.{i.id}"
        bc.ipv6_address = "2001:db8:0:0::{i.id}"
        bc.asn = i.asn

        gs = y_0.root.from_gdata(linked).netinfra.global_settings

        fm = o.netinfra.ibgp_fullmesh.create(i.asn, gs.ibgp_authentication_key)
        fm.router.create(i.name, bc.ipv4_address)

        return o
```

The full mesh is keyed by autonomous system number. Routers in the same AS all add themselves to the mesh. The authentication key comes from  a linked input which containes all the global settings for the network.

At this layer, the developer specifies a router's membership and peering address. The next layer owns the rule that turns those members into individual neighbors. This separation lets the router transform stay focused on what one router contributes to the network model.

## From a full mesh to individual iBGP neighbors

Open the next layer and we find the [intermediate full-mesh transform](https://github.com/stratoweave/sorespo/blob/main/src/sorespo/inter.act). Its domain rule is straightforward: every router peers with every other router.

The transform expresses that rule directly:

```acton
class IbgpFullmesh(base.IbgpFullmesh):
    def transform(self, i):
        o = base.o_root()
        for ra in i.router:
            rfs = o.rfs.create(ra.name)
            rfs.base_config.ibgp_authentication_key = i.authentication_key
            for rb in i.router:
                if ra.name == rb.name:
                    continue
                rfs.ibgp_neighbor.create(
                    rb.ipv4_address,
                    asn=i.asn,
                    description=rb.name,
                    ibgp_authentication_key=i.authentication_key
                )
        return o
```

For each router in the network, `ra`, the transform produces a resource-facing service (RFS) neighbor entry for each other router, `rb`. The iBGP neighbor model is vendor neutral and carries all necessary information down.

There are loops and a conditional here. Declarative development still contains domain logic! Those statements calculate the desired neighbor set. They don't classify the request as a create, update, or delete, or prescribe the sequence of device operations needed to reach it.

For a mesh containing A, B, and C, the output would contain six neighbor entries: A points to B and C, B points to A and C, and C points to A and B.

## Mapping to vendor-specific configuration, still declaratively

Each generated neighbor becomes input to SORESPO's [RFS neighbor transform](https://github.com/stratoweave/sorespo/blob/main/src/sorespo/rfs.act). This transform receives both the neighbor intent, `i`, and device information, `di`. The device's advertised modules determine which configuration model to use.

The Cisco IOS XR branch constructs a neighbor under the appropriate BGP autonomous system:

```acton
if "Cisco-IOS-XR-um-hostname-cfg" in di.modules:
    dev = xr25.root()
    bgp_as = dev.um_router_bgp_cfg_router.bgp.as_.create(i.asn)
    nb = bgp_as.neighbors.neighbor.create(
        i.address, description=i.description
    )
    nb.use.neighbor_group = "IPV4-IBGP"
    return dev
```

The Junos branch constructs the equivalent neighbor under a BGP group:

```acton
elif "http://xml.juniper.net/netconf/junos/1.0" in di.modules or "junos-conf-root" in di.modules:
    dev = crpd24.root()
    bgp = dev.configuration.protocols.bgp
    g = bgp.group.create("IPV4-IBGP")
    g.neighbor.create(i.address, description=i.description)
    return dev
```

The implementation also includes a Nokia SR Linux branch. Other transforms contribute the surrounding base configuration, including the shared BGP group settings.

The configuration structure changes between vendors, but the developer's contract stays familiar. Build a modeled output tree and return it. Even here, at the vendor-specific boundary, there is no separate neighbor-update method or neighbor-delete method to implement.

## Change the intent, reuse the mapping

Now let's change the mesh. The same transform functions handle each case:

<div class="article-table" role="region" aria-label="Intent changes and their desired configuration consequences" tabindex="0">

| Intent change | What the desired output now contains |
| :--- | :--- |
| Add C to a mesh containing A and B | The existing A–B entries, plus neighbor entries between C and each existing member, in both directions. |
| Change C's peering address | Neighbor entries on A and B referencing C's new address; the old address is absent from those contributions. |
| Remove C's membership from the mesh | Only the A–B entries. The mesh no longer contributes neighbors to or from C. |

</div>

Notice what the developer didn't have to supply: a procedure that searches for C's old neighbors and removes them. They simply stop appearing in the output of the full-mesh mapping.

That absence has a precise meaning. The output represents the transform's current desired contribution, so anything it previously contributed but no longer returns must be withdrawn. It doesn't mean that configuration belonging to another source should disappear too.

This is why contribution tracking matters. Several transforms can contribute to a shared object. Removing one source withdraws its contribution while allowing compatible contributions from other sources to remain. The unit of reasoning is what each transform owns, rather than a blanket instruction to delete a shared container.

## How the platform handles updates and deletion

The transaction engine retains a transform's previous output, computes its new output, and passes the difference to the next layer under that transform's source identity. The essential lines in the [engine implementation](https://github.com/stratoweave/stratoweave/blob/main/src/ttt.act) are:

```acton
res = difference(self.output, newout)
if out is not None and res is not None:
    out.configure(tid, {self.me: res})
```

The lower layer applies those contributions and recomputes affected transforms. That repeats through the stack until the desired vendor configuration has been derived. RFS transforms use the same output-diffing principle when passing their device configuration contribution downward.

There is also an important special case: a transform's input can disappear entirely. The engine then clears its contribution by comparing the previous output with an empty output tree. It doesn't call a service-specific delete function and ask the developer to reconstruct everything the transform used to produce.

This explains both kinds of removal: an entry disappears from a still-active transform's output, or the entire transform instance loses its input. **The developer writes the mapping once; changes and removals follow from what that mapping now produces, or from its contribution being withdrawn.**

## Where device operations happen

The modeled layers eventually produce target device configuration. StratoWeave's device manager holds that target alongside the running configuration it knows for the device. It computes the changes and hands the work to the southbound adapter, which implements the device-facing operations.

So “declarative all the way down” describes the service developer's experience from the CFS down to the device configuration layer. The platform and adapters handle the protocol behavior and transaction guarantees that make this contract work in practice.

YANG modeled devices can process those declarative configuration updates natively over NETCONF, RESTCONF, or gNMI. Devices that only support a CLI or proprietary APIs may require multiple operations to reach the desired state. Those require custom adapters that understand the device's behavior and can sequence the operations correctly. But as a service developer, you don't have to write that sequencing logic. You just describe what should exist, and the platform and adapters handle the rest.

## One development model across the layers

You still need to know what a correct iBGP mesh looks like and how each device represents a neighbor. That's the domain knowledge your transforms capture. StratoWeave carries changes through those representations and withdraws contributions that are no longer required.

Each layer can express intent at the level that makes sense for its consumer: router membership, individual neighbors, or vendor-specific configuration. SORESPO's particular layers are one implementation choice; your orchestrator can use the abstractions its services need.

Ready to learn more? , start with the [SORESPO development tutorial](@/tutorials/developing-sorespo.md) and follow the router, full-mesh, and neighbor transforms through the source in your local environment.
