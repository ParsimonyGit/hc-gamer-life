/** Shared quiz content, scoring, and CRM field mapping for HC Gamer Life. */

export type BandId = "immersed" | "climbing" | "ready-for-pro";

export type QuestionId = "platform" | "style" | "session" | "pain";

export type QuizOption = {
  id: string;
  label: string;
  blurb: string;
  image: string;
  imageAlt: string;
  fieldValue: string;
  tag: string;
  /** Points awarded to each result band. */
  scores: Partial<Record<BandId, number>>;
};

export type QuizQuestion = {
  id: QuestionId;
  prompt: string;
  sub: string;
  fieldKey: "hcgl_primary_platform" | "hcgl_play_style" | "hcgl_session_hours" | "hcgl_top_pain";
  options: QuizOption[];
};

export type QuizAnswers = Partial<Record<QuestionId, string>>;

export type Band = {
  id: BandId;
  title: string;
  tagline: string;
  story: string;
  accent: string;
  quote: string;
  promise: string[];
};

export const GHL_LOCATION_ID = "STFgRxHbklvx2q1nDpi1";

export const CUSTOM_FIELD_KEYS = [
  "hcgl_primary_platform",
  "hcgl_play_style",
  "hcgl_session_hours",
  "hcgl_top_pain",
  "hcgl_quiz_score_band"
] as const;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "platform",
    prompt: "Where do you actually play?",
    sub: "One main platform. We will bias the profile toward that jack.",
    fieldKey: "hcgl_primary_platform",
    options: [
      {
        id: "pc",
        label: "PC",
        blurb: "Desk, tower, and the 3.5mm that still lives on the board.",
        image: "/assets/gallery/ugc-pc.jpg",
        imageAlt: "College gamer wearing the HCG1 at a PC desk",
        fieldValue: "PC",
        tag: "hcgl-platform-pc",
        scores: { "ready-for-pro": 1, climbing: 1 }
      },
      {
        id: "playstation",
        label: "PlayStation",
        blurb: "Jack on the DualSense. Couch or desk, same cable.",
        image: "/assets/gallery/ugc-dualsense.jpg",
        imageAlt: "Ranked player wearing the HCG1 with a DualSense controller",
        fieldValue: "PlayStation",
        tag: "hcgl-platform-playstation",
        scores: { climbing: 1, "ready-for-pro": 1 }
      },
      {
        id: "xbox",
        label: "Xbox",
        blurb: "Living-room nights, pad on the table, cable in the controller.",
        image: "/assets/gallery/ugc-xbox.jpg",
        imageAlt: "Parent sitting with the HCG1 and an Xbox controller",
        fieldValue: "Xbox",
        tag: "hcgl-platform-xbox",
        scores: { climbing: 1, immersed: 1 }
      },
      {
        id: "switch-mobile",
        label: "Switch or Mobile",
        blurb: "Wherever the session starts — handheld, TV, or the train.",
        image: "/assets/gallery/ugc-playstation.jpg",
        imageAlt: "Couch gamer putting on the HCG1 in front of a TV",
        fieldValue: "Switch or Mobile",
        tag: "hcgl-platform-switch-mobile",
        scores: { immersed: 2 }
      }
    ]
  },
  {
    id: "style",
    prompt: "What is the session for?",
    sub: "No wrong lobby. This sets the energy of your audio profile.",
    fieldKey: "hcgl_play_style",
    options: [
      {
        id: "competitive",
        label: "Competitive ranked",
        blurb: "Queue to climb. Callouts, flanks, one more set.",
        image: "/assets/gallery/ugc-dualsense.jpg",
        imageAlt: "Ranked player locked in with a DualSense",
        fieldValue: "Competitive ranked",
        tag: "hcgl-style-competitive",
        scores: { "ready-for-pro": 3 }
      },
      {
        id: "casual",
        label: "Casual & story",
        blurb: "Worlds, campaigns, and nights that do not need a rank.",
        image: "/assets/gallery/ugc-playstation.jpg",
        imageAlt: "Couch gamer putting on the HCG1",
        fieldValue: "Casual & story",
        tag: "hcgl-style-casual",
        scores: { immersed: 3 }
      },
      {
        id: "creator",
        label: "Streaming & content",
        blurb: "You talk to a room that is not only in the party chat.",
        image: "/assets/gallery/ugc-creator.jpg",
        imageAlt: "Creator at a streaming desk holding the HCG1",
        fieldValue: "Streaming & content",
        tag: "hcgl-style-creator",
        scores: { climbing: 3 }
      }
    ]
  },
  {
    id: "session",
    prompt: "How long is a typical session?",
    sub: "Comfort and seal start to matter after the first hour.",
    fieldKey: "hcgl_session_hours",
    options: [
      {
        id: "under-1h",
        label: "Under 1 hour",
        blurb: "Quick queues, a story chapter, then off the head.",
        image: "/assets/gallery/catalog-front.jpg",
        imageAlt: "Front view of the HCG1 Pro Gaming Headset",
        fieldValue: "Under 1h",
        tag: "hcgl-session-under-1h",
        scores: { immersed: 2 }
      },
      {
        id: "1-3h",
        label: "1–3 hours",
        blurb: "A real night. Enough time for the fit to prove itself.",
        image: "/assets/gallery/ugc-pc.jpg",
        imageAlt: "Player at a PC desk wearing the HCG1",
        fieldValue: "1–3h",
        tag: "hcgl-session-1-3h",
        scores: { climbing: 2, "ready-for-pro": 1 }
      },
      {
        id: "3h-plus",
        label: "3h+ marathon",
        blurb: "One more match becomes the whole evening.",
        image: "/assets/gallery/catalog-inner.jpg",
        imageAlt: "HCG1 inner ear cushions with red stitching",
        fieldValue: "3h+ marathon",
        tag: "hcgl-session-3h-plus",
        scores: { "ready-for-pro": 2, climbing: 1 }
      }
    ]
  },
  {
    id: "pain",
    prompt: "What is the biggest headset pain?",
    sub: "We will tilt the profile toward the thing that ends a session early.",
    fieldKey: "hcgl_top_pain",
    options: [
      {
        id: "audio",
        label: "Footsteps & position",
        blurb: "You want the flank before it is on the kill feed.",
        image: "/assets/gallery/catalog-hero.jpg",
        imageAlt: "HCG1 Pro at a three-quarter angle with microphone and cable",
        fieldValue: "Footsteps & position",
        tag: "hcgl-pain-audio",
        scores: { "ready-for-pro": 2 }
      },
      {
        id: "comfort",
        label: "Comfort on long sessions",
        blurb: "Hot spots, clamp, glasses — the headset starts talking back.",
        image: "/assets/gallery/catalog-inner.jpg",
        imageAlt: "HCG1 inner ear cushions",
        fieldValue: "Comfort on long sessions",
        tag: "hcgl-pain-comfort",
        scores: { immersed: 2, climbing: 1 }
      },
      {
        id: "mic",
        label: "Mic clarity for squad",
        blurb: "Callouts should land the first time, even when the room is loud.",
        image: "/assets/gallery/studio-front-mic.jpg",
        imageAlt: "HCG1 held from the front with the detachable boom microphone",
        fieldValue: "Mic clarity for squad",
        tag: "hcgl-pain-mic",
        scores: { climbing: 2, "ready-for-pro": 1 }
      }
    ]
  }
];

export const BANDS: Record<BandId, Band> = {
  immersed: {
    id: "immersed",
    title: "Immersed",
    tagline: "You play to disappear into the world.",
    story:
      "Story nights, handheld sessions, and couches that do not need a rank. The HCG1 Pro is a wired over-ear that stays easy through long campaigns — 53mm stereo, a boom you can take off, and a two-year guarantee so the gear is not the drama.",
    accent: "#6bc9ff",
    quote: "Comfort first. Then the world gets louder.",
    promise: [
      "Closed-back seal for story and music",
      "Soft cups that last past the first hour",
      "Works on Switch, mobile, console, and PC",
      "2-year no-questions guarantee"
    ]
  },
  climbing: {
    id: "climbing",
    title: "Climbing",
    tagline: "You are building a cleaner session.",
    story:
      "Better comms, a tighter mix, maybe a stream. The HCG1 Pro is universal 3.5mm — PC, PlayStation, Xbox, Switch, mobile — with a detachable boom that stays clear when the lobby gets loud and a two-year warranty behind it.",
    accent: "#ff765c",
    quote: "Clearer callouts. Fewer excuses.",
    promise: [
      "Detachable boom for party and content",
      "Inline mute and volume in the cable",
      "One jack across the devices you already own",
      "2-year no-questions guarantee"
    ]
  },
  "ready-for-pro": {
    id: "ready-for-pro",
    title: "Ready for Pro",
    tagline: "You queue to hear the play before it happens.",
    story:
      "Footsteps, flanks, the call that wins the round. The HCG1 Pro is tuned for positional stereo and a mic your squad can actually hear — wired so there is no battery between you and the next set, backed by a two-year warranty.",
    accent: "#ff4f5e",
    quote: "Hear the flank. Call the play.",
    promise: [
      "53mm stereo for footsteps and position",
      "Mic that stays intelligible in a loud lobby",
      "Always-on wired 3.5mm — no charge cycle",
      "2-year no-questions guarantee"
    ]
  }
};

export type QuizScoreResult = {
  band: Band;
  scores: Record<BandId, number>;
  answerLabels: string[];
  answerSummary: string;
  customFields: Record<(typeof CUSTOM_FIELD_KEYS)[number], string>;
  tags: string[];
};

const EMPTY_SCORES: Record<BandId, number> = {
  immersed: 0,
  climbing: 0,
  "ready-for-pro": 0
};

export function findOption(questionId: QuestionId, optionId: string): QuizOption | undefined {
  const question = QUIZ_QUESTIONS.find((item) => item.id === questionId);
  return question?.options.find((option) => option.id === optionId);
}

export function isCompleteAnswers(answers: QuizAnswers): answers is Record<QuestionId, string> {
  return QUIZ_QUESTIONS.every((question) => {
    const value = answers[question.id];
    return Boolean(value && findOption(question.id, value));
  });
}

export function pickBand(scores: Record<BandId, number>, answers: QuizAnswers): BandId {
  const ranked = (Object.entries(scores) as Array<[BandId, number]>).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
  const top = ranked[0];
  const tied = ranked.filter(([, value]) => value === top[1]).map(([id]) => id);

  if (tied.length === 1) return tied[0];
  if (answers.style === "competitive" && tied.includes("ready-for-pro")) return "ready-for-pro";
  if (answers.style === "creator" && tied.includes("climbing")) return "climbing";
  if (answers.style === "casual" && tied.includes("immersed")) return "immersed";
  if (tied.includes("climbing")) return "climbing";
  return tied[0] ?? "climbing";
}

export function scoreQuiz(answers: QuizAnswers): QuizScoreResult {
  const scores = { ...EMPTY_SCORES };
  const answerLabels: string[] = [];
  const tags = new Set<string>(["hcgl-quiz-complete", "hcgl-lead-nurture"]);
  const customFields = {
    hcgl_primary_platform: "",
    hcgl_play_style: "",
    hcgl_session_hours: "",
    hcgl_top_pain: "",
    hcgl_quiz_score_band: ""
  };

  for (const question of QUIZ_QUESTIONS) {
    const optionId = answers[question.id];
    const option = optionId ? findOption(question.id, optionId) : undefined;
    if (!option) continue;
    answerLabels.push(option.label);
    tags.add(option.tag);
    customFields[question.fieldKey] = option.fieldValue;
    for (const [bandId, points] of Object.entries(option.scores) as Array<[BandId, number]>) {
      scores[bandId] += points;
    }
  }

  const bandId = pickBand(scores, answers);
  const band = BANDS[bandId];
  customFields.hcgl_quiz_score_band = band.title;

  return {
    band,
    scores,
    answerLabels,
    answerSummary: answerLabels.length ? `${answerLabels.join(" · ")} → ${band.title}` : band.title,
    customFields,
    tags: [...tags]
  };
}

export function crmTagsForResult(result: QuizScoreResult, hasEmail: boolean): string[] {
  const tags = new Set(result.tags);
  if (hasEmail) tags.add("hcgl-registered");
  return [...tags];
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export type QuizClientConfig = {
  questions: QuizQuestion[];
  bands: Record<BandId, Band>;
};

export function clientConfig(): QuizClientConfig {
  return { questions: QUIZ_QUESTIONS, bands: BANDS };
}
