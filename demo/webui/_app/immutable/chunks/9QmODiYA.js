var e={"AMS-CORE-1":{backbone:[{name:`ethernet-1/1`,description:`backbone to FRA-CORE-1 ethernet-1/1`,prefix:`10.1.12.1/30`},{name:`ethernet-1/2`,description:`backbone to STO-CORE-1 ethernet-1/1`,prefix:`10.1.13.1/30`}],vrfs:[{vpnId:`acme-65501`,iface:`ethernet-1/3.100`,providerAddress:`10.201.1.1/30`,asn:65501},{vpnId:`globex-65502`,iface:`ethernet-1/5.200`,providerAddress:`10.205.1.1/30`,asn:65502}]},"FRA-CORE-1":{backbone:[{name:`ethernet-1/1`,description:`backbone to AMS-CORE-1 ethernet-1/1`,prefix:`10.1.12.2/30`},{name:`ethernet-1/2`,description:`backbone to STO-CORE-1 ethernet-1/2`,prefix:`10.1.23.1/30`},{name:`ethernet-1/3`,description:`backbone to LJU-CORE-1 ethernet-1/1`,prefix:`10.1.24.1/30`}],vrfs:[{vpnId:`acme-65501`,iface:`ethernet-1/4.100`,providerAddress:`10.202.1.1/30`,asn:65501}]},"STO-CORE-1":{backbone:[{name:`ethernet-1/1`,description:`backbone to AMS-CORE-1 ethernet-1/2`,prefix:`10.1.13.2/30`},{name:`ethernet-1/2`,description:`backbone to FRA-CORE-1 ethernet-1/2`,prefix:`10.1.23.2/30`},{name:`ethernet-1/3`,description:`backbone to LJU-CORE-1 ethernet-1/2`,prefix:`10.1.34.1/30`}],vrfs:[{vpnId:`acme-65501`,iface:`ethernet-1/4.100`,providerAddress:`10.203.1.1/30`,asn:65501},{vpnId:`globex-65502`,iface:`ethernet-1/5.200`,providerAddress:`10.206.1.1/30`,asn:65502}]},"LJU-CORE-1":{backbone:[{name:`ethernet-1/1`,description:`backbone to FRA-CORE-1 ethernet-1/3`,prefix:`10.1.24.2/30`},{name:`ethernet-1/2`,description:`backbone to STO-CORE-1 ethernet-1/3`,prefix:`10.1.34.2/30`}],vrfs:[{vpnId:`acme-65501`,iface:`ethernet-1/3.100`,providerAddress:`10.204.1.1/30`,asn:65501}]}},t={backbone:[],vrfs:[]};function n(n){return e[n]??t}function r(e){let[t,n=`0`]=e.split(`.`);return{port:t,index:n}}function i(e,t){let i=n(e),a=i.backbone.map(e=>`  <interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>${e.name}</name>
    <description>${e.description}</description>
    <admin-state>enable</admin-state>
    <subinterface>
      <index>0</index>
      <ipv4>
        <address>
          <ip-prefix>${e.prefix}</ip-prefix>
        </address>
      </ipv4>
    </subinterface>
  </interface>`).join(`
`),o=i.vrfs.map(e=>{let{port:t,index:n}=r(e.iface);return`  <interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>${t}</name>
    <subinterface>
      <index>${n}</index>
      <vlan>
        <encap>
          <single-tagged>
            <vlan-id>${n}</vlan-id>
          </single-tagged>
        </encap>
      </vlan>
      <ipv4>
        <address>
          <ip-prefix>${e.providerAddress}</ip-prefix>
        </address>
      </ipv4>
    </subinterface>
  </interface>`}).join(`
`),s=i.vrfs.map(e=>`  <network-instance xmlns="urn:nokia.com:srlinux:net-inst:network-instance">
    <name>${e.vpnId}</name>
    <type>ip-vrf</type>
    <interface>
      <name>${e.iface}</name>
    </interface>
    <protocols>
      <bgp>
        <autonomous-system>${e.asn}</autonomous-system>
        <group>
          <group-name>customer</group-name>
          <peer-as>${e.asn}</peer-as>
        </group>
      </bgp>
    </protocols>
  </network-instance>`).join(`
`);return`<config>
  <system xmlns="urn:nokia.com:srlinux:general:system">
    <name>
      <host-name>${e}</host-name>
    </name>
  </system>
  <interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>system0</name>
    <subinterface>
      <index>0</index>
      <ipv4>
        <address>
          <ip-prefix>10.0.0.${t}/32</ip-prefix>
        </address>
      </ipv4>
    </subinterface>
  </interface>
${a}
${o}
  <network-instance xmlns="urn:nokia.com:srlinux:net-inst:network-instance">
    <name>default</name>
    <type>default</type>
    <interface>
      <name>system0.0</name>
    </interface>
${i.backbone.map(e=>`    <interface>\n      <name>${e.name}.0</name>\n    </interface>`).join(`
`)}
    <protocols>
      <bgp>
        <autonomous-system>65001</autonomous-system>
        <router-id>10.0.0.${t}</router-id>
        <group>
          <group-name>ibgp</group-name>
          <peer-as>65001</peer-as>
        </group>
      </bgp>
    </protocols>
  </network-instance>
${s}
</config>`}function a(e,t){let i=n(e),a=[{name:`system0`,subinterface:[{index:0,ipv4:{address:[{"ip-prefix":`10.0.0.${t}/32`}]}}]},...i.backbone.map(e=>({name:e.name,description:e.description,"admin-state":`enable`,subinterface:[{index:0,ipv4:{address:[{"ip-prefix":e.prefix}]}}]})),...i.vrfs.map(e=>{let{port:t,index:n}=r(e.iface);return{name:t,subinterface:[{index:Number(n),vlan:{encap:{"single-tagged":{"vlan-id":Number(n)}}},ipv4:{address:[{"ip-prefix":e.providerAddress}]}}]}})],o=[{name:`default`,type:`default`,interface:[{name:`system0.0`},...i.backbone.map(e=>({name:`${e.name}.0`}))],protocols:{bgp:{"autonomous-system":65001,"router-id":`10.0.0.${t}`,group:[{"group-name":`ibgp`,"peer-as":65001}]}}},...i.vrfs.map(e=>({name:e.vpnId,type:`ip-vrf`,interface:[{name:e.iface}],protocols:{bgp:{"autonomous-system":e.asn,group:[{"group-name":`customer`,"peer-as":e.asn}]}}}))];return{"srl_nokia-system:system":{name:{"host-name":e}},"srl_nokia-interfaces:interface":a,"srl_nokia-network-instance:network-instance":o}}function o(e,t){let r=n(e),i=[`system {`,`    host-name: "${e}"`,`}`,`interface system0 {`,`    subinterface 0 { ipv4 { address 10.0.0.${t}/32 } }`,`}`];for(let e of r.backbone)i.push(`interface ${e.name} {`,`    description: "${e.description}"`,`    subinterface 0 { ipv4 { address ${e.prefix} } }`,`}`);for(let e of r.vrfs)i.push(`network-instance ${e.vpnId} {`,`    type: ip-vrf`,`    interface ${e.iface} { }`,`    protocols { bgp { autonomous-system: ${e.asn} } }`,`}`);return i.push(`network-instance default {`,`    type: default`,`    protocols { bgp { autonomous-system: 65001, router-id: 10.0.0.${t} } }`,`}`),i.join(`
`)}function s(){return`  <interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>ethernet-1/6</name>
    <description>pending change awaiting approval</description>
    <admin-state>enable</admin-state>
  </interface>`}function c(){return{name:`ethernet-1/6`,description:`pending change awaiting approval`,"admin-state":`enable`}}var l=`xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0"`;function u(e,t,n,r,i){return`<config ${l}>
  <interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>${t.split(`.`)[0]}</name>
    <subinterface>
      <index>${t.split(`.`)[1]??`0`}</index>
      <ipv4>
        <address>
          <ip-prefix>${n}/${r}</ip-prefix>
        </address>
      </ipv4>
    </subinterface>
  </interface>
  <network-instance xmlns="urn:nokia.com:srlinux:net-inst:network-instance">
    <name>${e}</name>
    <type>ip-vrf</type>
    <interface>
      <name>${t}</name>
    </interface>
    <protocols>
      <bgp>
        <autonomous-system>${i}</autonomous-system>
        <group>
          <group-name>customer</group-name>
          <peer-as>${i}</peer-as>
        </group>
      </bgp>
    </protocols>
  </network-instance>
</config>`}function d(e,t){return`<config ${l}>
  <network-instance xmlns="urn:nokia.com:srlinux:net-inst:network-instance" xc:operation="remove">
    <name>${e}</name>
    <interface>
      <name>${t}</name>
    </interface>
  </network-instance>
</config>`}function f(e,t){return`<config ${l}>
  <interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>${e}</name>
    <description>${t}</description>
  </interface>
</config>`}function p(e,t){return`<config ${l}>
  <interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>${e}</name>
    <subinterface xc:operation="remove">
      <index>${t}</index>
    </subinterface>
  </interface>
</config>`}function m(e,t,n){return`<config ${l}>
  <interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>${e}</name>
    <description>backbone to ${t} ${n}</description>
    <admin-state>enable</admin-state>
  </interface>
</config>`}function h(){return`<config ${l}>
  <network-instance xmlns="urn:nokia.com:srlinux:net-inst:network-instance">
    <name>default</name>
    <protocols>
      <bgp>
        <group>
          <group-name>ibgp</group-name>
          <authentication>
            <keychain>ibgp-authentication-key</keychain>
          </authentication>
        </group>
      </bgp>
    </protocols>
  </network-instance>
</config>`}function g(e,t,n){return`<config ${l}>
  <system xmlns="urn:nokia.com:srlinux:general:system">
    <name>
      <host-name>${e}</host-name>
    </name>
  </system>
  <interface xmlns="urn:nokia.com:srlinux:chassis:interfaces">
    <name>system0</name>
    <subinterface>
      <index>0</index>
      <ipv4>
        <address>
          <ip-prefix>10.0.0.${t}/32</ip-prefix>
        </address>
      </ipv4>
    </subinterface>
  </interface>
  <network-instance xmlns="urn:nokia.com:srlinux:net-inst:network-instance">
    <name>default</name>
    <protocols>
      <bgp>
        <autonomous-system>${n}</autonomous-system>
        <router-id>10.0.0.${t}</router-id>
      </bgp>
    </protocols>
  </network-instance>
</config>`}function _(){return`<config ${l}>
  <network-instance xmlns="urn:nokia.com:srlinux:net-inst:network-instance">
    <name>default</name>
    <protocols>
      <bgp>
        <group>
          <group-name>ibgp</group-name>
        </group>
      </bgp>
    </protocols>
  </network-instance>
</config>`}var ee=`<intermediate xmlns="urn:sorespo:inter">
  <router>
    <name>AMS-CORE-1</name>
    <loopback>10.0.0.1</loopback>
    <ibgp-peer>10.0.0.2</ibgp-peer>
    <ibgp-peer>10.0.0.3</ibgp-peer>
    <ibgp-peer>10.0.0.4</ibgp-peer>
  </router>
  <router>
    <name>FRA-CORE-1</name>
    <loopback>10.0.0.2</loopback>
    <ibgp-peer>10.0.0.1</ibgp-peer>
    <ibgp-peer>10.0.0.3</ibgp-peer>
    <ibgp-peer>10.0.0.4</ibgp-peer>
  </router>
  <router>
    <name>STO-CORE-1</name>
    <loopback>10.0.0.3</loopback>
    <ibgp-peer>10.0.0.1</ibgp-peer>
    <ibgp-peer>10.0.0.2</ibgp-peer>
    <ibgp-peer>10.0.0.4</ibgp-peer>
  </router>
  <router>
    <name>LJU-CORE-1</name>
    <loopback>10.0.0.4</loopback>
    <ibgp-peer>10.0.0.1</ibgp-peer>
    <ibgp-peer>10.0.0.2</ibgp-peer>
    <ibgp-peer>10.0.0.3</ibgp-peer>
  </router>
  <l3vpn>
    <vpn-id>acme-65501</vpn-id>
    <endpoint><router>AMS-CORE-1</router><site>SITE-1</site></endpoint>
    <endpoint><router>FRA-CORE-1</router><site>SITE-2</site></endpoint>
    <endpoint><router>STO-CORE-1</router><site>SITE-3</site></endpoint>
    <endpoint><router>LJU-CORE-1</router><site>SITE-4</site></endpoint>
  </l3vpn>
  <l3vpn>
    <vpn-id>globex-65502</vpn-id>
    <endpoint><router>AMS-CORE-1</router><site>SITE-5</site></endpoint>
    <endpoint><router>STO-CORE-1</router><site>SITE-6</site></endpoint>
  </l3vpn>
</intermediate>`,te=JSON.stringify({"inter:intermediate":{router:[1,2,3,4].map(e=>({name:[`AMS-CORE-1`,`FRA-CORE-1`,`STO-CORE-1`,`LJU-CORE-1`][e-1],loopback:`10.0.0.${e}`,"ibgp-peer":[1,2,3,4].filter(t=>t!==e).map(e=>`10.0.0.${e}`)})),l3vpn:[{"vpn-id":`acme-65501`,endpoint:[{router:`AMS-CORE-1`,site:`SITE-1`},{router:`FRA-CORE-1`,site:`SITE-2`},{router:`STO-CORE-1`,site:`SITE-3`},{router:`LJU-CORE-1`,site:`SITE-4`}]},{"vpn-id":`globex-65502`,endpoint:[{router:`AMS-CORE-1`,site:`SITE-5`},{router:`STO-CORE-1`,site:`SITE-6`}]}]}},null,2),ne=`intermediate {
    router AMS-CORE-1 { loopback: 10.0.0.1, ibgp-peers: [10.0.0.2, 10.0.0.3, 10.0.0.4] }
    router FRA-CORE-1 { loopback: 10.0.0.2, ibgp-peers: [10.0.0.1, 10.0.0.3, 10.0.0.4] }
    router STO-CORE-1 { loopback: 10.0.0.3, ibgp-peers: [10.0.0.1, 10.0.0.2, 10.0.0.4] }
    router LJU-CORE-1 { loopback: 10.0.0.4, ibgp-peers: [10.0.0.1, 10.0.0.2, 10.0.0.3] }
    l3vpn acme-65501 { endpoints: [AMS-CORE-1/SITE-1, FRA-CORE-1/SITE-2, STO-CORE-1/SITE-3, LJU-CORE-1/SITE-4] }
    l3vpn globex-65502 { endpoints: [AMS-CORE-1/SITE-5, STO-CORE-1/SITE-6] }
}`,re=`<rfs xmlns="urn:sorespo:rfs">
  <device>
    <name>AMS-CORE-1</name>
    <service><type>base-router</type><instance>AMS-CORE-1</instance></service>
    <service><type>backbone-interface</type><instance>ethernet-1/1</instance></service>
    <service><type>backbone-interface</type><instance>ethernet-1/2</instance></service>
    <service><type>vrf</type><instance>acme-65501</instance></service>
    <service><type>vrf</type><instance>globex-65502</instance></service>
  </device>
  <device>
    <name>FRA-CORE-1</name>
    <service><type>base-router</type><instance>FRA-CORE-1</instance></service>
    <service><type>backbone-interface</type><instance>ethernet-1/1</instance></service>
    <service><type>backbone-interface</type><instance>ethernet-1/2</instance></service>
    <service><type>backbone-interface</type><instance>ethernet-1/3</instance></service>
    <service><type>vrf</type><instance>acme-65501</instance></service>
  </device>
  <device>
    <name>STO-CORE-1</name>
    <service><type>base-router</type><instance>STO-CORE-1</instance></service>
    <service><type>backbone-interface</type><instance>ethernet-1/1</instance></service>
    <service><type>backbone-interface</type><instance>ethernet-1/2</instance></service>
    <service><type>backbone-interface</type><instance>ethernet-1/3</instance></service>
    <service><type>vrf</type><instance>acme-65501</instance></service>
    <service><type>vrf</type><instance>globex-65502</instance></service>
  </device>
  <device>
    <name>LJU-CORE-1</name>
    <service><type>base-router</type><instance>LJU-CORE-1</instance></service>
    <service><type>backbone-interface</type><instance>ethernet-1/1</instance></service>
    <service><type>backbone-interface</type><instance>ethernet-1/2</instance></service>
    <service><type>vrf</type><instance>acme-65501</instance></service>
  </device>
</rfs>`,ie=JSON.stringify({"rfs:rfs":{device:[{name:`AMS-CORE-1`,service:[`base-router`,`backbone-interface ethernet-1/1`,`backbone-interface ethernet-1/2`,`vrf acme-65501`,`vrf globex-65502`]},{name:`FRA-CORE-1`,service:[`base-router`,`backbone-interface ethernet-1/1`,`backbone-interface ethernet-1/2`,`backbone-interface ethernet-1/3`,`vrf acme-65501`]},{name:`STO-CORE-1`,service:[`base-router`,`backbone-interface ethernet-1/1`,`backbone-interface ethernet-1/2`,`backbone-interface ethernet-1/3`,`vrf acme-65501`,`vrf globex-65502`]},{name:`LJU-CORE-1`,service:[`base-router`,`backbone-interface ethernet-1/1`,`backbone-interface ethernet-1/2`,`vrf acme-65501`]}]}},null,2),ae=`rfs {
    device AMS-CORE-1 { base-router, backbone-interface x2, vrf acme-65501, vrf globex-65502 }
    device FRA-CORE-1 { base-router, backbone-interface x3, vrf acme-65501 }
    device STO-CORE-1 { base-router, backbone-interface x3, vrf acme-65501, vrf globex-65502 }
    device LJU-CORE-1 { base-router, backbone-interface x2, vrf acme-65501 }
}`,oe=`<data>
  <netinfra xmlns="urn:sorespo:netinfra">
    <global-settings>
      <ibgp-authentication-key>ibgp-authentication-key</ibgp-authentication-key>
    </global-settings>
    <router><name>AMS-CORE-1</name><id>1</id><type>NokiaSRLinux_25_3_2</type><role>edge</role><asn>65001</asn></router>
    <router><name>FRA-CORE-1</name><id>2</id><type>NokiaSRLinux_25_3_2</type><role>edge</role><asn>65001</asn></router>
    <router><name>STO-CORE-1</name><id>3</id><type>NokiaSRLinux_25_3_2</type><role>edge</role><asn>65001</asn></router>
    <router><name>LJU-CORE-1</name><id>4</id><type>NokiaSRLinux_25_3_2</type><role>edge</role><asn>65001</asn></router>
    <backbone-link><left-router>AMS-CORE-1</left-router><left-interface>ethernet-1/1</left-interface><right-router>FRA-CORE-1</right-router><right-interface>ethernet-1/1</right-interface></backbone-link>
    <backbone-link><left-router>AMS-CORE-1</left-router><left-interface>ethernet-1/2</left-interface><right-router>STO-CORE-1</right-router><right-interface>ethernet-1/1</right-interface></backbone-link>
    <backbone-link><left-router>FRA-CORE-1</left-router><left-interface>ethernet-1/2</left-interface><right-router>STO-CORE-1</right-router><right-interface>ethernet-1/2</right-interface></backbone-link>
    <backbone-link><left-router>FRA-CORE-1</left-router><left-interface>ethernet-1/3</left-interface><right-router>LJU-CORE-1</right-router><right-interface>ethernet-1/1</right-interface></backbone-link>
    <backbone-link><left-router>STO-CORE-1</left-router><left-interface>ethernet-1/3</left-interface><right-router>LJU-CORE-1</right-router><right-interface>ethernet-1/2</right-interface></backbone-link>
  </netinfra>
  <l3vpn-svc xmlns="urn:ietf:params:xml:ns:yang:ietf-l3vpn-svc">
    <vpn-services>
      <vpn-service><vpn-id>acme-65501</vpn-id><customer-name>CUSTOMER-1</customer-name></vpn-service>
      <vpn-service><vpn-id>globex-65502</vpn-id><customer-name>GLOBEX</customer-name></vpn-service>
    </vpn-services>
    <sites>
      <site><site-id>SITE-1</site-id><!-- AMS-CORE-1,ethernet-1/3.100 · acme-65501 --></site>
      <site><site-id>SITE-2</site-id><!-- FRA-CORE-1,ethernet-1/4.100 · acme-65501 --></site>
      <site><site-id>SITE-3</site-id><!-- STO-CORE-1,ethernet-1/4.100 · acme-65501 --></site>
      <site><site-id>SITE-4</site-id><!-- LJU-CORE-1,ethernet-1/3.100 · acme-65501 --></site>
      <site><site-id>SITE-5</site-id><!-- AMS-CORE-1,ethernet-1/5.200 · globex-65502 --></site>
      <site><site-id>SITE-6</site-id><!-- STO-CORE-1,ethernet-1/5.200 · globex-65502 --></site>
    </sites>
  </l3vpn-svc>
</data>`,v=`cfs {
    netinfra {
        global-settings { ibgp-authentication-key: "***" }
        routers: [AMS-CORE-1, FRA-CORE-1, STO-CORE-1, LJU-CORE-1]
        backbone-links: 5
    }
    l3vpn-svc {
        vpn-service acme-65501 { customer: CUSTOMER-1, sites: [SITE-1, SITE-2, SITE-3, SITE-4] }
        vpn-service globex-65502 { customer: GLOBEX, sites: [SITE-5, SITE-6] }
    }
}`;function y(e,t,n){if(e===0)return t===`json`?JSON.stringify({...n.netinfra,...n.l3vpn},null,2):t===`adata`?v:oe;if(e===1)return t===`json`?te:t===`adata`?ne:ee;if(e===2)return t===`json`?ie:t===`adata`?ae:re;if(t===`json`){let e={};for(let t of n.routers)e[t.name]=a(t.name,t.id);return JSON.stringify({"device-config:devices":e},null,2)}return t===`adata`?n.routers.map(e=>`device ${e.name} {\n${o(e.name,e.id).split(`
`).map(e=>`    ${e}`).join(`
`)}\n}`).join(`
`):`<devices>\n${n.routers.map(e=>`  <device>\n    <name>${e.name}</name>\n${i(e.name,e.id).split(`
`).map(e=>`    ${e}`).join(`
`)}\n  </device>`).join(`
`)}\n</devices>`}var b=[{name:`srl_nokia-interfaces`,namespace:`urn:nokia.com:srlinux:chassis:interfaces`,revision:`2025-03-31`},{name:`srl_nokia-network-instance`,namespace:`urn:nokia.com:srlinux:net-inst:network-instance`,revision:`2025-03-31`},{name:`srl_nokia-bgp`,namespace:`urn:nokia.com:srlinux:bgp:bgp`,revision:`2025-03-31`},{name:`srl_nokia-routing-policy`,namespace:`urn:nokia.com:srlinux:pol:routing-policy`,revision:`2025-03-31`},{name:`srl_nokia-system`,namespace:`urn:nokia.com:srlinux:general:system`,revision:`2025-03-31`},{name:`ietf-netconf`,namespace:`urn:ietf:params:xml:ns:netconf:base:1.0`,revision:`2011-06-01`,features:[`candidate`,`validate`,`startup`]},{name:`ietf-netconf-monitoring`,namespace:`urn:ietf:params:xml:ns:yang:ietf-netconf-monitoring`,revision:`2010-10-04`}];function x(e,t){return{name:e,type:`NokiaSRLinux_25_3_2`,username:`admin`,addresses:[{name:`mgmt`,address:`172.20.20.${10+t}`,port:830}],feature_flags:{confirmed_commit:!0,validate:!0,startup:!1},modules:b}}var S=[{"vpn-id":`acme-65501`,"customer-name":`CUSTOMER-1`},{"vpn-id":`globex-65502`,"customer-name":`GLOBEX`}],se={"session-state":`established`,"debug-active":!1},ce={"session-state":`active`,"debug-active":!0,"last-event":`error`,"established-transitions":3,"negotiated-hold-time":3,"last-notification":`received:cease`};function C(e,t,n,r,i,a,o=se){return{"site-id":e,management:{type:`customer-managed`},locations:{location:[{"location-id":`MAIN`}]},"site-network-accesses":{"site-network-access":[{"site-network-access-id":t,"location-reference":`MAIN`,service:{"svc-input-bandwidth":`1000000000`,"svc-output-bandwidth":`1000000000`,"svc-mtu":9e3},"vpn-attachment":{"vpn-id":i},"ip-connection":{ipv4:{"address-allocation-type":`static-address`,addresses:{"provider-address":`${r}.1`,"customer-address":`${r}.2`,"prefix-length":30}}},bearer:{"bearer-reference":n},"routing-protocols":{"routing-protocol":[{type:`bgp`,bgp:{"autonomous-system":a,"address-family":[`ipv4`],"sorespo-ietf-l3vpn-svc:authentication-key":i}}]}}]},"sorespo-ietf-l3vpn-svc:bgp-sessions":{"bgp-session":[{"site-network-access":t,...o}]}}}var le=[C(`SITE-1`,`SNA-1-1`,`AMS-CORE-1,ethernet-1/3.100`,`10.201.1`,`acme-65501`,65501),C(`SITE-2`,`SNA-2-1`,`FRA-CORE-1,ethernet-1/4.100`,`10.202.1`,`acme-65501`,65501),C(`SITE-3`,`SNA-3-1`,`STO-CORE-1,ethernet-1/4.100`,`10.203.1`,`acme-65501`,65501,ce),C(`SITE-4`,`SNA-4-1`,`LJU-CORE-1,ethernet-1/3.100`,`10.204.1`,`acme-65501`,65501),C(`SITE-5`,`SNA-5-1`,`AMS-CORE-1,ethernet-1/5.200`,`10.205.1`,`globex-65502`,65502),C(`SITE-6`,`SNA-6-1`,`STO-CORE-1,ethernet-1/5.200`,`10.206.1`,`globex-65502`,65502)],ue={"ibgp-authentication-key":`ibgp-authentication-key`},w=[{name:`AMS-CORE-1`,id:1,type:`NokiaSRLinux_25_3_2`,role:`edge`,asn:65001,"approval-required":!0},{name:`FRA-CORE-1`,id:2,type:`NokiaSRLinux_25_3_2`,role:`edge`,asn:65001},{name:`STO-CORE-1`,id:3,type:`NokiaSRLinux_25_3_2`,role:`edge`,asn:65001},{name:`LJU-CORE-1`,id:4,type:`NokiaSRLinux_25_3_2`,role:`edge`,asn:65001}],de=[{"left-router":`AMS-CORE-1`,"left-interface":`ethernet-1/1`,"right-router":`FRA-CORE-1`,"right-interface":`ethernet-1/1`,state:{"link-status":`up`}},{"left-router":`AMS-CORE-1`,"left-interface":`ethernet-1/2`,"right-router":`STO-CORE-1`,"right-interface":`ethernet-1/1`,state:{"link-status":`up`}},{"left-router":`FRA-CORE-1`,"left-interface":`ethernet-1/2`,"right-router":`STO-CORE-1`,"right-interface":`ethernet-1/2`},{"left-router":`FRA-CORE-1`,"left-interface":`ethernet-1/3`,"right-router":`LJU-CORE-1`,"right-interface":`ethernet-1/1`},{"left-router":`STO-CORE-1`,"left-interface":`ethernet-1/3`,"right-router":`LJU-CORE-1`,"right-interface":`ethernet-1/2`,state:{"link-status":`down`}}],fe={"AMS-CORE-1":[{diffXml:u(`acme-65501`,`ethernet-1/3.100`,`10.201.1.1`,30,65501)},{diffXml:f(`ethernet-1/1`,`backbone to FRA-CORE-1 ethernet-1/1`)}],"LJU-CORE-1":[{diffXml:p(`ethernet-1/4`,`300`)}]},T=3600,E=24*T,pe={"AMS-CORE-1":[{event:`sent`,ageSeconds:2*T,conf_diff:u(`globex-65502`,`ethernet-1/5.200`,`10.205.1.1`,30,65502)},{event:`sent`,ageSeconds:93600,conf_diff:f(`ethernet-1/2`,`backbone to STO-CORE-1 ethernet-1/1`)},{event:`sent`,ageSeconds:3*E}],"FRA-CORE-1":[{event:`failed`,ageSeconds:5*T,conf_diff:f(`ethernet-1/9`,`lab port (interface does not exist)`)},{event:`sent`,ageSeconds:108e3,conf_diff:u(`acme-65501`,`ethernet-1/4.100`,`10.202.1.1`,30,65501)}],"STO-CORE-1":[{event:`sent`,ageSeconds:8*T,conf_diff:u(`globex-65502`,`ethernet-1/5.200`,`10.206.1.1`,30,65502)},{event:`sent`,ageSeconds:2*E}],"LJU-CORE-1":[{event:`sent`,ageSeconds:5400,conf_diff:u(`acme-65501`,`ethernet-1/3.100`,`10.204.1.1`,30,65501)},{event:`sent`,ageSeconds:144e3}]},D=null;function me(){let e={globalSettings:structuredClone(ue),routers:structuredClone(w),backboneLinks:structuredClone(de),vpnServices:structuredClone(S),sites:structuredClone(le),devices:{},counters:{queueId:240,tid:195}},t=Math.floor(Date.now()/1e3);for(let n of w){let r=String(n.name);e.devices[r]={staticInfo:x(r,n.id??0),hasRunningConfig:!0,hasTargetConfig:!0,queue:[],log:(pe[r]??[]).map(e=>({event:e.event,timestamp:String(t-e.ageSeconds),...e.conf_diff?{conf_diff:e.conf_diff}:{}}))}}for(let[t,n]of Object.entries(fe)){let r=e.devices[t];if(r)for(let t of n)r.queue.push(k(e,t.diffXml))}return e}function O(){return D||=me(),D}function he(){D=null}function k(e,t){let n=String(++e.counters.queueId),r=String(++e.counters.tid);return{queueId:n,tid:r,deviceTxid:`d-${r}`,diffXml:t}}function A(e,t){let n=O().devices[e];n&&n.queue.push(k(O(),t))}function j(e,t,n){let r=O().devices[e];r&&r.log.unshift({event:t,timestamp:String(Math.floor(Date.now()/1e3)),...n?{conf_diff:n}:{}})}function M(e,t,n){let r=O();r.devices[e]||(r.devices[e]={staticInfo:x(e,t),hasRunningConfig:!1,hasTargetConfig:!0,queue:[k(r,n)],log:[]})}function N(e){delete O().devices[e]}var P=90;function F(){return new Promise(e=>setTimeout(e,P+Math.random()*60))}function I(e,t=200){return new Response(JSON.stringify(e),{status:t,headers:{"content-type":`application/yang-data+json`}})}function L(e,t=`text/plain`){return new Response(e,{status:200,headers:{"content-type":t}})}function R(e=204){return new Response(null,{status:e})}function z(e){return I({"ietf-restconf:errors":{error:[{"error-type":`application`,"error-tag":`invalid-value`,"error-message":e}]}},404)}function B(e){return I({message:e},404)}function V(e){return{"global-settings":e.globalSettings,router:e.routers,"backbone-link":e.backboneLinks}}function ge(e){return{"vpn-services":{"vpn-service":e.vpnServices},sites:{site:e.sites}}}function H(e,t){return e.routers.find(e=>e.name===t)?.id??9}function _e(e){return Object.keys(e.devices).map(t=>({name:t,id:H(e,t)}))}function U(e){let t=e?.[`site-network-accesses`]?.[`site-network-access`]?.[0],n=String(t?.bearer?.[`bearer-reference`]??``);if(!n)return null;let[r=``,i=``]=n.split(`,`).map(e=>e.trim()),a=t?.[`ip-connection`]?.ipv4?.addresses,o=t?.[`routing-protocols`]?.[`routing-protocol`]?.[0]?.bgp;return{router:r,iface:i||`ethernet-1/9.100`,vpnId:String(t?.[`vpn-attachment`]?.[`vpn-id`]??`l3vpn`),providerAddress:String(a?.[`provider-address`]??`10.209.1.1`),prefixLength:Number(a?.[`prefix-length`]??30),asn:Number(o?.[`autonomous-system`]??65500)}}function W(e){let t=U(e);t&&A(t.router,u(t.vpnId,t.iface,t.providerAddress,t.prefixLength,t.asn))}function ve(e){let t=U(e);t&&A(t.router,d(t.vpnId,t.iface))}function G(e){if(typeof e?.body!=`string`||!e.body)return null;try{return JSON.parse(e.body)}catch{return null}}function K(e,t){if(!e||typeof e!=`object`)return null;let n=e[t];if(Array.isArray(n))return n[0]??null;if(n&&typeof n==`object`)return n;let r=Object.values(e)[0];return Array.isArray(r)?r[0]??null:typeof r==`object`?r:null}function q(e,t){return String(e[`left-router`]??``)===t[0]&&String(e[`left-interface`]??``)===t[1]&&String(e[`right-router`]??``)===t[2]&&String(e[`right-interface`]??``)===t[3]}function J(e){let t=O(),n=String(e.name??``);if(!n)return;let r=t.routers.findIndex(e=>e.name===n),i=r===-1,a=Number(e.id)||(i?Math.max(0,...t.routers.map(e=>e.id??0))+1:t.routers[r].id??9),o={...e,name:n,id:a};i?t.routers.push(o):t.routers[r]=o;let s=Number(e.asn)||65001;t.devices[n]?A(n,g(n,a,s)):M(n,a,g(n,a,s))}function ye(e){let t=O();t.routers=t.routers.filter(t=>t.name!==e),t.backboneLinks=t.backboneLinks.filter(t=>t[`left-router`]!==e&&t[`right-router`]!==e),N(e)}function Y(e,t){let n=O(),r=n.backboneLinks.findIndex(e=>q(e,t));r===-1?n.backboneLinks.push(e):n.backboneLinks[r]={...n.backboneLinks[r],...e};let i=String(e[`left-router`]??t[0]),a=String(e[`right-router`]??t[2]);A(i,m(String(e[`left-interface`]??t[1]),a,String(e[`right-interface`]??t[3]))),A(a,m(String(e[`right-interface`]??t[3]),i,String(e[`left-interface`]??t[1])))}function be(e){let t=O();t.backboneLinks=t.backboneLinks.filter(t=>!q(t,e)),A(e[0],p(e[1].split(`.`)[0],`0`)),A(e[2],p(e[3].split(`.`)[0],`0`))}function X(e,t,n){let r=String(n[t]??``),i=e.findIndex(e=>String(e[t]??``)===r);i===-1?e.push(n):e[i]=n}var Z=`sorespo-ietf-l3vpn-svc:bgp-sessions`;function Q(e,t){let n=String(t[`site-id`]??``),r=e.find(e=>String(e[`site-id`]??``)===n),i={...t};delete i[Z],r?.[Z]!==void 0&&(i[Z]=r[Z]),X(e,`site-id`,i)}async function $(e,t,n,r){let i=O();if(e.length===1&&e[0]===`data`)return t===`PATCH`?(xe(n),R(200)):z(`unsupported ${t} on /data`);let[a,o,...s]=e;if(a!==`data`)return z(`unknown path /${e.join(`/`)}`);if(o===`netinfra:netinfra`){if(s.length===0)return t===`GET`?I({"netinfra:netinfra":V(i)}):z(`unsupported ${t} on netinfra:netinfra`);let[r]=s;if(r===`global-settings`){if(t===`GET`)return I({"netinfra:global-settings":i.globalSettings});if(t===`PUT`){i.globalSettings=K(G(n),`netinfra:global-settings`)??{};for(let e of Object.keys(i.devices))A(e,h());return R()}return z(`unsupported ${t} on global-settings`)}if(r.startsWith(`router=`)){let e=decodeURIComponent(r.slice(7)),a=i.routers.find(t=>t.name===e);if(t===`GET`)return a?I({"netinfra:router":[a]}):z(`no router ${e}`);if(t===`PUT`){let t=K(G(n),`netinfra:router`);return t&&J({...t,name:t.name??e}),R()}if(t===`DELETE`)return a?(ye(e),R()):z(`no router ${e}`)}if(r.startsWith(`backbone-link=`)){let e=r.slice(14).split(`,`).map(e=>decodeURIComponent(e).trim()),a=i.backboneLinks.find(t=>q(t,e));if(t===`GET`)return a?I({"netinfra:backbone-link":[a]}):z(`no backbone-link ${e.join(`,`)}`);if(t===`PUT`){let t=K(G(n),`netinfra:backbone-link`);return t&&Y(t,e),R()}if(t===`DELETE`)return a?(be(e),R()):z(`no backbone-link ${e.join(`,`)}`)}return z(`unknown netinfra path /${e.join(`/`)}`)}if(o===`ietf-l3vpn-svc:l3vpn-svc`){let[r,a]=s;if(r===`sites`){if(!a)return t===`GET`?I({"ietf-l3vpn-svc:sites":{site:i.sites}}):z(`unsupported ${t} on sites`);if(a.startsWith(`site=`)){let e=decodeURIComponent(a.slice(5)),r=i.sites.findIndex(t=>String(t[`site-id`])===e);if(t===`GET`)return r===-1?z(`no site ${e}`):I({"ietf-l3vpn-svc:site":[i.sites[r]]});if(t===`PUT`){let t=K(G(n),`ietf-l3vpn-svc:site`);return t&&(Q(i.sites,{...t,"site-id":t[`site-id`]??e}),W(t)),R()}if(t===`DELETE`)return r===-1?z(`no site ${e}`):(ve(i.sites[r]),i.sites.splice(r,1),R())}}if(r===`vpn-services`){if(!a)return t===`GET`?I({"ietf-l3vpn-svc:vpn-services":{"vpn-service":i.vpnServices}}):z(`unsupported ${t} on vpn-services`);if(a.startsWith(`vpn-service=`)){let e=decodeURIComponent(a.slice(12)),r=i.vpnServices.findIndex(t=>String(t[`vpn-id`])===e);if(t===`GET`)return r===-1?z(`no vpn-service ${e}`):I({"ietf-l3vpn-svc:vpn-service":[i.vpnServices[r]]});if(t===`PUT`){let t=K(G(n),`ietf-l3vpn-svc:vpn-service`);return t&&X(i.vpnServices,`vpn-id`,{...t,"vpn-id":t[`vpn-id`]??e}),R()}if(t===`DELETE`)return r===-1?z(`no vpn-service ${e}`):(i.vpnServices.splice(r,1),R())}}return z(`unknown l3vpn path /${e.join(`/`)}`)}return z(`unknown path /${e.join(`/`)}`)}function xe(e){let t=O(),n=G(e),r=new Set;if(n&&typeof n==`object`){let e=n[`ietf-l3vpn-svc:l3vpn-svc`];for(let n of e?.[`vpn-services`]?.[`vpn-service`]??[])X(t.vpnServices,`vpn-id`,n);for(let n of e?.sites?.site??[]){Q(t.sites,n);let e=U(n);e&&t.devices[e.router]&&(W(n),r.add(e.router))}let i=n[`netinfra:netinfra`];for(let e of i?.router??[])J(e),r.add(String(e.name??``));for(let e of i?.[`backbone-link`]??[]){let t=[String(e[`left-router`]??``),String(e[`left-interface`]??``),String(e[`right-router`]??``),String(e[`right-interface`]??``)];Y(e,t),r.add(t[0]),r.add(t[2])}if(i?.[`global-settings`]){t.globalSettings=i[`global-settings`];for(let e of Object.keys(t.devices))A(e,h()),r.add(e)}}if(r.size===0)for(let e of Object.keys(t.devices))A(e,_())}function Se(e,t){let n=e.devices[t];if(!n)return null;let r=e.routers.find(e=>e.name===t);return{...n.staticInfo,approval_required:!!(r?.[`approval-required`]??!1),has_running_config:n.hasRunningConfig,has_target_config:n.hasTargetConfig,queue_length:n.queue.length,pending_approvals:n.queue.length}}function Ce(e,t,n,r){let l=e.devices[t];if(!l)return``;let u=H(e,t),d=r===`target`&&l.queue.length>0;if(r===`running`&&!l.hasRunningConfig)return n===`json`?`{}`:`<!-- no running configuration: device has not been synchronized yet -->`;if(n===`json`){let e=a(t,u);return d&&e[`srl_nokia-interfaces:interface`].push(c()),JSON.stringify(e,null,2)}if(n===`adata`)return o(t,u)+(d?`
interface ethernet-1/6 { description: "pending change awaiting approval" }`:``);let f=i(t,u);return d?f.replace(`</config>`,`${s()}\n</config>`):f}async function we(e,t,n,r,i){let a=O();if(e[0]===`device`&&e.length===1)return I({devices:Object.keys(a.devices)});if(e[0]===`config-queue`&&e.length===1)return I({devices:Object.entries(a.devices).filter(([,e])=>e.queue.length>0).map(([e,t])=>({device_id:e,items:t.queue.map(e=>({queue_id:e.queueId,device_txid:e.deviceTxid,approved:null}))}))});if(e[0]===`layer`&&e.length===2)return L(y(Number(e[1]),i.includes(`acton-adata`)?`adata`:i.includes(`json`)?`json`:`xml`,{netinfra:{"netinfra:netinfra":V(a)},l3vpn:{"ietf-l3vpn-svc:l3vpn-svc":ge(a)},routers:_e(a)}),i||`application/yang-data+xml`);if(e[0]===`device`&&e.length>=3){let i=decodeURIComponent(e[1]),o=a.devices[i];if(!o)return B(`unknown device ${i}`);let s=e[2],c=r.get(`format`)??`json`;if(s===`info`)return I(Se(a,i));if(s===`resync`)return o.hasRunningConfig=!0,j(i,`resync`),I({});if(s===`q`&&e.length===3)return I(Object.fromEntries(o.queue.map(e=>[e.queueId,{tid:e.tid}])));if(s===`q`&&e.length>=4){let a=decodeURIComponent(e[3]),s=o.queue.find(e=>e.queueId===a);if(e[4]===`set_approval`){if(t!==`POST`)return B(`set_approval expects POST`);if(!s)return B(`no queue item ${a} on ${i}`);let e=!!G(n)?.approved;return o.queue=o.queue.filter(e=>e.queueId!==a),j(i,e?`sent`:`rejected`,s.diffXml),e&&(o.hasRunningConfig=!0),I({})}return s?I({tid:s.tid,device_txid:s.deviceTxid,config_diff:s.diffXml,format:r.get(`format`)??`xml`,approved:null}):B(`no queue item ${a} on ${i}`)}if(s===`running`||s===`target`)return L(Ce(a,i,c,s));if(s===`diff`)return L(o.queue.map(e=>e.diffXml).join(`
`)||`<!-- running and target configuration are in sync -->`);if(s===`log`)return I({log:o.log})}return B(`unknown API path /${e.join(`/`)}`)}function Te(){return(async(e,t)=>{let n=typeof e==`string`?e:e instanceof URL?e.href:e.url,r=new URL(n,`http://demo.invalid`),i=(t?.method??(e instanceof Request?e.method:`GET`)).toUpperCase(),a=new Headers(t?.headers).get(`accept`)??``;return await F(),r.pathname.startsWith(`/api/restconf/`)?$(r.pathname.slice(14).split(`/`).filter(Boolean),i,t,r.searchParams):r.pathname.startsWith(`/api/`)?we(r.pathname.slice(5).split(`/`).filter(Boolean),i,t,r.searchParams,a):B(`the demo only serves /api paths, got ${r.pathname}`)})}var Ee=Te();export{he as n,Ee as t};