# Newsletter signups (Brevo)

The signup form posts to `/api/subscribe`, a Worker route (`src/pages/api/subscribe.ts`) that adds the
address to a Brevo list. The Brevo API key stays on the Worker and never reaches the browser. Subscribers
are stored in Brevo (Contacts), which also sends the emails and handles unsubscribes.

## Brevo setup

1. Create a free account at brevo.com and verify your sender email or domain (Senders, domains & dedicated IPs).
2. **Contacts → Lists → Add a list** (for example "Blog subscribers") and note its numeric **ID**.
3. **SMTP & API → API keys → Generate a new API key** and copy it.
4. Recommended, double opt-in: create a double opt-in confirmation template in Brevo that contains the
   `{{ params.DOIurl }}` link, and note its **template ID**. Without it, addresses are added immediately
   with no confirmation.

## Cloudflare Worker settings

Workers & Pages → your Worker → Settings → Variables and Secrets:

| Type | Name | Value |
|---|---|---|
| Secret | `BREVO_API_KEY` | the API key |
| Text | `BREVO_LIST_ID` | the list ID, for example `3` |
| Text | `BREVO_DOI_TEMPLATE_ID` | optional template ID for double opt-in |

Until `BREVO_API_KEY` and `BREVO_LIST_ID` are set, the form shows "Subscriptions aren't open yet".

## Notes

- Protections: same-origin check, a hidden honeypot field, and email validation. For heavier abuse, add
  Cloudflare Turnstile or a rate-limit rule on `/api/subscribe` (Security → WAF → Rate limiting).
- Already-subscribed addresses get the same success message, so the form cannot reveal who is on the list.
- The free plan sends up to 300 emails per day. Every email you send needs an unsubscribe link, which
  Brevo adds to campaigns automatically.
- To keep your own copy of the list, export contacts from Brevo, or ask for a Cloudflare D1 copy to be added.
