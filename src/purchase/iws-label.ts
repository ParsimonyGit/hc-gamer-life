/** Email IWS the Shopify shipping-label PDF. They have no admin login. */

export const IWS_LOCATION_REST_ID = 10563462;
export const IWS_LOCATION_GID = "gid://shopify/Location/10563462";
export const IWS_LOCATION_NAME = "IWS Fulfillment (Pocatello)";
export const IWS_EMAILED_TAG = "iws-label-emailed";
export const IWS_SKIP_TAGS = [
  "whatnot",
  "giveaway",
  "do-not-email",
  "internal-transfer",
  "owner-transfer",
  IWS_EMAILED_TAG
] as const;
export const IWS_FROM = "dennis@hcgamerlife.com";
export const IWS_TO = ["robert@iwsfulfillment.com", "kevin@iwsfulfillment.com"] as const;
export const SHOPIFY_ADMIN_API = "https://hc-gamerlife.myshopify.com/admin/api/2026-10/graphql.json";

export type IwsLabelEnv = {
  SHOPIFY_ADMIN_TOKEN?: string;
  SHOPIFY_WEBHOOK_SECRET?: string;
  IWS_GMAIL_SCRIPT_URL?: string;
  IWS_GMAIL_SCRIPT_SECRET?: string;
};

export type ShippingDocument = {
  url: string | null;
  documentType: string;
  format: string | null;
};

export type LabelFulfillment = {
  id: string;
  locationId: string | null;
  locationName: string | null;
  trackingNumber: string | null;
  trackingCompany: string | null;
  trackingUrl: string | null;
  shippingDocuments: ShippingDocument[];
};

export type IwsOrder = {
  id: string;
  name: string;
  tags: string[];
  shipTo: string;
  fulfillments: LabelFulfillment[];
};

export type IwsEmailAttachment = {
  filename: string;
  contentBase64: string;
  mimeType: string;
};

export type IwsEmailMessage = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  attachments: IwsEmailAttachment[];
};

export type IwsDecision =
  | { action: "ignore"; reason: string }
  | { action: "retry"; reason: string }
  | { action: "email"; fulfillment: LabelFulfillment };

export type ShopifyAdmin = {
  fetchOrder: (orderGid: string) => Promise<IwsOrder | null>;
  addTags: (orderGid: string, tags: string[]) => Promise<void>;
};

export type LabelDownloader = {
  download: (url: string) => Promise<ArrayBuffer>;
};

export type IwsMailer = {
  send: (message: IwsEmailMessage) => Promise<void>;
};

export type FulfillmentWebhook = {
  id?: number | string;
  order_id?: number | string;
  location_id?: number | string | null;
  status?: string | null;
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
}

export function orderGid(orderId: number | string): string {
  const raw = String(orderId);
  return raw.startsWith("gid://") ? raw : `gid://shopify/Order/${raw}`;
}

export function fulfillmentGid(fulfillmentId: number | string): string {
  const raw = String(fulfillmentId);
  return raw.startsWith("gid://") ? raw : `gid://shopify/Fulfillment/${raw}`;
}

export function normalizeTags(tags: string[]): string[] {
  return tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
}

export function hasSkipTag(tags: string[]): boolean {
  const set = new Set(normalizeTags(tags));
  return IWS_SKIP_TAGS.some((tag) => set.has(tag));
}

export function isIwsLocation(locationId: number | string | null | undefined, locationGid?: string | null): boolean {
  if (locationId != null && Number(locationId) === IWS_LOCATION_REST_ID) return true;
  if (locationGid && locationGid === IWS_LOCATION_GID) return true;
  return false;
}

function fulfillmentForWebhook(webhook: FulfillmentWebhook, order: IwsOrder | null): LabelFulfillment | undefined {
  if (!order) return undefined;
  const id = webhook.id != null ? fulfillmentGid(webhook.id) : "";
  return order.fulfillments.find((row) => row.id === id) || order.fulfillments[0];
}

export function decideIwsLabelEmail(webhook: FulfillmentWebhook, order: IwsOrder | null): IwsDecision {
  const fulfillment = fulfillmentForWebhook(webhook, order);
  const iws =
    isIwsLocation(webhook.location_id, fulfillment?.locationId) || fulfillment?.locationName === IWS_LOCATION_NAME;
  if (!iws) return { action: "ignore", reason: "not_iws_location" };
  if (!order) return { action: "retry", reason: "order_not_found" };
  if (hasSkipTag(order.tags)) return { action: "ignore", reason: "skipped_tag" };
  if (!fulfillment) return { action: "retry", reason: "fulfillment_missing" };
  const pdfs = fulfillment.shippingDocuments.filter(
    (doc) => doc.url && (doc.format === "PDF" || doc.documentType === "LABEL")
  );
  if (pdfs.length === 0) return { action: "retry", reason: "label_not_ready" };
  return { action: "email", fulfillment: { ...fulfillment, shippingDocuments: pdfs } };
}

export function buildIwsLabelEmail(order: IwsOrder, fulfillment: LabelFulfillment, attachments: IwsEmailAttachment[]): IwsEmailMessage {
  const tracking = fulfillment.trackingNumber
    ? `${fulfillment.trackingCompany || "Carrier"} ${fulfillment.trackingNumber}`
    : "Tracking will show on the label";
  const lines = [
    "Hi Robert and Kevin,",
    "",
    `Please pack and ship HC GamerLife ${order.name}. The prepaid Shopify shipping label is attached as a PDF — you do not need Shopify login.`,
    "",
    `Ship to:`,
    order.shipTo,
    "",
    `Tracking: ${tracking}`,
    "",
    "This is an HCG1 Pro wired headset from IWS Fulfillment (Pocatello). Print the attached label, pack the unit, and hand it off to the carrier on the label.",
    "",
    "Thank you,",
    "Dennis",
    "HC GamerLife",
    IWS_FROM
  ];
  const safeName = order.name.replace(/[^0-9A-Za-z-]+/g, "");
  const named = attachments.map((file, index) => ({
    ...file,
    filename: file.filename || (attachments.length === 1 ? `shipping-label-${safeName}.pdf` : `shipping-label-${safeName}-${index + 1}.pdf`)
  }));
  return {
    from: IWS_FROM,
    to: [...IWS_TO],
    subject: `${order.name} — shipping label attached (print and ship)`,
    text: lines.join("\n"),
    attachments: named
  };
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function verifyShopifyHmac(payload: string, header: string, secret: string): Promise<boolean> {
  if (!payload || !header || !secret) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign"
  ]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const digest = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return timingSafeEqual(digest, header.trim());
}

export function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return diff === 0;
}

const ORDER_QUERY = `query IwsOrder($id: ID!) {
  order(id: $id) {
    id
    name
    tags
    shippingAddress { name company address1 address2 city provinceCode zip countryCodeV2 }
    fulfillments(first: 20) {
      id
      location { id name }
      trackingInfo { number company url }
      shippingLabel {
        trackingInfo { number company url }
        shippingDocuments { url documentType format }
      }
    }
  }
}`;

const TAGS_ADD = `mutation IwsTag($id: ID!, $tags: [String!]!) {
  tagsAdd(id: $id, tags: $tags) {
    userErrors { field message }
  }
}`;

type AdminOrderNode = {
  id: string;
  name: string;
  tags: string[];
  shippingAddress?: {
    name?: string | null;
    company?: string | null;
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    provinceCode?: string | null;
    zip?: string | null;
    countryCodeV2?: string | null;
  } | null;
  fulfillments?: Array<{
    id: string;
    location?: { id?: string | null; name?: string | null } | null;
    trackingInfo?: Array<{ number?: string | null; company?: string | null; url?: string | null }>;
    shippingLabel?: {
      trackingInfo?: { number?: string | null; company?: string | null; url?: string | null } | null;
      shippingDocuments?: Array<{ url?: string | null; documentType?: string | null; format?: string | null }>;
    } | null;
  }>;
};

export function formatShipTo(address: AdminOrderNode["shippingAddress"]): string {
  if (!address) return "(no shipping address on the order)";
  return [
    address.company,
    address.name,
    address.address1,
    address.address2,
    [address.city, address.provinceCode, address.zip].filter(Boolean).join(" "),
    address.countryCodeV2
  ]
    .map((part) => (part || "").trim())
    .filter(Boolean)
    .join("\n");
}

export function parseAdminOrder(node: AdminOrderNode): IwsOrder {
  return {
    id: node.id,
    name: node.name,
    tags: node.tags || [],
    shipTo: formatShipTo(node.shippingAddress),
    fulfillments: (node.fulfillments || []).map((row) => {
      const tracking = row.shippingLabel?.trackingInfo || row.trackingInfo?.[0] || {};
      return {
        id: row.id,
        locationId: row.location?.id || null,
        locationName: row.location?.name || null,
        trackingNumber: tracking.number || null,
        trackingCompany: tracking.company || null,
        trackingUrl: tracking.url || null,
        shippingDocuments: (row.shippingLabel?.shippingDocuments || []).map((doc) => ({
          url: doc.url || null,
          documentType: doc.documentType || "LABEL",
          format: doc.format || null
        }))
      };
    })
  };
}

export function createShopifyAdmin(token: string, graphql: typeof fetch = fetch): ShopifyAdmin {
  async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const response = await graphql(SHOPIFY_ADMIN_API, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-shopify-access-token": token
      },
      body: JSON.stringify({ query, variables })
    });
    const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
    if (!response.ok || payload.errors?.length) {
      throw new Error(payload.errors?.map((row) => row.message).join("; ") || `Shopify GraphQL ${response.status}`);
    }
    return payload.data as T;
  }

  return {
    async fetchOrder(orderGid) {
      const data = await gql<{ order: AdminOrderNode | null }>(ORDER_QUERY, { id: orderGid });
      return data.order ? parseAdminOrder(data.order) : null;
    },
    async addTags(id, tags) {
      const data = await gql<{ tagsAdd: { userErrors: Array<{ message: string }> } }>(TAGS_ADD, { id, tags });
      const errors = data.tagsAdd?.userErrors || [];
      if (errors.length) throw new Error(errors.map((row) => row.message).join("; "));
    }
  };
}

export function createHttpDownloader(downloader: typeof fetch = fetch): LabelDownloader {
  return {
    async download(url) {
      const response = await downloader(url);
      if (!response.ok) throw new Error(`Label download failed (${response.status})`);
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength < 5) throw new Error("Label download was empty");
      const head = String.fromCharCode(...new Uint8Array(bytes).subarray(0, 4));
      if (head !== "%PDF") throw new Error("Label download was not a PDF");
      return bytes;
    }
  };
}

export function createAppsScriptMailer(url: string, secret: string, poster: typeof fetch = fetch): IwsMailer {
  return {
    async send(message) {
      const response = await poster(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ secret, ...message })
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Gmail script send failed (${response.status}) ${text.slice(0, 200)}`);
      }
    }
  };
}

export async function attachmentsFor(fulfillment: LabelFulfillment, orderName: string, downloader: LabelDownloader): Promise<IwsEmailAttachment[]> {
  const safeName = orderName.replace(/[^0-9A-Za-z-]+/g, "");
  const files: IwsEmailAttachment[] = [];
  for (const [index, doc] of fulfillment.shippingDocuments.entries()) {
    if (!doc.url) continue;
    const bytes = new Uint8Array(await downloader.download(doc.url));
    files.push({
      filename:
        fulfillment.shippingDocuments.length === 1
          ? `shipping-label-${safeName}.pdf`
          : `shipping-label-${safeName}-${index + 1}.pdf`,
      contentBase64: bytesToBase64(bytes),
      mimeType: "application/pdf"
    });
  }
  return files;
}

export async function emailIwsLabel(options: {
  webhook: FulfillmentWebhook;
  admin: ShopifyAdmin;
  downloader: LabelDownloader;
  mailer: IwsMailer;
}): Promise<{ ok: true; skipped?: string; emailed?: string }> {
  const order = options.webhook.order_id ? await options.admin.fetchOrder(orderGid(options.webhook.order_id)) : null;
  const decision = decideIwsLabelEmail(options.webhook, order);
  if (decision.action === "ignore") return { ok: true, skipped: decision.reason };
  if (decision.action === "retry") throw new Error(decision.reason);
  if (!order) throw new Error("order_not_found");
  const files = await attachmentsFor(decision.fulfillment, order.name, options.downloader);
  if (!files.length) throw new Error("label_not_ready");
  await options.mailer.send(buildIwsLabelEmail(order, decision.fulfillment, files));
  await options.admin.addTags(order.id, [IWS_EMAILED_TAG]);
  return { ok: true, emailed: order.name };
}

export async function handleIwsLabelWebhook(request: Request, env: IwsLabelEnv): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  const secret = env.SHOPIFY_WEBHOOK_SECRET?.trim();
  const token = env.SHOPIFY_ADMIN_TOKEN?.trim();
  const scriptUrl = env.IWS_GMAIL_SCRIPT_URL?.trim();
  const scriptSecret = env.IWS_GMAIL_SCRIPT_SECRET?.trim();
  if (!secret || !token || !scriptUrl || !scriptSecret) {
    return json({ ok: false, error: "IWS label email is not configured." }, 503);
  }

  const payload = await request.text();
  const hmac = request.headers.get("x-shopify-hmac-sha256") || "";
  if (!(await verifyShopifyHmac(payload, hmac, secret))) {
    return json({ ok: false, error: "Invalid Shopify webhook signature." }, 401);
  }

  const topic = (request.headers.get("x-shopify-topic") || "").toLowerCase();
  if (topic && topic !== "fulfillments/create" && topic !== "fulfillments/update") {
    return json({ ok: true, ignored: true, reason: "topic" });
  }

  let webhook: FulfillmentWebhook;
  try {
    webhook = JSON.parse(payload) as FulfillmentWebhook;
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  try {
    const result = await emailIwsLabel({
      webhook,
      admin: createShopifyAdmin(token),
      downloader: createHttpDownloader(),
      mailer: createAppsScriptMailer(scriptUrl, scriptSecret)
    });
    console.log(JSON.stringify({ msg: "iws_label_email", ...result, fulfillment: webhook.id, order: webhook.order_id }));
    return json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.warn(JSON.stringify({ msg: "iws_label_email_failed", error: message, fulfillment: webhook.id, order: webhook.order_id }));
    return json({ ok: false, error: message }, 500);
  }
}
