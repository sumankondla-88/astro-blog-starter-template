---
title: "Zero Trust explained: verify every request, not the network"
description: "Learn what Zero Trust means, how it differs from a traditional VPN perimeter, and how identity, device posture, and least privilege fit together."
pubDate: 2026-10-29
category: cloudflare
format: "How-to"
seoTitle: "Zero Trust Explained: Identity, Devices, and Access"
seoDescription: "A practical introduction to Zero Trust principles and how Cloudflare Access and Gateway can apply them."
featured: false
draft: true
---

Zero Trust is a security approach built around a simple idea: being on a trusted network is not enough to prove that a user or device should access a resource. Each access request should be evaluated using relevant evidence, such as identity, device health, the requested application, and the organization's policy.

“Never trust, always verify” is a useful shorthand, but Zero Trust is not a product toggle and it does not mean distrusting every employee. It means granting access deliberately, with the smallest scope needed, instead of assuming that everything inside a network perimeter is safe.

## How it differs from a network perimeter

A traditional VPN often connects a device to a private network after the user authenticates. Depending on the design, that connection may provide broad reachability to multiple systems. A compromised device or account can then have more opportunity to move laterally.

Zero Trust changes the question from “Is this device connected to the corporate network?” to “Should this identity and device reach this particular application or service, under these conditions?” A VPN can still be part of a Zero Trust architecture, but broad network access alone is not the policy.

## The building blocks

1. **Identity:** authenticate users with a trusted identity provider and use strong authentication, ideally phishing-resistant methods for sensitive access.
2. **Device context:** check useful posture signals, such as whether a device is managed, encrypted, or running an acceptable operating system.
3. **Resource-specific policy:** grant access to an application or private resource, rather than placing the user on a flat network.
4. **Least privilege:** keep the grant narrow by user group, device, application, and action; remove access when it is no longer needed.
5. **Continuous operation:** log decisions, review unusual activity, and reevaluate policies as identities, devices, and risk change.

No single signal is perfect. A compliant device can still be compromised, and a valid login can still be stolen. Combine signals proportionally to the sensitivity of the application, and have a plan for provider or device-check failures.

## How Cloudflare can implement parts of it

Cloudflare Access can sit in front of web applications as an identity-aware proxy. Before allowing a request, an Access policy can use identity-provider details, groups, device posture, and other selectors. For private network applications, users' traffic can be routed through Cloudflare Gateway using the Cloudflare One Client or another supported connection method.

Cloudflare Gateway can apply policies to DNS, HTTP, and network traffic, depending on the configuration. The Cloudflare One Client (formerly WARP) can create an encrypted connection from a device to Cloudflare and report posture information used by policies. These services are building blocks: the organization still defines who should access what and how exceptions are handled.

## A practical migration path

Do not begin by removing every VPN route. Start with one internal application that has a clear owner and a manageable user group:

1. Inventory the application, its identity source, data sensitivity, and any non-browser dependencies.
2. Define the smallest group that needs access and the device requirements that are actually enforceable.
3. Put the access policy in front of the application, initially using a safe test group or non-production app.
4. Verify normal workflows, service accounts, mobile clients, and emergency support paths.
5. Review access logs and denied requests; refine the policy without adding broad permanent bypasses.
6. Expand to another application and reduce legacy network access only when you have validated the replacement.

This incremental approach avoids turning a Zero Trust rollout into a high-risk network cutover. Measure whether users can do their jobs securely, whether access is narrower, and whether operators can investigate policy decisions.

## What Zero Trust is not

Zero Trust does not mean buying a single vendor product, installing an agent and stopping there, or demanding repeated prompts without a risk-based reason. It is not a promise that breaches are impossible. It is a way to limit implicit trust, make access decisions explicit, and reduce the impact when an identity or device is compromised.

Cloudflare One packages several services that can support this architecture. The next article explains what the platform includes and how to think about starting small: [Cloudflare One explained](/blog/what-is-cloudflare-one/).

## Further reading

- [Cloudflare Access: add web applications](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/)
- [Cloudflare One Client](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/)
- [Cloudflare Zero Trust](https://www.cloudflare.com/zero-trust/)
