# HC GamerLife

An original, responsive product landing page for the HCG1 Pro Gaming Headset, served directly from a Cloudflare Worker.

## Customer avatar

The page is written for the committed everyday gamer: a console or PC player who spends long sessions with friends, wants clear positional audio and dependable voice chat, and cares about comfort and cross-platform flexibility. The copy speaks to players first and leaves room for parents and gift buyers to understand the current sale.

## Going-out-of-business sale

Customer-facing terms match https://www.hcgamerlife.com (the HCG1 and the HCG1 Pro are the same headset):

- Price **$40** (compare-at / former price **$129.99**).
- While supplies last. No fixed end date.
- Sold without a warranty.
- 30-day returns. The buyer pays return shipping unless the unit is defective.
- Defective units are replaced within 90 days.
- Shipping is **$12 flat**, continental United States only.

Those facts are on the homepage (banner, specs, FAQ, purchase panel), the quiz, `/terms`, and `/privacy-policy`. The business address in the footer and legal pages is 1037 NE 65th St #80853, Seattle, WA 98115. Returns are not accepted at that mailbox; email support@hcgamerlife.com first.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Authenticate Wrangler locally with `npx wrangler login`, then run `npm run deploy`. GitHub Actions (`.github/workflows/deploy.yml`) deploys the Worker on every push to `main`, including a merge of a pull request, when repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set. That deploy publishes `wrangler.jsonc` vars such as `ERP_ITEM_RATE=40`. Headset checkout does not use a Stripe Price. `/checkout` redirects to Shopify.

The Worker serves the site at every route and exposes `/healthz` for a lightweight deployment check. A custom domain can be attached in Cloudflare later without changing the source.

## Interactive quiz

`/quiz` is an on-site Gamer Audio Profile — intro, four single-select steps with auto-advance, email unlock, then an Immersed / Climbing / Ready for Pro result. It is first-party HTML and JS served by the Worker, not a LeadConnector iframe.

On complete, `POST /api/quiz` upserts the contact into HighLevel location `STFgRxHbklvx2q1nDpi1` (overridable with the `GHL_LOCATION_ID` Worker var).

Required Wrangler secret (do not commit):

```bash
npx wrangler secret put GHL_PIT
# or, if you prefer the HCGL-specific name:
npx wrangler secret put HCGL_GHL_PIT
```

Use a HighLevel Private Integration token with contacts write access. The Worker sends LeadConnector `contacts/upsert` plus a tags write (`Version: 2021-07-28`).

Tags applied: `hcgl-quiz-complete`, `hcgl-registered` (when email is captured), `hcgl-platform-pc|playstation|xbox|switch-mobile`, `hcgl-style-competitive|casual|creator`, `hcgl-pain-audio|comfort|mic`, `hcgl-lead-nurture`.

Custom fields written by key (create these on the location if they do not exist yet): `hcgl_primary_platform`, `hcgl_play_style`, `hcgl_session_hours`, `hcgl_top_pain`, `hcgl_quiz_score_band`.

Local `npm run dev` can complete the quiz UI without a PIT. The API then returns `crm: "skipped"` so you can still walk the flow. Production needs the secret or upserts will not land in HighLevel.

```bash
npm test
```

## Checkout is Shopify

Buy buttons and `/checkout` (any method) send the shopper to the live Shopify product, already priced at **$40** on Shopify Payments:

https://www.hcgamerlife.com/products/gaming-headset-xbox-one-ps4-pc-mobile-compatible

hcgamerlife.org does not create a Stripe Checkout session for this sale. The Stripe live Price is skipped. Do not point the buy button at `STRIPE_PRICE_ID`.

`/checkout/config` returns `{ ready: false, checkout: "shopify", url }` and does not expose a Stripe publishable key.

The Worker still contains a Stripe webhook (`POST /api/stripe/webhook`) that can record an already-created Checkout session in ERPNext and HighLevel. That path is not how new headset orders are taken. New orders are Shopify’s.

Quiz contacts still use the HighLevel secret:

```bash
npx wrangler secret put GHL_PIT
```

## Media delivery

Official HCG1 stills and in-session photographs live in `public/assets/gallery/` and are served at `/assets/gallery/*` with a year-long immutable cache. The `/gallery` page is the full set: catalog plates, in-hand scale stills, and five session photos on PC, DualSense, Xbox, and PlayStation.

Older Cloudflare Images assets remain available through `/media/image` for journal heroes. When video is added, use Cloudflare Stream’s direct player or HLS/DASH manifest URLs so Stream can handle adaptive playback globally; the Worker should not cache or proxy manifests.

The Worker is also configured with remote Cloudflare Images, Media Transformations, and Stream bindings for future assets. When video is added, use Cloudflare Stream’s direct player or HLS/DASH manifest URLs so Stream can handle adaptive playback globally; the Worker should not cache or proxy manifests.

## Content and SEO

The homepage includes a journal hub with evergreen buyer’s guides, setup advice, comfort notes, care instructions, and game-night ideas. Each guide has its own route with a canonical URL, social preview metadata, Article and Breadcrumb structured data, and a Cloudflare Images hero asset. The Worker also serves `robots.txt`, `sitemap.xml`, `/gallery`, and a small web manifest so crawlers and share previews can discover the site cleanly. After deploy, `npm run indexnow` pings IndexNow with the sitemap.

