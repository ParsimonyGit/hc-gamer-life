# HC GamerLife

An original, responsive product landing page for the HCG1 Pro Gaming Headset, served directly from a Cloudflare Worker.

## Customer avatar

The page is written for the committed everyday gamer: a console or PC player who spends long sessions with friends, wants clear positional audio and dependable voice chat, and cares about comfort, cross-platform flexibility, and a warranty. The copy speaks to players first and leaves room for parents and gift buyers to feel confident about durability.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Authenticate Wrangler locally with `npx wrangler login`, then run `npm run deploy`. GitHub Actions is ready in `.github/workflows/deploy.yml`; add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets before enabling it.

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

## Media delivery

Official HCG1 stills and in-session photographs live in `public/assets/gallery/` and are served at `/assets/gallery/*` with a year-long immutable cache. The `/gallery` page is the full set: catalog plates, in-hand scale stills, and five session photos on PC, DualSense, Xbox, and PlayStation.

Older Cloudflare Images assets remain available through `/media/image` for journal heroes. When video is added, use Cloudflare Stream’s direct player or HLS/DASH manifest URLs so Stream can handle adaptive playback globally; the Worker should not cache or proxy manifests.

The Worker is also configured with remote Cloudflare Images, Media Transformations, and Stream bindings for future assets. When video is added, use Cloudflare Stream’s direct player or HLS/DASH manifest URLs so Stream can handle adaptive playback globally; the Worker should not cache or proxy manifests.

## Content and SEO

The homepage includes a journal hub with evergreen buyer’s guides, setup advice, comfort notes, care instructions, and game-night ideas. Each guide has its own route with a canonical URL, social preview metadata, Article and Breadcrumb structured data, and a Cloudflare Images hero asset. The Worker also serves `robots.txt`, `sitemap.xml`, `/gallery`, and a small web manifest so crawlers and share previews can discover the site cleanly. After deploy, `npm run indexnow` pings IndexNow with the sitemap.

