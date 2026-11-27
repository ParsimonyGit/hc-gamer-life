import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  IWS_EMAILED_TAG,
  IWS_FROM,
  IWS_LOCATION_GID,
  IWS_LOCATION_REST_ID,
  IWS_TO,
  buildIwsLabelEmail,
  bytesToBase64,
  decideIwsLabelEmail,
  emailIwsLabel,
  fulfillmentGid,
  handleIwsLabelWebhook,
  hasSkipTag,
  isIwsLocation,
  orderGid,
  parseAdminOrder,
  verifyShopifyHmac,
  type IwsOrder,
  type LabelFulfillment
} from "./iws-label.ts";

function fulfillment(overrides: Partial<LabelFulfillment> = {}): LabelFulfillment {
  return {
    id: "gid://shopify/Fulfillment/99",
    locationId: IWS_LOCATION_GID,
    locationName: "IWS Fulfillment (Pocatello)",
    trackingNumber: "1Z999",
    trackingCompany: "FedEx",
    trackingUrl: "https://example.test/1Z999",
    shippingDocuments: [{ url: "https://example.test/label.pdf", documentType: "LABEL", format: "PDF" }],
    ...overrides
  };
}

function order(overrides: Partial<IwsOrder> = {}): IwsOrder {
  return {
    id: "gid://shopify/Order/1",
    name: "#21760",
    tags: [],
    shipTo: "Ada Buyer\n1 Main St\nPocatello ID 83201\nUS",
    fulfillments: [fulfillment()],
    ...overrides
  };
}

describe("IWS label targeting", () => {
  it("maps REST ids onto Shopify GIDs", () => {
    assert.equal(orderGid(7134898225223), "gid://shopify/Order/7134898225223");
    assert.equal(fulfillmentGid("gid://shopify/Fulfillment/9"), "gid://shopify/Fulfillment/9");
  });

  it("recognizes the Pocatello location", () => {
    assert.equal(isIwsLocation(IWS_LOCATION_REST_ID), true);
    assert.equal(isIwsLocation(1, IWS_LOCATION_GID), true);
    assert.equal(isIwsLocation(1, "gid://shopify/Location/1"), false);
  });

  it("skips Whatnot, giveaway, and already-emailed orders", () => {
    assert.equal(hasSkipTag(["whatnot", "giveaway"]), true);
    assert.equal(hasSkipTag(["do-not-email"]), true);
    assert.equal(hasSkipTag([IWS_EMAILED_TAG]), true);
    assert.equal(hasSkipTag(["review"]), false);
  });

  it("emails IWS when a label PDF is on an IWS fulfillment", () => {
    const decision = decideIwsLabelEmail({ id: 99, order_id: 1, location_id: IWS_LOCATION_REST_ID }, order());
    assert.equal(decision.action, "email");
    if (decision.action === "email") {
      assert.equal(decision.fulfillment.shippingDocuments[0]?.url, "https://example.test/label.pdf");
    }
  });

  it("does not email CJ or other locations", () => {
    const decision = decideIwsLabelEmail(
      { id: 99, order_id: 1, location_id: 22 },
      order({ fulfillments: [fulfillment({ locationId: "gid://shopify/Location/22", locationName: "CJ" })] })
    );
    assert.deepEqual(decision, { action: "ignore", reason: "not_iws_location" });
  });

  it("does not buy a second path for prepaid Whatnot giveaways", () => {
    const decision = decideIwsLabelEmail(
      { id: 99, order_id: 1, location_id: IWS_LOCATION_REST_ID },
      order({ tags: ["whatnot", "giveaway", "do-not-email"] })
    );
    assert.deepEqual(decision, { action: "ignore", reason: "skipped_tag" });
  });

  it("retries when the label PDF is not on the fulfillment yet", () => {
    const decision = decideIwsLabelEmail(
      { id: 99, order_id: 1, location_id: IWS_LOCATION_REST_ID },
      order({ fulfillments: [fulfillment({ shippingDocuments: [] })] })
    );
    assert.deepEqual(decision, { action: "retry", reason: "label_not_ready" });
  });
});

describe("IWS label email", () => {
  it("builds a warehouse email with the PDF attached and no Shopify login needed", () => {
    const message = buildIwsLabelEmail(order(), fulfillment(), [
      { filename: "shipping-label-21760.pdf", contentBase64: "JVBERg==", mimeType: "application/pdf" }
    ]);
    assert.equal(message.from, IWS_FROM);
    assert.deepEqual(message.to, [...IWS_TO]);
    assert.match(message.subject, /#21760/);
    assert.match(message.text, /do not need Shopify login/i);
    assert.equal(message.attachments[0]?.filename, "shipping-label-21760.pdf");
    assert.doesNotMatch(message.text, /\$40|warranty|2-year/i);
  });

  it("encodes PDF bytes as base64", () => {
    assert.equal(bytesToBase64(new Uint8Array([0x25, 0x50, 0x44, 0x46])), "JVBERg==");
  });

  it("parses Admin order nodes into ship-to text and documents", () => {
    const parsed = parseAdminOrder({
      id: "gid://shopify/Order/1",
      name: "#21760",
      tags: [],
      shippingAddress: {
        name: "Ada Buyer",
        address1: "1 Main St",
        city: "Pocatello",
        provinceCode: "ID",
        zip: "83201",
        countryCodeV2: "US"
      },
      fulfillments: [
        {
          id: "gid://shopify/Fulfillment/99",
          location: { id: IWS_LOCATION_GID, name: "IWS Fulfillment (Pocatello)" },
          shippingLabel: {
            trackingInfo: { number: "1Z999", company: "FedEx", url: "https://example.test/1Z999" },
            shippingDocuments: [{ url: "https://example.test/label.pdf", documentType: "LABEL", format: "PDF" }]
          }
        }
      ]
    });
    assert.match(parsed.shipTo, /Ada Buyer/);
    assert.equal(parsed.fulfillments[0]?.shippingDocuments[0]?.format, "PDF");
  });

  it("downloads the PDF, sends it, then tags the order so retries do not double-send", async () => {
    const sent: unknown[] = [];
    const tagged: string[][] = [];
    const pdf = new TextEncoder().encode("%PDF-1.4 test");
    const result = await emailIwsLabel({
      webhook: { id: 99, order_id: 1, location_id: IWS_LOCATION_REST_ID },
      admin: {
        async fetchOrder() {
          return order();
        },
        async addTags(_id, tags) {
          tagged.push(tags);
        }
      },
      downloader: {
        async download() {
          return pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength);
        }
      },
      mailer: {
        async send(message) {
          sent.push(message);
        }
      }
    });
    assert.deepEqual(result, { ok: true, emailed: "#21760" });
    assert.equal((sent[0] as { attachments: Array<{ mimeType: string }> }).attachments[0]?.mimeType, "application/pdf");
    assert.deepEqual(tagged, [[IWS_EMAILED_TAG]]);
  });
});

describe("IWS webhook HTTP", () => {
  it("rejects unsigned webhooks", async () => {
    const response = await handleIwsLabelWebhook(
      new Request("https://hcgamerlife.org/api/shopify/iws-label", {
        method: "POST",
        headers: { "x-shopify-hmac-sha256": "nope" },
        body: "{\"id\":1}"
      }),
      {
        SHOPIFY_WEBHOOK_SECRET: "secret",
        SHOPIFY_ADMIN_TOKEN: "token",
        IWS_GMAIL_SCRIPT_URL: "https://script.google.com/macros/s/test/exec",
        IWS_GMAIL_SCRIPT_SECRET: "mail-secret"
      }
    );
    assert.equal(response.status, 401);
  });

  it("accepts a matching Shopify HMAC", async () => {
    const payload = '{"hello":"shopify"}';
    const ok = await verifyShopifyHmac(
      payload,
      "nY5kK8lYlOa1n0mYk2mX2oQqQqQqQqQqQqQqQqQqQk=",
      "secret"
    );
    const real = await hmacB64(payload, "secret");
    assert.equal(await verifyShopifyHmac(payload, real, "secret"), true);
    assert.equal(ok, false);
  });
});

async function hmacB64(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign"
  ]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}
