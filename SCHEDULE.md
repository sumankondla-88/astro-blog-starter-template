# Scheduled publishing

Posts go live one per day, in an order you choose, with no manual step. Everything is set in the admin at
`/keystatic` → **Publishing schedule**.

## Using it

1. Finish writing a post and untick **Draft** on it. Posts still marked Draft never publish.
2. Open **Publishing schedule** and set:
   - **First post goes live on**: the start date (the first post in the list publishes that day).
   - **Publishing order**: add the posts and drag them into order. Each next post publishes the following day.
   - **Skip Saturdays and Sundays**: optional.
   - **Publish automatically on this schedule**: tick to turn it on.
3. Save. Saving commits to GitHub and deploys.

Rules:
- Post number *n* in the list goes live *n* days after the start date (skipping weekends if ticked). The date
  shown on the post, in RSS and in the plan is that scheduled date.
- A post on the schedule that is still a Draft on its day is skipped for that day. Once you untick Draft, it
  publishes on the next daily build (with its scheduled date).
- Posts not in the list keep their own publish date and are visible as soon as they are not drafts.
- `astro dev` shows all posts, including drafts and future days, so you can preview.
- The site is static, so a day's post appears when the site is rebuilt: the daily job below runs at
  13:00 UTC (9am US Eastern). A post's day starts at 00:00 UTC.

## One-time setup: the daily rebuild

1. Cloudflare dashboard → Workers & Pages → your Worker → **Settings → Builds → Deploy Hooks**.
   Create a hook for branch `main` and copy its URL. Treat the URL as a secret.
2. GitHub → this repo → **Settings → Secrets and variables → Actions → New repository secret**:
   name `DEPLOY_HOOK_URL`, value the hook URL.
3. GitHub → **Actions → Daily publish → Run workflow** once to test. A new build should appear in
   Cloudflare's Deployments.

To change the time, edit the `cron` line in `.github/workflows/daily-publish.yml` (times are UTC).

GitHub pauses scheduled workflows after 60 days with no repository activity and may delay a run by several
minutes. Publishing from the admin counts as activity, and you can always run the workflow by hand.
