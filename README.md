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

Authenticate Wrangler locally with `npx wrangler login`, then run `npm run deploy`. GitHub Actions (`.github/workflows/deploy.yml`) deploys the Worker on every push to `main`, including a merge of a pull request, when repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set. That deploy publishes `wrangler.jsonc` vars such as `ERP_ITEM_RATE=40`. It does not rotate `STRIPE_PRICE_ID`; update that in Cloudflare if it still points at the old Price.

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

## Stripe checkout → ERP + HighLevel

On-site checkout is Stripe Checkout in `ui_mode=embedded_page` / `mode=payment` (see `createStripeCheckout` in `src/index.ts`). Completed payments are fulfilled by:

`POST https://hcgamerlife.org/api/stripe/webhook`

In the Stripe Dashboard, add that URL as a webhook endpoint (same mode as the Checkout price: test or live) and enable:

- `checkout.session.completed` (the event this Worker fulfills)
- `checkout.session.async_payment_succeeded` (delayed methods, if you enable any)

`payment_intent.succeeded` is ignored on purpose. Embedded Checkout already emits `checkout.session.completed` with customer email and metadata; handling both events would risk double work. Idempotency still keys on the Checkout Session id.

The Worker verifies `Stripe-Signature` with `STRIPE_WEBHOOK_SECRET`, then:

1. Upserts an ERPNext **Customer** on https://admin.hcgamerlife.org by `email_id`.
2. Creates a **Sales Order** for Item `HCG1-PRO` at **$40** (the sale price, not the $129.99 compare-at), quantity from session metadata (set when `/checkout` starts), line items, or `amount_total / 4000`. Checkout also adds **$12** flat shipping for a US address via inline `shipping_rate_data` (no Shipping Rate ID). The Sales Order line is the headset only; remarks record `shipping_flat_usd=12.00`. Quantity metadata is the source of truth because `amount_total` can include shipping and tax.
3. Submits the Sales Order. Payment is recorded on the document (`po_no` + remarks). The Worker does **not** send ERP or marketing email.
4. Upserts the HighLevel contact at location `STFgRxHbklvx2q1nDpi1` and applies tags `hcgl-customer` and `hcgl-purchased-hcg1` (same PIT / `contacts/upsert` pattern as `/api/quiz`).

### Secrets and vars

Do not commit values. Set Worker secrets:

```bash
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put ERP_API_KEY
npx wrangler secret put ERP_API_SECRET
npx wrangler secret put GHL_PIT
```

Non-secret defaults in `wrangler.jsonc` / `.env.example`:

| Name | Default | Role |
| --- | --- | --- |
| `ERP_URL` | `https://admin.hcgamerlife.org` | Parsimony ERPNext site |
| `ERP_ITEM_CODE` | `HCG1-PRO` | Sales Order item |
| `ERP_ITEM_RATE` | `40` | Unit rate when not overridden. This is the sale price. |
| `GHL_LOCATION_ID` | `STFgRxHbklvx2q1nDpi1` | HighLevel location |
| `ERP_COMPANY` | (site default) | Set if the ERP has more than one company |
| `ERP_CUSTOMER_GROUP` | `All Customer Groups` | Customer create |
| `ERP_TERRITORY` | `All Territories` | Customer create |
| `ERP_DRY_RUN` / `PURCHASE_DRY_RUN` | unset | `1`/`true` maps the session and skips ERP/GHL writes |

`STRIPE_PUBLISHABLE_KEY` and `STRIPE_PRICE_ID` are already required for `/checkout`.

### Stripe Price (manual — Dennis / ops)

Checkout charges whatever Stripe Price `STRIPE_PRICE_ID` points at. This repo does not create Stripe Prices and does not contain a Price ID.

**TODO:** In the Stripe Dashboard, in the same mode as `STRIPE_SECRET_KEY` (test or live), create a one-time Price for the HCG1 Pro at **USD 40.00**. Set that Price’s ID as the Worker `STRIPE_PRICE_ID` (`npx wrangler secret put STRIPE_PRICE_ID`, or update the existing var). Until that ID is the $40 Price, embedded checkout still charges the Price stored today. The previous selling price was $129.99. Do not paste a guessed Price ID into source.

Shipping does not need a dashboard ID. `applySaleCheckoutFields` sends a $12 fixed amount (`1200` cents), display name “Flat rate (continental US)”, and limits `shipping_address_collection` to the US. Stripe’s country list cannot exclude Alaska or Hawaii. Terms say those orders are outside the sale and may be canceled and refunded.

`ERP_ITEM_RATE` is `40` in `wrangler.jsonc`. A deploy from `main` publishes that var. If a Cloudflare plain-text var was still `129.99`, the next deploy overwrites it. A secret with the same name would still win over the var; this rate is not a secret.

### ERP Item and custom fields (ops)

Create these on admin.hcgamerlife.org if they are missing. The Worker can create documents without the custom fields (it retries after an “unknown field” error) but ops should add them so Stripe and GHL ids are queryable.

| Doctype | Name / field | Type | Notes |
| --- | --- | --- | --- |
| Item | `HCG1-PRO` | Item code | HCG1 Pro Gaming Headset. Sales Order unit rate is the **$40** sale price (compare-at $129.99 is not the rate). Sales Order does not update stock; a non-stock or stock Item both work. Shipping is collected by Stripe, not as a second ERP item. |
| Customer | `custom_ghl_contact_id` | Data | HighLevel contact id |
| Sales Order | `custom_stripe_session_id` | Data | Stripe Checkout Session id (`cs_…`). Mark Unique if you can. |
| Sales Order | `custom_stripe_payment_id` | Data | PaymentIntent id (`pi_…`) |

Idempotency does not depend on the custom fields. The Sales Order `po_no` is set to the Stripe Checkout Session id. A replay finds that order and will not insert a second one. A leftover draft is submitted instead of duplicated.

Local dry-run (no ERP writes):

```bash
# .dev.vars
ERP_DRY_RUN=1
STRIPE_WEBHOOK_SECRET=whsec_...
```

`npm test` covers mapping, signature checks, and idempotency with in-memory ERP/GHL doubles.

## Media delivery

Official HCG1 stills and in-session photographs live in `public/assets/gallery/` and are served at `/assets/gallery/*` with a year-long immutable cache. The `/gallery` page is the full set: catalog plates, in-hand scale stills, and five session photos on PC, DualSense, Xbox, and PlayStation.

Older Cloudflare Images assets remain available through `/media/image` for journal heroes. When video is added, use Cloudflare Stream’s direct player or HLS/DASH manifest URLs so Stream can handle adaptive playback globally; the Worker should not cache or proxy manifests.

The Worker is also configured with remote Cloudflare Images, Media Transformations, and Stream bindings for future assets. When video is added, use Cloudflare Stream’s direct player or HLS/DASH manifest URLs so Stream can handle adaptive playback globally; the Worker should not cache or proxy manifests.

## Content and SEO

The homepage includes a journal hub with evergreen buyer’s guides, setup advice, comfort notes, care instructions, and game-night ideas. Each guide has its own route with a canonical URL, social preview metadata, Article and Breadcrumb structured data, and a Cloudflare Images hero asset. The Worker also serves `robots.txt`, `sitemap.xml`, `/gallery`, and a small web manifest so crawlers and share previews can discover the site cleanly. After deploy, `npm run indexnow` pings IndexNow with the sitemap.

