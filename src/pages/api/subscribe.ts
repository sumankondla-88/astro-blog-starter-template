import type { APIRoute } from "astro";

// On-demand route (the rest of the site is static). Adds a subscriber to a Brevo list.
// Secrets live in the Worker: BREVO_API_KEY, BREVO_LIST_ID, and optionally BREVO_DOI_TEMPLATE_ID
// to send a double opt-in confirmation email first (recommended).
export const prerender = false;

const json = (body: Record<string, unknown>, status = 200) =>
	new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

const EMAIL = /^\S+@\S+\.\S+$/;

export const POST: APIRoute = async ({ request, locals, url }) => {
	const env = ((locals as any).runtime?.env ?? {}) as Record<string, string | undefined>;
	const apiKey = env.BREVO_API_KEY ?? import.meta.env.BREVO_API_KEY;
	const listId = Number(env.BREVO_LIST_ID ?? import.meta.env.BREVO_LIST_ID);
	const doiTemplate = Number(env.BREVO_DOI_TEMPLATE_ID ?? import.meta.env.BREVO_DOI_TEMPLATE_ID) || undefined;

	// Same-origin only: blocks other sites from posting to this route from a browser.
	const origin = request.headers.get("Origin");
	if (origin && origin !== url.origin) return json({ error: "forbidden" }, 403);

	if (!apiKey || !listId) return json({ error: "not_configured" }, 503);

	let data: { email?: unknown; website?: unknown };
	try {
		data = await request.json();
	} catch {
		return json({ error: "bad_request" }, 400);
	}

	// Honeypot: real visitors never fill this hidden field. Pretend success to bots.
	if (typeof data.website === "string" && data.website.trim() !== "") return json({ ok: true });

	const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
	if (email.length > 254 || !EMAIL.test(email)) return json({ error: "invalid_email" }, 400);

	const headers = { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" };

	try {
		const res = doiTemplate
			? await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
					method: "POST",
					headers,
					body: JSON.stringify({
						email,
						includeListIds: [listId],
						templateId: doiTemplate,
						redirectionUrl: `${url.origin}/?subscribed=1`,
					}),
				})
			: await fetch("https://api.brevo.com/v3/contacts", {
					method: "POST",
					headers,
					body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
				});

		// 201/204 = created or updated. A "duplicate" 400 means they're already on the list; report
		// success either way so the form can't be used to discover who is subscribed.
		if (res.ok) return json({ ok: true, confirm: !!doiTemplate });
		const body = (await res.json().catch(() => ({}))) as { code?: string };
		if (res.status === 400 && body.code === "duplicate_parameter") return json({ ok: true, confirm: !!doiTemplate });
		console.error("Brevo error", res.status, body.code);
		return json({ error: "provider_error" }, 502);
	} catch (err) {
		console.error("Brevo request failed", err);
		return json({ error: "provider_error" }, 502);
	}
};

export const ALL: APIRoute = () => json({ error: "method_not_allowed" }, 405);
