# Outbound send plan

- **Agent:** HCGL Growth
- **Date:** Nov 18, 2026 (America/Chicago)
- **Status:** sequenced proposal for orchestrator row 4. Email 1 is retired. Email 3 is assigned and was not sent (no Shopify Email send API). Honey was already sent by the orchestrator. Nothing else in this plan has been sent.
- **Copy source:** `docs/agents/hcgamerlife-org/2026-11-18-copy-kit.md` on `main` (Email 3 added Nov 18, 2026). This plan does not edit that file.
- **From address, when mail leaves the building:** dennis@hcgamerlife.com. Do not send the list from Gmail.

Row 5 (Google Merchant Center and Amazon B07BHYZFLF) is Dennis plus Growth. It is not a row in the table below. Do not relist Amazon from this plan.

## Gate on every row

All three, every time:

1. Dennis's explicit yes for that send or submission.
2. Duplicate check against ERP task notes, so a task already marked sent does not go out again.
3. The `/go/` link checked again that day. It must return HTTP 302 to the Shopify HCG1 product with `utm_campaign=gob-bf-2026`.

Checked Nov 18, 2026 (America/Chicago), HEAD requests only. Each URL below did that. Medium varies by channel (`email`, `coupon-site`, `social`, `creator`, `outreach`, or `referral`). Do not treat this paragraph as tomorrow's check.

Paste from the copy kit. Where the kit's first line is a closing line, use the replacement in flag (a) instead. Black Friday leads. Final stock stays in the sale terms.

## Sequence

| # | Channel | Copy-kit section | Owner | Target (America/Chicago) | Link |
|---|---|---|---|---|---|
| — | Shopify Email 1 | Retired. Do not send. | Nobody | — | Do not use https://hcgamerlife.org/go/email?c=bf-launch for a new blast |
| 1 | Shopify Email 3 | Shopify Email 3 | HCGL Growth, in Shopify Email. Not sent yet. See below. | Nov 18, 2026, as soon as someone can open Shopify Email | https://hcgamerlife.org/go/email?c=reviews-shipping |
| 2 | Gleam post-entry | Gleam post-entry | Growth pastes into Gleam. Dennis says yes. | Nov 18, 2026. The sell-through brief says campaign xhGWu closes Nov 19. Confirm that date inside Gleam before relying on it. | https://hcgamerlife.org/go/gleam |
| 3 | Coupon sites | Coupon listing | Growth fills the forms. Dennis says yes per site. | Nov 19, 2026. | RetailMeNot https://hcgamerlife.org/go/retailmenot · CouponBirds https://hcgamerlife.org/go/couponbirds · Dealspotr https://hcgamerlife.org/go/dealspotr · Knoji https://hcgamerlife.org/go/knoji · WeThrift https://hcgamerlife.org/go/wethrift |
| 4 | Honey | Honey email | Already sent. Do not send again. | Done Nov 18 by the orchestrator, from tezlin007@gmail.com to deals@joinhoney.com. | https://hcgamerlife.org/go/honey |
| 5 | Reddit | Reddit | Growth drafts. Dennis posts. One sub at a time. | Nov 19 or Nov 20, 2026, after the sub's rules are read. | https://hcgamerlife.org/go/reddit?c=buildapcsales |
| 6 | Creator Collabs | Creator Collabs (15%) | Growth prepares invites. Dennis approves the install, turns open access off, and approves each invite. | Nov 20, 2026. | https://hcgamerlife.org/go/creator-{handle} |
| 7 | Coaches and clubs | Coaches and clubs | Growth builds the list and the note. Dennis approves each batch. | Nov 21, 2026, or as soon as the list is deduped. Schools go quiet in mid-December. | https://hcgamerlife.org/go/coach?c=bf70 |
| 8 | Lettergrowth | Lettergrowth / newsletter pitch | Growth drafts. Dennis sends. | Nov 20, 2026. | https://hcgamerlife.org/go/lettergrowth |
| 9 | Branduo | Branduo / partner swap blurb | Growth drafts. Dennis sends or posts the swap. | Nov 20, 2026. | https://hcgamerlife.org/go/branduo |
| 10 | Shopify Email 2, last call | Shopify Email 2 | Growth pastes into Shopify Email. Dennis says yes. | Nov 30, 2026, morning CT. Not a second email on Nov 20. | https://hcgamerlife.org/go/email?c=lastcall |
| 11 | SMS | SMS | Nobody, unless a compliant opted-in list already exists. | No date until that list is confirmed. If it does not exist, skip. | https://hcgamerlife.org/go/email?c=sms |

## Shopify Email 3 (assigned, not sent)

Dennis assigned this send to HCGL Growth on Nov 18, 2026. Do not send Email 1. The Oct 31 Shopify Email already told the list the closeout price. A one-unit subject that says $52 is a worse headline than that earlier email. Do not put $52 in this subject.

Checked Nov 18, 2026 (America/Chicago):

- `https://hcgamerlife.org/go/email?c=reviews-shipping` returned HTTP 302 to the Shopify HCG1 product with `utm_campaign=gob-bf-2026` and `utm_content=reviews-shipping`.
- `https://hcgamerlife.org/quiz` returned HTTP 200.
- Email subscribers (`email_subscription_status = 'SUBSCRIBED'`, segment "Email subscribers"): **813**. The older ~710 figure is stale. No segment named for quiz contacts showed up. Use the Email subscribers segment.
- Admin GraphQL cannot deliver a Shopify Email campaign. `marketingActivityCreate` only records an external marketing activity. It does not mail anyone. Gmail was not used. The connected app's marketing-activity list was empty, which does not prove whether Shopify Email itself has a draft.

The campaign still has to be created in Shopify admin → Marketing → Shopify Email, to the Email subscribers segment. Paste the kit's Email 3. The October price in the squad sentence is the kit's comparison to the email they already received. It is not the current one-unit price.

**Subject:** Shipping is free now. Here's what 485 Amazon reviews actually said.

**Preheader:** Last time shipping was $12. Continental US is free. New product page with the real reviews.

Hi {first_name},

Last email was the closeout. This one is new:

1. Shipping is free in the continental US (it was $12).
2. Orders ship from Idaho, usually in 1–2 business days.
3. We put the Amazon reviews on the product page: 4.2 out of 5 from 485 ratings. Metal build, long-session comfort, clear party chat.

If you are buying one headset, use code BF60 at Shopify checkout (60% off the $129.99 list).
If you are gearing a squad of 5 or more, code BF70 is about $39 each — lower than the $40 we emailed in October.

Codes end Nov 30, 2026 at 11:59 PM CT. BF60 and BF70 cannot be combined with other codes. Final stock. Sold without warranty. 30-day returns (you pay return shipping unless the unit is defective). Defective units replaced within 90 days.

[See the reviews](https://hcgamerlife.org/go/email?c=reviews-shipping)

Not sure if it fits your nights? [Four taps](https://hcgamerlife.org/quiz).

Dennis
HC GamerLife
1037 NE 65th St #80853, Seattle, WA 98115
support@hcgamerlife.com

Two flags before the send button:

- The 485-rating line was not re-opened on Amazon this evening. Check it the moment before send. If the count moved, change the subject and the body, or drop the number.
- The kit's return line says "unless the unit is defective." The store policy also covers damaged or wrong. This paste keeps the kit's sentence. Do not widen it in the email unless Dennis says so.

Coupon forms from the kit: https://www.retailmenot.com/submit · https://www.couponbirds.com/submit-coupon · https://marketplace.dealspotr.com/join/merchants · https://www.wethrift.com/submit

Dealspotr's site returned HTTP 410/403 on Nov 18 (sell-through brief). The `/go/dealspotr` redirect works. Open the merchant form before submitting, and skip the site if it is still down. The kit does not list a Knoji form URL. Find the live submit page that day or skip Knoji. Do not self-post on Slickdeals.

Reddit: disclose "I work with HC GamerLife" in the first comment. Read the rules first. Possible subs in the kit: r/buildapcsales, r/headphones, r/BudgetAudiophile, r/GameSale. Skip any sub that bans vendor posts. Use flag (a) for the opener and flag (b) before the ratings sentence.

Collabs: 15% is the kit's rate. Ship the sample only after Dennis says yes. Tell creators not to describe a warranty.

SMS: send only to a list that already has the right consent. Shopify Messaging SMS is paid per message. Do not turn it on under the no-ad-spend rule unless Dennis accepts that cost. Use the kit text, and keep the full return line if it still fits: the buyer pays return shipping unless the unit is defective, damaged, or wrong, and defective units are replaced within 90 days.

## Copy-kit flags

The kit itself stays as it is. These are the fixes to apply at send time.

### (a) Closing lines lead the wrong way

The Reddit draft opens with "We're closing, so this is final stock." That fights the Black Friday rule. Closing language belongs in the sale terms only.

Do not use that opener. Use this instead, then the kit's spec, price, and terms paragraphs:

> I work with HC GamerLife.
>
> Black Friday on the HCG1 Pro wired headset. Code BF60 is 60% off, about $52 (regular $129.99). Code BF70 is 70% off on 5 or more, about $39 each.
>
> Enter the code at Shopify checkout. Codes end Nov 30, 2026, 11:59 PM CT. Free shipping in the continental US (48 states and DC).
>
> Final stock. We are not restocking. Sold without warranty. 30-day returns (you pay return shipping unless the unit is defective, damaged, or wrong). Defective units replaced within 90 days.

The same lead problem shows up in three other kit sections. Creator Collabs starts with "HC GamerLife is closing." Coaches and clubs start with "We're clearing our last." Branduo starts with "HC GamerLife is clearing its last." On those, lead with Black Friday and the price, and move "Final stock. We are not restocking." into the sale-terms sentence. Lettergrowth, Shopify Email 2, Gleam, and the coupon listings already lead with the offer. Email 1 is retired. Email 3 leads with free shipping and the reviews. Honey was already sent.

### (b) Re-check the Amazon rating the day it is posted

The Reddit draft says the Amazon listing is 4.2 out of 5 from 485 ratings and links https://www.amazon.com/dp/B07BHYZFLF. The holiday traffic note recorded the same figure on Nov 18, 2026, and recorded the listing as currently unavailable.

Do not post that sentence from memory. Open the listing the day of the post. If the count or the stars moved, use what the page shows that day, or drop the sentence. Do not invent a rating. Shopify codes do not apply at Amazon checkout. Relisting is row 5, with Dennis.

### (c) Shopify Messaging automations still use retired copy

Welcome, abandoned checkout, abandoned cart, and browse still say "$40", "closing for good", and "Order by Dec 14". Do not say those. Do not send that copy.

Growth does not edit the kit and does not click these on. Dennis pastes the replacement in Shopify Messaging after the same three gates. Target: Nov 18, 2026, so the retired lines stop, or Nov 19 if the yes slips.

These automations are a small lever. The checkout audit (Shopify `abandonedCheckouts`, Nov 18) found only 2 abandoned checkouts with contact info in 30 days, both for a $24.99 charging stand. Headset abandoners mostly never typed an email. Fix the words anyway.

Checked Nov 18, 2026: each link below returned HTTP 302 with `utm_campaign=gob-bf-2026` and the content tag in the query string.

#### Welcome

- **Subject:** Black Friday: HCG1 Pro about $52 with code BF60
- **Preheader:** 60% off. 70% off 5 or more with BF70. Codes end Nov 30, 11:59 PM CT.
- **Link:** https://hcgamerlife.org/go/email?c=welcome

Hi {first_name},

Welcome. The HCG1 Pro wired headset is on sale for Black Friday.

Code BF60 is 60% off, about $52 (regular $129.99). Code BF70 is 70% off on 5 or more, about $39 each.

Enter the code at Shopify checkout. Codes end Nov 30, 2026, 11:59 PM CT. Free shipping in the continental US (48 states and DC).

53mm drivers, a detachable mic, inline mute, and one 3.5mm plug for PC, PlayStation, and Xbox. The cable is permanently attached, about 3 ft. A removable PC splitter extends it to about 6 ft. No battery to charge.

Final stock. We are not restocking.

Sold without warranty. 30-day returns (you pay return shipping unless the unit is defective, damaged, or wrong). Defective units replaced within 90 days.

[Shop Black Friday](https://hcgamerlife.org/go/email?c=welcome)

HC GamerLife
support@hcgamerlife.com

#### Abandoned checkout

- **Subject:** Your HCG1 Pro checkout is still open
- **Preheader:** Black Friday: about $52 with BF60. Codes end Nov 30, 11:59 PM CT.
- **Link:** https://hcgamerlife.org/go/email?c=abandoned-checkout

Hi {first_name},

Your HCG1 Pro checkout is still open.

Black Friday: code BF60 is about $52 (regular $129.99). On 5 or more, code BF70 is about $39 each. Codes end Nov 30, 2026, 11:59 PM CT.

Free shipping in the continental US (48 states and DC). Final stock. We are not restocking.

Sold without warranty. 30-day returns (you pay return shipping unless the unit is defective, damaged, or wrong). Defective units replaced within 90 days.

[Finish checkout](https://hcgamerlife.org/go/email?c=abandoned-checkout)

Questions: support@hcgamerlife.com

#### Abandoned cart

- **Subject:** Your HCG1 Pro is still in the cart
- **Preheader:** Black Friday code BF60 is about $52. BF70 is about $39 each on 5 or more.
- **Link:** https://hcgamerlife.org/go/email?c=abandoned-cart

Hi {first_name},

The HCG1 Pro is still in your cart.

Black Friday code BF60 takes it to about $52 (regular $129.99). Code BF70 is about $39 each on 5 or more. Codes end Nov 30, 2026, 11:59 PM CT.

Free shipping in the continental US (48 states and DC). Final stock. We are not restocking.

Sold without warranty. 30-day returns (you pay return shipping unless the unit is defective, damaged, or wrong). Defective units replaced within 90 days.

[Return to your cart](https://hcgamerlife.org/go/email?c=abandoned-cart)

Questions: support@hcgamerlife.com

#### Browse

- **Subject:** Black Friday: the HCG1 Pro is about $52
- **Preheader:** Code BF60. Five or more is about $39 each with BF70. Ends Nov 30, 11:59 PM CT.
- **Link:** https://hcgamerlife.org/go/email?c=browse

Hi {first_name},

You were looking at the HCG1 Pro. It is 60% off for Black Friday.

Code BF60 is about $52 (regular $129.99). Code BF70 is about $39 each on 5 or more. Codes end Nov 30, 2026, 11:59 PM CT.

Wired, 53mm drivers, detachable mic, one 3.5mm plug for PC, PlayStation, and Xbox. Free shipping in the continental US (48 states and DC).

Final stock. We are not restocking.

Sold without warranty. 30-day returns (you pay return shipping unless the unit is defective, damaged, or wrong). Defective units replaced within 90 days.

[Shop Black Friday](https://hcgamerlife.org/go/email?c=browse)

Questions: support@hcgamerlife.com
