import { BUSINESS_ADDRESS, CONTACT_EMAIL, GOB_SALE_TERMS, SALE_PRICE_LABEL, COMPARE_AT_LABEL, SHIPPING_LABEL, SUPPORT_EMAIL } from "./sale.ts";

const SITE_URL = "https://hcgamerlife.org";

export type LegalKind = "terms" | "privacy";

export function legalKind(pathname: string): LegalKind | null {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/terms" || path === "/terms-of-service") return "terms";
  if (path === "/privacy" || path === "/privacy-policy") return "privacy";
  return null;
}

const PAGE_STYLES = `
:root { color-scheme: dark; --ink:#f5efe4; --muted:#b4ac9f; --line:rgba(245,239,228,.16); --bg:#14110f; --red:#ff4f5e; --secondary:#6bc9ff; --max:760px; }
* { box-sizing: border-box; }
body { margin:0; background:radial-gradient(circle at 90% 0%, rgba(255,79,94,.14), transparent 24rem), var(--bg); color:var(--ink); font-family:"Avenir Next","Century Gothic","Trebuchet MS",sans-serif; line-height:1.6; }
a { color:var(--secondary); }
.wrap { margin:0 auto; max-width:var(--max); padding:0 22px; }
header { align-items:center; display:flex; justify-content:space-between; padding:28px 0 10px; }
.brand { align-items:center; color:var(--ink); display:inline-flex; font-weight:800; gap:10px; letter-spacing:-.04em; text-decoration:none; }
.brand-mark { align-items:center; background:var(--red); border-radius:10px; color:#210a10; display:inline-flex; font-size:.78rem; height:32px; justify-content:center; width:36px; }
.back { color:var(--muted); font-size:.92rem; }
h1 { font-family:"Bodoni 72",Didot,Georgia,serif; font-size:clamp(2.4rem,6vw,4.2rem); font-weight:500; letter-spacing:-.05em; line-height:.95; margin:12px 0; }
.updated { color:var(--secondary); font-size:.78rem; font-weight:800; letter-spacing:.14em; text-transform:uppercase; }
.prose h2 { font-size:1.35rem; letter-spacing:-.03em; margin:1.6em 0 .4em; }
.prose p, .prose li { color:#ddd6c8; font-size:1.05rem; }
.prose ul { padding-left:1.2rem; }
.sale { background:rgba(255,79,94,.08); border:1px solid rgba(255,79,94,.35); border-radius:4px 18px 4px 18px; color:#f5efe4; padding:14px 16px; }
footer { border-top:1px solid var(--line); color:var(--muted); font-size:.88rem; margin-top:36px; padding:22px 0 40px; }
footer a { color:inherit; }
`;

function layout(kind: LegalKind, title: string, body: string): string {
  const path = kind === "terms" ? "/terms" : "/privacy-policy";
  const description = kind === "terms"
    ? `Terms for buying the HCG1 Pro from HC GamerLife. ${GOB_SALE_TERMS}`
    : "Privacy Policy for hcgamerlife.org, including quiz, checkout, returns, and support.";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${SITE_URL}${path}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title>${title} | HC GamerLife</title>
    <style>${PAGE_STYLES}</style>
  </head>
  <body>
    <div class="wrap">
      <header>
        <a class="brand" href="/"><span class="brand-mark">HC</span> GAMERLIFE</a>
        <a class="back" href="/">Back home</a>
      </header>
      <main class="prose">
        <p class="updated">Last updated October 31, 2026</p>
        <h1>${title}</h1>
        ${body}
      </main>
      <footer>HC GamerLife · ${BUSINESS_ADDRESS} · <a href="/terms">Terms</a> · <a href="/privacy-policy">Privacy</a></footer>
    </div>
  </body>
</html>`;
}

function termsBody(): string {
  return `<p>These Terms and Conditions ("Terms") apply to your use of hcgamerlife.org (the "Site") and to any purchase from HC GamerLife ("HC GamerLife," "we," "us," or "our"), a Washington business. By using the Site or placing an order, you agree to these Terms and to our <a href="/privacy-policy">Privacy Policy</a>.</p>
<p class="sale"><strong>${GOB_SALE_TERMS}</strong> There is no fixed end date. The HCG1 and the HCG1 Pro are the same headset.</p>
<h2>1. Who can use the Site</h2>
<p>You must be at least 18 years old, or the age of majority where you live, to buy from us. If you are younger, a parent or guardian must use the Site with you and place the order. You agree not to use the Site for anything unlawful, to interfere with its security, or to submit false information.</p>
<h2>2. Products and pricing</h2>
<p>We sell the HCG1 Pro wired gaming headset. The HCG1 and the HCG1 Pro are the same headset. The current going-out-of-business price is <strong>${SALE_PRICE_LABEL}</strong> (compare-at / former price ${COMPARE_AT_LABEL}). The sale runs while supplies last and has no fixed end date. We try to describe products, specifications, and photos accurately. Colors and details can look slightly different on different screens. Prices are in U.S. dollars and may change without notice, but a price change will not affect an order we have already accepted. If an item is listed at an obviously wrong price, we may cancel the order and refund you in full.</p>
<h2>3. Orders and payment</h2>
<p>Your order is an offer to buy. We accept it when we ship it or confirm it. We may limit quantities or cancel an order, for example because of suspected fraud, pricing errors, an address outside the continental United States, or stock problems. If we cancel, we refund any amount charged. Payments are processed by Stripe. You agree to give accurate billing and shipping details. Applicable sales tax is added at checkout.</p>
<h2>4. Shipping</h2>
<p>Shipping is <strong>${SHIPPING_LABEL} flat</strong>. We ship to the continental United States only. Alaska, Hawaii, and U.S. territories are outside this sale. Orders to those places may be canceled and refunded. The Site does not ship outside the United States. Delivery estimates are not guaranteed. Title and risk of loss pass to you when the carrier delivers the order. If your package arrives damaged or never arrives, email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
<h2>5. Going-out-of-business sale terms</h2>
<p>Headsets in this sale are <strong>sold without a warranty</strong>.</p>
<ul>
<li><strong>30-day returns.</strong> You may return the headset within 30 days of delivery. You pay return shipping unless the unit is defective.</li>
<li><strong>Defective units.</strong> Defective units are replaced within 90 days. If the unit is defective, HC GamerLife covers return shipping.</li>
<li>These terms apply to current sales. Orders already accepted keep the terms posted at the time of that order.</li>
</ul>
<h2>6. How to start a return or replacement</h2>
<p>Email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> before you ship anything. Include your order number as text you can copy (not only as an attachment), the shipping address for a replacement or for pickup of a defective unit, and a phone number. Do not mail returns to the Seattle address below. Returns sent there are refused. We will email instructions.</p>
<h2>7. No warranty on the sale</h2>
<p>Except for the 30-day return and the 90-day defective-unit replacement in Section 5, the headset is sold without a warranty. Nothing in these Terms limits rights the law does not allow us to waive. Apart from the product, the Site and its content (quiz results, journal articles, and guides) are offered as-is for general information. We do not promise the Site will always be available or free of errors.</p>
<h2>8. Limitation of liability</h2>
<p>To the extent the law allows, HC GamerLife is not liable for indirect, incidental, special, or consequential damages arising from your use of the Site. For any claim about a product, our total liability is limited to the amount you paid for that product. The return and replacement terms above remain available. Some states do not allow these limits, so they may not apply to you. Nothing in these Terms limits liability for personal injury caused by our negligence, or for fraud.</p>
<h2>9. Safe use</h2>
<p>Listen at a moderate volume. Long exposure to loud sound can damage hearing. Do not use the headset while driving or anywhere you need to hear your surroundings.</p>
<h2>10. Intellectual property</h2>
<p>The Site's content, including text, photos, logos, the HC GamerLife and HCG1 names, and the quiz, belongs to HC GamerLife or its licensors. You may not copy or reuse it for commercial purposes without our written permission.</p>
<h2>11. Third-party services and links</h2>
<p>The Site uses third-party services such as Stripe and may link to other websites. We are not responsible for their content or practices, and their own terms apply.</p>
<h2>12. Marketing communications</h2>
<p>If you opt in through the quiz or at checkout, we may email you offers and updates. You can unsubscribe at any time.</p>
<h2>13. Governing law and disputes</h2>
<p>These Terms are governed by the laws of the State of Washington, without regard to its conflict-of-law rules. Before filing any claim, please contact us so we can try to resolve it informally. Any dispute that is not resolved will be heard in the state or federal courts in King County, Washington. You may also bring a claim in small claims court where you live. This section does not take away any consumer protections you have under your local law.</p>
<h2>14. Changes</h2>
<p>We may update these Terms. The version posted at the time of your order applies to that order.</p>
<h2>15. Contact</h2>
<p>HC GamerLife<br />${BUSINESS_ADDRESS}<br />Returns and defective units: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a><br />Other questions: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>`;
}

function privacyBody(): string {
  return `<p>This Privacy Policy explains how HC GamerLife ("HC GamerLife," "we," "us," or "our") collects, uses, and shares personal information when you visit hcgamerlife.org (the "Site"), take our Gamer Audio Profile quiz, or buy from us. HC GamerLife is a Washington business that sells online only. Purchases are covered by our <a href="/terms">Terms</a>, including this sale: ${GOB_SALE_TERMS}</p>
<h2>1. Information we collect</h2>
<p><strong>Information you give us</strong></p>
<ul>
<li><strong>Quiz:</strong> If you finish the Gamer Audio Profile quiz, we collect your email address, your first name (optional), your quiz answers (such as platform, play style, session length, and comfort or audio issues), and whether you checked the box to get marketing emails.</li>
<li><strong>Orders:</strong> When you buy, we collect your name, email address, shipping and billing address, phone number (if you give it), and the items and quantity you order.</li>
<li><strong>Support:</strong> If you email us, we keep your message and any details you include, such as your order number, to help with returns, defective-unit replacements, and questions.</li>
</ul>
<p><strong>Payment information.</strong> Checkout is handled by Stripe, Inc. Your card details go directly to Stripe and are never stored on our servers. We get limited payment details from Stripe, such as the payment status, card brand, and last four digits. Stripe's privacy policy is at <a href="https://stripe.com/privacy">https://stripe.com/privacy</a>.</p>
<p><strong>Information collected automatically.</strong> Like most websites, our servers and hosting provider log technical details when you visit, such as your IP address, browser type, device, pages viewed, referring page, and the time of the visit. Stripe may set cookies or use similar technologies during checkout for fraud prevention and security.</p>
<h2>2. How we use your information</h2>
<ul>
<li>To provide your quiz results and recommend products.</li>
<li>To process, ship, and support your orders, including 30-day returns and replacement of defective units within 90 days.</li>
<li>To answer your questions and keep in touch about your orders.</li>
<li>To send marketing emails, <strong>only if you opted in</strong>. You can unsubscribe at any time with the link in any email or by emailing us.</li>
<li>To prevent fraud, keep the Site secure, and fix problems.</li>
<li>To meet legal, tax, and accounting obligations.</li>
</ul>
<h2>3. How we share your information</h2>
<p>We do not sell your personal information. We do not share it for cross-context behavioral advertising. We share it only with:</p>
<ul>
<li><strong>Service providers</strong> that work for us. These include Stripe (payments), our website host, HighLevel (GoHighLevel), our email and customer-relationship provider, which stores quiz responses and sends emails, our fulfillment warehouse IWS Fulfillment (Pocatello, Idaho) for shipping orders, and shipping carriers.</li>
<li><strong>Legal and safety:</strong> to comply with the law, respond to lawful requests, or protect our rights, customers, or others.</li>
<li><strong>Business transfers:</strong> if our business is sold or merged, along with the business assets.</li>
</ul>
<h2>4. Data retention</h2>
<p>We keep order records for as long as we need them for support, tax, and accounting purposes (generally 7 years). We keep quiz and marketing data until you unsubscribe or ask us to delete it. We keep server logs for a limited time.</p>
<h2>5. Cookies</h2>
<p>The Site itself does not use advertising cookies. Stripe may use cookies that are needed for secure checkout. You can block cookies in your browser settings, but checkout may not work without them.</p>
<h2>6. Your choices and rights</h2>
<ul>
<li><strong>Marketing emails:</strong> unsubscribe at any time.</li>
<li><strong>Access, correction, deletion:</strong> email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> to ask for a copy of your data, a correction, or deletion. Depending on where you live (for example, Washington under the My Health My Data Act where it applies, or California, Colorado, Virginia, the EU, or the UK), you may have more rights, including the right to appeal our decision. We will verify your request and respond within the time the law requires. We will not discriminate against you for using these rights.</li>
<li><strong>Do Not Track / Global Privacy Control:</strong> we do not sell or share data for targeted ads, so no opt-out is needed. We honor GPC signals as an opt-out where the law requires it.</li>
</ul>
<h2>7. Children</h2>
<p>The Site is not directed to children under 13. We do not knowingly collect their personal information. If you believe a child has given us information, contact us and we will delete it.</p>
<h2>8. Security</h2>
<p>We use reasonable safeguards, including HTTPS and a PCI-compliant payment processor. No method of transmission or storage is 100% secure.</p>
<h2>9. International visitors</h2>
<p>We are based in the United States, and your information is processed in the U.S.</p>
<h2>10. Changes</h2>
<p>We may update this policy. The date at the top shows the latest version. If we make a material change, we will post a notice on the Site.</p>
<h2>11. Contact us</h2>
<p>HC GamerLife<br />${BUSINESS_ADDRESS}<br />Email: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><br />Returns and defective units: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>`;
}

const HEADERS = {
  "content-type": "text/html; charset=UTF-8",
  "cache-control": "public, max-age=0, must-revalidate",
  "content-security-policy": "default-src 'self'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "strict-transport-security": "max-age=31536000"
};

export function renderLegalPage(kind: LegalKind): Response {
  const title = kind === "terms" ? "Terms and Conditions" : "Privacy Policy";
  const html = layout(kind, title, kind === "terms" ? termsBody() : privacyBody());
  return new Response(html, { headers: HEADERS });
}
