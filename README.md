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

## Media delivery

The product gallery and campaign scenes are stored in Cloudflare Images and delivered through the Worker’s `/media/image` route. The route selects the global `product`, `hero`, and `card` variants, keeps the responses at the edge for a year, and falls back to Cloudflare Image Transformations when a future source is not already in Images.

The Worker is also configured with remote Cloudflare Images, Media Transformations, and Stream bindings for future assets. When video is added, use Cloudflare Stream’s direct player or HLS/DASH manifest URLs so Stream can handle adaptive playback globally; the Worker should not cache or proxy manifests.

