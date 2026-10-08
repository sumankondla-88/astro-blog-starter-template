---
title: "What is a CDN, and how does Cloudflare deliver content?"
description: "Understand content delivery networks, edge caching, cache hits and misses, and what a CDN can—and cannot—make faster."
pubDate: 2026-10-15
category: cloudflare
format: "How-to"
seoTitle: "What Is a CDN? How Cloudflare Delivers Content"
seoDescription: "A practical explanation of CDNs, edge caching, origin servers, and how Cloudflare serves website content."
featured: false
draft: true
---

A content delivery network (CDN) is a distributed group of servers that helps deliver web content to users. Instead of every visitor fetching every image, stylesheet, or page directly from one origin server, a CDN can keep copies of eligible content at network locations closer to visitors.

Cloudflare combines a CDN with other services on its network. A useful place to start is the request path described in [what Cloudflare is and how it works](/blog/what-is-cloudflare-how-it-works/).

## The origin, the edge, and the cache

The **origin** is the server or service that holds or generates the content. The **edge** is a network location nearer to a visitor. A **cache** is a temporary copy of a response that can be reused when another request is eligible.

Suppose a page uses a logo and a CSS file. The first request for those files may travel through Cloudflare to the origin. If the files are cacheable under the current settings, Cloudflare can store copies. Later visitors whose requests match those cached objects may receive them from Cloudflare without making the same request to the origin.

- A **cache hit** means a usable copy was found and served.
- A **cache miss** means Cloudflare needs to fetch the response from the origin (or otherwise obtain it) before it can be returned.
- A **revalidation** is a check with the origin to see whether a cached response is still current.

A CDN can reduce the distance data travels and reduce repeated origin work. It cannot guarantee that every request is cached or faster: routing, cache configuration, file size, origin performance, and the visitor's connection all matter.

## What is usually cacheable?

Static assets such as versioned images, fonts, JavaScript, and CSS are common cache candidates. HTML pages can also be cached, but that decision needs more care. A page containing a user's account details, cart, or personalized information must not be served to the wrong visitor from a shared cache.

The cache policy should match how the application works. Important questions include:

- Is the response public, or does it contain user-specific data?
- Which URL, query parameters, headers, or cookies make one response different from another?
- How long can the content be stale before it causes a problem?
- How will a new version be published or old content purged?
- What should happen if the origin is unavailable?

For frequently changed assets, including a content hash in the filename (for example, `app.4f8a2c.js`) lets you cache the asset for a long time while deploying a new filename when its contents change. For HTML or API responses, use explicit rules and test authenticated and anonymous requests separately.

## What Cloudflare's CDN does

For a web hostname with a **Proxied** DNS record, Cloudflare can handle the request before it reaches the origin. Its cache uses configured behavior and response details to decide whether to serve, revalidate, or fetch a response. Cache Rules let operators customize parts of that behavior, and purge operations can remove cached copies when content changes unexpectedly.

Cloudflare also offers **Tiered Cache**, which can have edge locations check an upper-tier cache before going all the way to the origin. This can reduce origin requests, particularly when the same object is requested from multiple locations.

Caching is distinct from DNS. DNS helps direct the browser to Cloudflare; CDN caching is what may let Cloudflare answer a request with a stored response. A proxied request can still be a cache miss and go to the origin.

## Common CDN mistakes

1. **Assuming “proxied” means “cached.”** Proxying routes supported traffic through Cloudflare, but the response may not be eligible for caching.
2. **Caching personalized content as public.** This can expose one user's response to another. Treat cookies, authorization, and cache keys with care.
3. **Using a long TTL without a release strategy.** Versioned assets help; frequently edited content may need a shorter TTL or a reliable purge process.
4. **Ignoring the origin.** If the origin is slow or overloaded, cache misses and dynamic requests still depend on it.
5. **Testing only from one location.** Cache behavior and network paths can differ by request, point of presence, and configuration.

## A practical rollout

Start with low-risk static assets. Confirm the hostname is proxied, inspect response headers and Cloudflare cache status, and verify that a second request can be served from cache. Then test a deploy and purge process. Only after understanding the application's cookies and authorization behavior should you consider caching HTML or API responses.

The goal is not “cache everything.” It is to reuse responses that are safe to reuse, for an appropriate period, while keeping dynamic and private data on the right path. This same proxy path is also where Cloudflare can apply protections, as covered in [the security overview](/blog/is-cloudflare-secure/).

## Further reading

- [Cloudflare Cache documentation](https://developers.cloudflare.com/cache/)
- [Default cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/)
- [Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/)
- [Tiered Cache](https://developers.cloudflare.com/cache/how-to/tiered-cache/)
