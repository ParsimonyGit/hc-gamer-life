import {
  crmTagsForResult,
  CUSTOM_FIELD_KEYS,
  GHL_LOCATION_ID,
  isCompleteAnswers,
  isEmail,
  scoreQuiz,
  type QuizAnswers,
  type QuestionId
} from "./data.ts";

export type QuizEnv = {
  GHL_PIT?: string;
  HCGL_GHL_PIT?: string;
  GHL_LOCATION_ID?: string;
};

export type QuizSubmitBody = {
  email?: string;
  firstName?: string;
  lastName?: string;
  answers?: QuizAnswers;
  marketingOptIn?: boolean;
};

export type QuizSubmitResult = {
  ok: true;
  contactId: string | null;
  isNew: boolean;
  crm: "ghl" | "skipped";
  bandId: string;
  bandTitle: string;
  tagline: string;
  story: string;
  accent: string;
  quote: string;
  promise: string[];
  answerLabels: string[];
  answerSummary: string;
};

const GHL_API = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

type CustomFieldRecord = {
  id?: string;
  name?: string;
  fieldKey?: string;
  key?: string;
};

type FieldCache = {
  locationId: string;
  byWantedKey: Record<string, { id?: string; key: string }>;
};

let fieldCache: FieldCache | null = null;

export function ghlPrivateToken(env: QuizEnv): string | undefined {
  const token = env.GHL_PIT || env.HCGL_GHL_PIT;
  return token?.trim() || undefined;
}

export function ghlLocationId(env: QuizEnv): string {
  return env.GHL_LOCATION_ID?.trim() || GHL_LOCATION_ID;
}

export function parseQuizBody(raw: unknown): { ok: true; body: Required<Pick<QuizSubmitBody, "email" | "answers">> & QuizSubmitBody } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Invalid JSON body" };
  const input = raw as QuizSubmitBody;
  const email = String(input.email || "").trim().toLowerCase();
  if (!isEmail(email)) return { ok: false, error: "Valid email required" };

  const answers = input.answers && typeof input.answers === "object" ? input.answers : {};
  const normalized: QuizAnswers = {};
  for (const key of ["platform", "style", "session", "pain"] as QuestionId[]) {
    const value = answers[key];
    if (typeof value === "string" && value.trim()) normalized[key] = value.trim();
  }
  if (!isCompleteAnswers(normalized)) {
    return { ok: false, error: "Answer every question to unlock your profile" };
  }

  return {
    ok: true,
    body: {
      ...input,
      email,
      firstName: String(input.firstName || "").trim().slice(0, 80) || undefined,
      lastName: String(input.lastName || "").trim().slice(0, 80) || undefined,
      answers: normalized
    }
  };
}

function ghlHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Version: GHL_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json"
  };
}

function normalizeFieldToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/^contact\./, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function matchCustomField(fields: CustomFieldRecord[], wantedKey: string): CustomFieldRecord | undefined {
  const wanted = normalizeFieldToken(wantedKey);
  return fields.find((field) => {
    const tokens = [field.fieldKey, field.key, field.name]
      .filter((value): value is string => Boolean(value))
      .map(normalizeFieldToken);
    return tokens.includes(wanted);
  });
}

async function loadCustomFieldMap(env: QuizEnv, token: string, locationId: string): Promise<FieldCache> {
  if (fieldCache?.locationId === locationId) return fieldCache;

  const urls = [
    `${GHL_API}/locations/${locationId}/customFields`,
    `${GHL_API}/locations/${locationId}/customFields?model=contact`
  ];

  let fields: CustomFieldRecord[] = [];
  for (const url of urls) {
    try {
      const response = await fetch(url, { headers: ghlHeaders(token) });
      if (!response.ok) continue;
      const payload = (await response.json()) as { customFields?: CustomFieldRecord[]; fields?: CustomFieldRecord[] };
      fields = payload.customFields || payload.fields || [];
      if (fields.length) break;
    } catch {
      // Lookup is best-effort; keys still go on the upsert.
    }
  }

  const byWantedKey: FieldCache["byWantedKey"] = {};
  for (const wantedKey of CUSTOM_FIELD_KEYS) {
    const match = matchCustomField(fields, wantedKey);
    byWantedKey[wantedKey] = {
      id: match?.id,
      key: match?.fieldKey || match?.key || wantedKey
    };
  }

  fieldCache = { locationId, byWantedKey };
  return fieldCache;
}

function customFieldPayload(map: FieldCache, values: Record<string, string>): Array<Record<string, string>> {
  const payload: Array<Record<string, string>> = [];
  for (const wantedKey of CUSTOM_FIELD_KEYS) {
    const value = values[wantedKey];
    if (!value) continue;
    const resolved = map.byWantedKey[wantedKey];
    const entry: Record<string, string> = { field_value: value };
    if (resolved?.id) entry.id = resolved.id;
    entry.key = resolved?.key || wantedKey;
    payload.push(entry);
  }
  return payload;
}

async function applyTags(token: string, contactId: string, tags: string[]): Promise<void> {
  try {
    await fetch(`${GHL_API}/contacts/${contactId}/tags`, {
      method: "POST",
      headers: ghlHeaders(token),
      body: JSON.stringify({ tags })
    });
  } catch {
    // Upsert already requested tags; this second write is reinforcement only.
  }
}

export async function upsertQuizContact(
  env: QuizEnv,
  body: QuizSubmitBody & { email: string; answers: QuizAnswers }
): Promise<{ contactId: string; isNew: boolean }> {
  const token = ghlPrivateToken(env);
  const locationId = ghlLocationId(env);
  if (!token) throw new Error("Quiz backend is not configured (missing GHL_PIT or HCGL_GHL_PIT).");

  const scored = scoreQuiz(body.answers);
  const tags = crmTagsForResult(scored, true);
  const fieldMap = await loadCustomFieldMap(env, token, locationId);

  const payload: Record<string, unknown> = {
    locationId,
    email: body.email,
    source: "hcgl-quiz",
    tags,
    country: "US",
    customFields: customFieldPayload(fieldMap, scored.customFields)
  };
  if (body.firstName) payload.firstName = body.firstName;
  if (body.lastName) payload.lastName = body.lastName;
  if (body.marketingOptIn === false) {
    payload.dnd = true;
    payload.dndSettings = {
      Email: { status: "active", message: "Opted out at quiz submit", code: "" }
    };
  }

  const response = await fetch(`${GHL_API}/contacts/upsert`, {
    method: "POST",
    headers: ghlHeaders(token),
    body: JSON.stringify(payload)
  });

  const data = (await response.json()) as {
    new?: boolean;
    contact?: { id?: string };
    message?: string;
    error?: string;
  };

  if (!response.ok || !data.contact?.id) {
    throw new Error(data.message || data.error || `GHL upsert failed (${response.status})`);
  }

  await applyTags(token, data.contact.id, tags);
  return { contactId: data.contact.id, isNew: Boolean(data.new) };
}

export async function submitQuiz(env: QuizEnv, raw: unknown): Promise<QuizSubmitResult> {
  const parsed = parseQuizBody(raw);
  if (!parsed.ok) throw new Error(parsed.error);

  const scored = scoreQuiz(parsed.body.answers);
  let contactId: string | null = null;
  let isNew = false;
  let crm: QuizSubmitResult["crm"] = "skipped";

  if (ghlPrivateToken(env)) {
    const upsert = await upsertQuizContact(env, parsed.body);
    contactId = upsert.contactId;
    isNew = upsert.isNew;
    crm = "ghl";
  }

  return {
    ok: true,
    contactId,
    isNew,
    crm,
    bandId: scored.band.id,
    bandTitle: scored.band.title,
    tagline: scored.band.tagline,
    story: scored.band.story,
    accent: scored.band.accent,
    quote: scored.band.quote,
    promise: scored.band.promise,
    answerLabels: scored.answerLabels,
    answerSummary: scored.answerSummary
  };
}
