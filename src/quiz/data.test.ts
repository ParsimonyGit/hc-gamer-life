import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  crmTagsForResult,
  isCompleteAnswers,
  isEmail,
  pickBand,
  scoreQuiz,
  type QuizAnswers
} from "./data.ts";
import { parseQuizBody } from "./ghl.ts";

const complete: QuizAnswers = {
  platform: "pc",
  style: "competitive",
  session: "3h-plus",
  pain: "audio"
};

describe("scoreQuiz", () => {
  it("maps competitive + marathon + footsteps to Ready for Pro", () => {
    const result = scoreQuiz(complete);
    assert.equal(result.band.id, "ready-for-pro");
    assert.equal(result.customFields.hcgl_quiz_score_band, "Ready for Pro");
    assert.equal(result.customFields.hcgl_primary_platform, "PC");
    assert.equal(result.customFields.hcgl_play_style, "Competitive ranked");
    assert.equal(result.customFields.hcgl_session_hours, "3h+ marathon");
    assert.equal(result.customFields.hcgl_top_pain, "Footsteps & position");
    assert.ok(result.tags.includes("hcgl-quiz-complete"));
    assert.ok(result.tags.includes("hcgl-lead-nurture"));
    assert.ok(result.tags.includes("hcgl-platform-pc"));
    assert.ok(result.tags.includes("hcgl-style-competitive"));
    assert.ok(result.tags.includes("hcgl-pain-audio"));
  });

  it("maps casual + short + comfort to Immersed", () => {
    const result = scoreQuiz({
      platform: "switch-mobile",
      style: "casual",
      session: "under-1h",
      pain: "comfort"
    });
    assert.equal(result.band.id, "immersed");
    assert.equal(result.customFields.hcgl_play_style, "Casual & story");
    assert.ok(result.tags.includes("hcgl-platform-switch-mobile"));
    assert.ok(result.tags.includes("hcgl-style-casual"));
    assert.ok(result.tags.includes("hcgl-pain-comfort"));
  });

  it("maps creator + mic pain to Climbing", () => {
    const result = scoreQuiz({
      platform: "xbox",
      style: "creator",
      session: "1-3h",
      pain: "mic"
    });
    assert.equal(result.band.id, "climbing");
    assert.ok(result.tags.includes("hcgl-style-creator"));
    assert.ok(result.tags.includes("hcgl-pain-mic"));
  });

  it("uses play style as a tie-break", () => {
    assert.equal(pickBand({ immersed: 2, climbing: 2, "ready-for-pro": 2 }, { style: "competitive" }), "ready-for-pro");
    assert.equal(pickBand({ immersed: 2, climbing: 2, "ready-for-pro": 2 }, { style: "creator" }), "climbing");
    assert.equal(pickBand({ immersed: 2, climbing: 2, "ready-for-pro": 2 }, { style: "casual" }), "immersed");
  });
});

describe("crm tags and validation", () => {
  it("adds hcgl-registered only when email is captured", () => {
    const scored = scoreQuiz(complete);
    assert.ok(!crmTagsForResult(scored, false).includes("hcgl-registered"));
    assert.ok(crmTagsForResult(scored, true).includes("hcgl-registered"));
  });

  it("requires a complete answer set", () => {
    assert.equal(isCompleteAnswers({ platform: "pc" }), false);
    assert.equal(isCompleteAnswers(complete), true);
    assert.equal(isEmail("player@hcgamerlife.org"), true);
    assert.equal(isEmail("not-an-email"), false);
  });

  it("rejects incomplete API bodies", () => {
    const missing = parseQuizBody({ email: "player@hcgamerlife.org", answers: { platform: "pc" } });
    assert.equal(missing.ok, false);
    const ok = parseQuizBody({ email: "player@hcgamerlife.org", firstName: "Alex", answers: complete });
    assert.equal(ok.ok, true);
    if (ok.ok) assert.equal(ok.body.firstName, "Alex");
  });
});
