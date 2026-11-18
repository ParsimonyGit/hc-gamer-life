# Public social following

- **Agent:** HCGL Growth
- **Research date:** Tuesday, Nov 17, 2026, 1:16 PM CT (America/Chicago)
- **Filed:** Nov 18, 2026 (America/Chicago)
- **Purpose:** Exact public follower and subscriber counts for a DojoMojo brand application ("total social following").
- **Method:** Read-only. No posts, follows, likes, or messages. A count is included only when a source displayed a number. Nothing here is estimated.

Handles came from the live hcgamerlife.com footer and from the Shopify theme social links and channel briefs. The Twitch handle Tezlin is in those briefs and was on the live channel (the description, and a social link named "hcgamerlife").

The Shopify email list (710 subscribers) is not a social-following number. It is not in the total.

## Summary

| Platform | Account | URL | Count | Metric | Source | In the exact total? |
|---|---|---|---|---|---|---|
| Facebook Page | HCGamerLife.com / @HCGamerlife | https://www.facebook.com/HCGamerlife | 5.5K | followers, rounded | Facebook's official page plugin, live | No. Not an exact integer. |
| Facebook Page | same | same | 5,562 | likes | SocialBlade, updated 1:13 PM CT, Nov 17, 2026 | Optional third-party integer only. |
| Twitch | Tezlin | https://www.twitch.tv/tezlin | 7 | followers | Twitch GQL `user.followers.totalCount`. TwitchTracker also showed 7. | Yes |
| YouTube | HC GamerLife | https://www.youtube.com/@hcgamerlife5423 | 10 | subscribers | Channel About page, `subscriberCountText`: "10 subscribers" | Yes |
| X | @HCGamerLife | https://x.com/HCGamerLife (footer also uses https://twitter.com/HCGamerLife) | 76 | followers | X official `public_metrics.followers_count` | Yes |
| Instagram | @hc_gamerlife | https://www.instagram.com/hc_gamerlife/ | Could not be read | followers | Footer link is live. Unauthenticated profile, embed, and `web_profile_info` returned no count. | No |
| Pinterest | hcgamerlife | https://www.pinterest.com/hcgamerlife/ (footer uses http) | 91 | followers | Pinterest profile `UserResource` `follower_count` | Yes |
| TikTok | — | Not linked from the site. `@hcgamerlife` and `@hc_gamerlife` both say the account was not found. | — | — | TikTok profile pages | No |
| YouTube, family / MCC | — | Handle not in the footer, the theme links, or Twitch socials | Could not be identified | subscribers | Notes below | No |

**Exact integers we could verify: Twitch 7 + YouTube 10 + X 76 + Pinterest 91 = 184.**

Facebook stays out of that sum. The official source only exposes a rounded 5.5K followers. SocialBlade's same-day 5,562 likes fits a 5.5K rounded display, but it is a third-party likes figure, not an official exact follower count.

If an application forces one number and the SocialBlade likes integer is the only exact Facebook figure on hand: 5,562 + 184 = 5,746. Label that sum as including SocialBlade likes. It is not an official Facebook follower count. Instagram and the family YouTube channel are not in either total.

## Accounts

### Facebook — https://www.facebook.com/HCGamerlife

- Plugin page name: HCGamerLife.com. Username: HCGamerlife.
- Page IDs seen in Facebook and SocialBlade markup: `100066920415677` (plugin `pageID`); `559145197521691` (plugin `pageURL` and SocialBlade `creator_id`).
- Plugin description: "We sell gaming accessories for consoles (ps4, xbox one) and PC's. We are gamers ourselves and want t…"
- Followers, official, rounded: `followerCountFormatted` 5.5K, from `https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/HCGamerlife`. The plugin did not include an unrounded integer. Direct facebook.com, mbasic, and Graph API fetches were blocked or needed an app token (HTTP 400 or Graph `#200`).
- Likes, third-party, exact: 5,562 on https://socialblade.com/facebook/page/hcgamerlife. `dataUpdatedAt` converts to 1:13 PM CT, Nov 17, 2026. The on-page 14-day table's last row is also 5,562 likes, dated 2026-09-19.
- Likes and followers are not the same number. They are listed separately on purpose.

### Twitch — https://www.twitch.tv/tezlin

- Display name Tezlin. Login `tezlin`. User id `15580327`. Created 2010-09-13.
- Description: "40+ year old gamer. Usually play with my brothers, lots of laughs, much sarcasm. An occasional outplay, riddled with constant inting."
- Channel social: title "I sell stuff", name `hcgamerlife`.
- Not partner or affiliate.
- Followers: 7, from Twitch GQL `followers.totalCount`. TwitchTracker (https://twitchtracker.com/tezlin) showed 7. Its "Updated" stamp was `2026-11-17 19:12:19` with no timezone on the page. That clock time is 1:12 PM CT if the stamp is UTC.
- The official channel HTML is a JavaScript shell and did not print the count. The recent VOD list was empty. No YouTube URL is attached to the channel's `socialMedias`.

### YouTube — HC GamerLife — https://www.youtube.com/@hcgamerlife5423

- Also https://www.youtube.com/channel/UCVXDMD5nhn0NX5j9ZSmPQ-Q
- Title: HC GamerLife. Joined Mar 8, 2015.
- Subscribers: 10. About page text: "10 subscribers."
- 8 videos. 1,034 views.
- Not in the live footer (Facebook, X, Pinterest, Instagram). Found by a public search for the brand name. It matches the brand.

### YouTube — family / MCC, not identified

Internal briefs mention a separate family / MCC channel that Twitch streams go to, and a prior instruction not to post sale content there. That handle is not in the footer, the theme social links, or Tezlin's Twitch socials.

Checked, and not treated as Dennis's channel or the family channel:

- https://www.youtube.com/@TezlinTM (title "Tezlin", 221 subscribers). About `sameAs` links are https://www.twitch.tv/milkytezlin and https://x.com/Milky_Shakesz, not twitch.tv/tezlin. A different person. Do not add the 221.
- https://www.youtube.com/@tezlin (5 subscribers, 1 video, 264 views, joined Nov 14, 2007, no description and no HCGL or Twitch links). Same login string only. Ownership not verified. The 5 is not included.
- The theme video `https://www.youtube.com/watch?v=dWpFe2BRtgY` is a review by Kevin The Tech Ninja (`@Techninjaspeaks`). It is not an HCGL channel.

### X — https://x.com/HCGamerLife

- Footer link: https://twitter.com/HCGamerLife. Site meta `twitter:site` is `@HCGamerLife`.
- Name: HC GamerLife. User id `3035270168`. Created 2015-02-21. Not verified.
- Bio: "Gaming accessories for Hardcore Gamers, a company founded and run by a hardcore PC/Console Gamer."
- Followers: 76 (`public_metrics.followers_count`). Also listed: 208 following, 718 posts, 22 media, 18 likes.

### Instagram — https://www.instagram.com/hc_gamerlife/

- Linked from the live footer.
- Unauthenticated requests go to a login or error route. The embed did not return profile metrics. `web_profile_info` returned HTTP 404 HTML. The Facebook plugin had `pageInstagram: null`.
- The follower count could not be read. Do not treat the account as deleted, and do not enter zero.

### Pinterest — https://www.pinterest.com/hcgamerlife/

- Footer uses http. The HTTPS profile loads. Domain hcgamerlife.com is verified on the profile.
- Display name HC GamerLife. Username `hcgamerlife`. User id `452119387499972413`. Created 2015-02-21.
- Followers: 91 (`follower_count`). Also 68 following and 102 pins. Last pin save on the profile object: 2016-02-18.

### TikTok

- Not linked from hcgamerlife.com.
- https://www.tiktok.com/@hcgamerlife and https://www.tiktok.com/@hc_gamerlife both showed "Couldn't find this account."
- No official TikTok count to include.

## For the DojoMojo form

- Conservative exact total, excluding Facebook's rounded figure and excluding anything we could not read: **184**.
- Almost all of the reachable public audience is the Facebook Page: **5.5K followers** official and rounded, **5,562 likes** on SocialBlade that day.
- Do not add the 710-person email list.
- Do not add @TezlinTM's 221 YouTube subscribers.
- List Instagram as "not publicly readable on Nov 17, 2026," not as zero.
