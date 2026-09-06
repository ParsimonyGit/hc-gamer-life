import { clientConfig } from "./data.ts";

const SITE_URL = "https://hcgamerlife.org";
const SEO_IMAGE = `${SITE_URL}/brand/og.jpg`;

const escapeScript = (value: string): string =>
  value.replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

const QUIZ_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Gamer Audio Profile Quiz | HC GamerLife",
  url: `${SITE_URL}/quiz`,
  description: "A 60-second on-site quiz that maps your platform, play style, and headset pain to an HCG1 Pro audio profile.",
  isPartOf: { "@type": "WebSite", name: "HC GamerLife", url: SITE_URL },
  about: { "@type": "Product", name: "HCG1 Pro Gaming Headset" }
}).replace(/</g, "\\u003c");

const STYLES = `
:root {
  color-scheme: dark;
  --ink: #f5efe4;
  --muted: #b4ac9f;
  --line: rgba(245,239,228,.16);
  --bg: #0d0b0a;
  --panel: #1a1613;
  --red: #ff4f5e;
  --coral: #ff765c;
  --blue: #6bc9ff;
  --max: 1120px;
}
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
html { background: #0d0b0a; }
body {
  background:
    radial-gradient(circle at 88% -10%, rgba(255,79,94,.22), transparent 28rem),
    radial-gradient(circle at 8% 70%, rgba(107,201,255,.12), transparent 24rem),
    #14110f;
  color: var(--ink);
  font-family: "Avenir Next", "Century Gothic", "Trebuchet MS", sans-serif;
  line-height: 1.55;
  overflow-x: clip;
}
a { color: inherit; text-decoration: none; }
button, input { font: inherit; }
.shell { margin: 0 auto; max-width: var(--max); padding: 0 22px; }
.topline {
  background: #100e0c;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-family: "IBM Plex Mono", "Courier New", monospace;
  font-size: .72rem;
  letter-spacing: .12em;
  padding: 10px 22px;
  text-transform: uppercase;
}
header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 0 8px;
}
.brand {
  align-items: center;
  display: inline-flex;
  font-family: "IBM Plex Mono", "Courier New", monospace;
  font-size: .82rem;
  font-weight: 800;
  gap: 11px;
  letter-spacing: .16em;
}
.brand-mark {
  align-items: center;
  background: var(--red);
  border-radius: 3px;
  color: #210a10;
  display: inline-flex;
  font-size: .78rem;
  height: 33px;
  justify-content: center;
  width: 38px;
}
.nav-link {
  color: var(--muted);
  font-size: .94rem;
}
.nav-link:hover { color: var(--ink); }
.eyebrow {
  color: var(--blue);
  font-family: "IBM Plex Mono", "Courier New", monospace;
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.progress-wrap { margin: 10px 0 28px; }
.progress {
  background: rgba(245,239,228,.1);
  border-radius: 999px;
  height: 6px;
  overflow: hidden;
}
.progress > i {
  background: linear-gradient(90deg, var(--red), var(--coral), var(--blue));
  display: block;
  height: 100%;
  transition: width .5s ease;
  width: 0;
}
.progress-meta {
  color: var(--muted);
  display: flex;
  justify-content: space-between;
  font-size: .8rem;
  margin-top: 8px;
}
.stage { min-height: 68vh; padding-bottom: 72px; }
.hidden { display: none !important; }
.animate { animation: rise .45s ease both; }
@keyframes rise {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .animate, .progress > i { animation: none; transition: none; }
}

.intro {
  display: grid;
  gap: 20px;
  grid-template-columns: minmax(0, 1.35fr) minmax(18rem, .75fr);
}
.hero-panel, .mosaic-panel {
  border: 1px solid var(--line);
  border-radius: 4px 34px 4px 34px;
  overflow: hidden;
  min-height: 36rem;
}
.hero-panel {
  background:
    linear-gradient(180deg, rgba(13,11,10,.18), rgba(13,11,10,.78)),
    url("/assets/gallery/catalog-hero.jpg") center/cover;
  box-shadow: 0 28px 70px -38px rgba(0,0,0,.7);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 36px 32px 34px;
}
.chip {
  align-items: center;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 999px;
  display: inline-flex;
  font-size: .72rem;
  font-weight: 800;
  gap: 8px;
  letter-spacing: .12em;
  padding: 7px 12px;
  text-transform: uppercase;
  width: max-content;
}
h1, h2, .display {
  font-family: "Bodoni 72", Didot, "Iowan Old Style", Baskerville, Georgia, serif;
  font-weight: 500;
  letter-spacing: -.06em;
  line-height: .96;
  margin: 0;
}
h1 { font-size: clamp(3.1rem, 8vw, 6.2rem); margin: 18px 0 16px; max-width: 11ch; }
.lede { color: #ddd6c8; font-size: 1.12rem; max-width: 36rem; }
.cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.button {
  align-items: center;
  background: var(--red);
  border: 0;
  border-radius: 3px;
  color: #210a10;
  cursor: pointer;
  display: inline-flex;
  font-family: "IBM Plex Mono", "Courier New", monospace;
  font-size: .78rem;
  font-weight: 800;
  gap: 8px;
  letter-spacing: .1em;
  padding: 14px 18px;
  text-transform: uppercase;
}
.button:hover { background: #ff7380; }
.button[disabled] { cursor: wait; opacity: .6; }
.button-quiet {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink);
}
.intro-stats {
  border-top: 1px solid rgba(255,255,255,.14);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 28px;
  padding-top: 18px;
}
.intro-stats strong {
  display: block;
  font-family: "Bodoni 72", Didot, Georgia, serif;
  font-size: 1.8rem;
  font-weight: 500;
}
.intro-stats span {
  color: #c8c0b3;
  font-size: .72rem;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.mosaic-panel { background: var(--panel); display: flex; flex-direction: column; }
.mosaic {
  display: grid;
  gap: 6px;
  grid-template-columns: 1.2fr .8fr;
  grid-template-rows: 1fr 1fr;
  min-height: 18rem;
  padding: 6px;
}
.mosaic img { display: block; height: 100%; object-fit: cover; width: 100%; }
.mosaic figure { margin: 0; overflow: hidden; position: relative; }
.mosaic figure:first-child { grid-row: span 2; }
.mosaic figcaption {
  background: linear-gradient(transparent, rgba(0,0,0,.72));
  bottom: 0;
  font-size: .78rem;
  left: 0;
  padding: 28px 12px 10px;
  position: absolute;
  right: 0;
}
.mosaic-copy { padding: 22px 22px 26px; }
.mosaic-copy h2 { font-size: 2.2rem; margin: 8px 0 10px; }
.mosaic-copy p { color: var(--muted); margin: 0; }
.fine { color: var(--muted); font-size: .8rem; margin: 16px 0 0; text-align: center; }

.question h2 { font-size: clamp(2.2rem, 6vw, 3.8rem); max-width: 16ch; }
.question .sub { color: var(--muted); font-size: 1.05rem; margin: 10px 0 0; }
.cards {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr 1fr;
  margin-top: 28px;
}
.card {
  background: #201b18;
  border: 1px solid var(--line);
  border-radius: 4px 22px 4px 22px;
  color: inherit;
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  text-align: left;
  transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease;
}
.card:hover { border-color: rgba(255,79,94,.45); transform: translateY(-2px); }
.card[aria-pressed="true"] {
  border-color: var(--red);
  box-shadow: 0 16px 40px -24px rgba(255,79,94,.7);
  transform: scale(1.015);
}
.card.dim { opacity: .45; pointer-events: none; }
.card-media {
  aspect-ratio: 16/9;
  overflow: hidden;
  position: relative;
}
.card-media img { display: block; height: 100%; object-fit: cover; width: 100%; }
.card-body { padding: 16px 16px 18px; }
.card-top { align-items: flex-start; display: flex; justify-content: space-between; gap: 10px; }
.card-body strong { display: block; font-size: 1.08rem; }
.card-body p { color: var(--muted); font-size: .92rem; margin: 6px 0 0; }
.check {
  background: var(--red);
  border-radius: 999px;
  color: #210a10;
  display: none;
  flex: none;
  font-size: .78rem;
  font-weight: 800;
  height: 22px;
  line-height: 22px;
  text-align: center;
  width: 22px;
}
.card[aria-pressed="true"] .check { display: inline-block; }
.nav-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 22px;
}
.back {
  background: none;
  border: 0;
  color: var(--muted);
  cursor: pointer;
  padding: 0;
}
.back:hover { color: var(--ink); }
.hint { color: var(--muted); font-size: .8rem; }

.capture, .result {
  border: 1px solid var(--line);
  border-radius: 4px 34px 4px 34px;
  overflow: hidden;
}
.capture {
  background: linear-gradient(180deg, rgba(255,79,94,.08), transparent 40%), #1a1613;
  padding: 32px 28px 34px;
}
.capture h2 { font-size: clamp(2.4rem, 6vw, 4.2rem); margin: 12px 0 12px; }
.form { display: grid; gap: 14px; margin-top: 22px; max-width: 34rem; }
.form-row { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; }
label span {
  color: var(--muted);
  display: block;
  font-family: "IBM Plex Mono", "Courier New", monospace;
  font-size: .7rem;
  letter-spacing: .12em;
  margin-bottom: 6px;
  text-transform: uppercase;
}
input[type="text"], input[type="email"] {
  background: #14110f;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink);
  padding: 12px 13px;
  width: 100%;
}
input:focus { border-color: var(--red); outline: 2px solid rgba(255,79,94,.25); }
.opt { align-items: flex-start; color: var(--muted); display: flex; font-size: .92rem; gap: 10px; }
.error {
  background: #2a1614;
  border: 1px solid #fdba74;
  border-radius: 10px;
  color: #ffd7b0;
  padding: 10px 12px;
}

.result { background: #1a1613; }
.result-grid { display: grid; grid-template-columns: minmax(12rem, 17rem) 1fr; }
.result-photo { min-height: 22rem; position: relative; }
.result-photo img { height: 100%; object-fit: cover; position: absolute; inset: 0; width: 100%; }
.result-copy { padding: 28px 28px 32px; }
.band-pill {
  border-radius: 999px;
  color: #210a10;
  display: inline-flex;
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .12em;
  padding: 6px 10px;
  text-transform: uppercase;
}
.result-copy h2 { font-size: clamp(2.4rem, 6vw, 4.4rem); margin: 12px 0 8px; }
.quote {
  border-left: 2px solid var(--red);
  color: var(--muted);
  font-style: italic;
  margin: 16px 0;
  max-width: 36rem;
  padding-left: 12px;
}
.chose {
  background: rgba(255,255,255,.04);
  border: 1px solid var(--line);
  border-radius: 16px;
  margin: 18px 0;
  padding: 12px 14px;
}
.chose span { color: var(--muted); display: block; font-size: .7rem; letter-spacing: .14em; text-transform: uppercase; }
.promises { display: grid; gap: 8px; margin: 18px 0 22px; padding: 0; }
.promises li { color: #ddd6c8; list-style: none; padding-left: 0; }
.promises li::before { color: var(--red); content: "▸ "; }
.saved { color: #9be7a6; font-weight: 700; }

@media (max-width: 860px) {
  .intro, .result-grid, .cards, .form-row { grid-template-columns: 1fr; }
  .hero-panel, .mosaic-panel { min-height: 0; border-radius: 4px 24px 4px 24px; }
  .hero-panel { padding: 26px 20px 24px; }
  .result-photo { min-height: 16rem; }
  h1 { font-size: clamp(2.6rem, 13vw, 3.8rem); }
}
`;

const RUNTIME = `(() => {
  const config = JSON.parse(document.getElementById("quiz-data").textContent);
  const questions = config.questions;
  const root = document.getElementById("quiz-app");
  const progressEl = document.getElementById("progress-bar");
  const stepEl = document.getElementById("progress-step");
  const progressWrap = document.getElementById("progress-wrap");

  const state = {
    phase: "intro",
    step: 0,
    answers: {},
    selected: null,
    advancing: false,
    firstName: "",
    email: "",
    optIn: true,
    submitting: false,
    error: "",
    result: null
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, reduce ? 0 : ms));

  function setProgress() {
    const captureWeight = state.phase === "capture" || state.phase === "result" ? 1 : 0;
    const total = questions.length + 1;
    const current = state.phase === "intro" ? 0 : state.phase === "questions" ? state.step + (state.selected ? 0.55 : 0) : questions.length + captureWeight;
    const pct = state.phase === "intro" ? 0 : Math.min(100, (current / total) * 100);
    progressWrap.classList.toggle("hidden", state.phase === "intro");
    progressEl.style.width = pct + "%";
    stepEl.textContent = state.phase === "questions"
      ? "Question " + (state.step + 1) + " of " + questions.length
      : state.phase === "capture"
        ? "Unlock your profile"
        : "Your Gamer Audio Profile";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderIntro() {
    return \`<div class="intro animate">
      <section class="hero-panel">
        <div class="chip">60-second audio profile</div>
        <h1>Find the headset energy you already play with.</h1>
        <p class="lede">Four taps. Your Gamer Audio Profile. Then the HCG1 Pro — wired, universal, and backed for two years.</p>
        <div class="cta-row">
          <button class="button" type="button" data-action="start">Take the quiz →</button>
          <a class="button button-quiet" href="/#product">Meet the HCG1 Pro</a>
        </div>
        <div class="intro-stats">
          <div><strong>4</strong><span>quick questions</span></div>
          <div><strong>3</strong><span>profile bands</span></div>
          <div><strong>2 yr</strong><span>guarantee</span></div>
        </div>
      </section>
      <aside class="mosaic-panel">
        <div class="mosaic">
          <figure><img src="/assets/gallery/ugc-pc.jpg" alt="" /><figcaption>PC desk</figcaption></figure>
          <figure><img src="/assets/gallery/ugc-dualsense.jpg" alt="" /><figcaption>Ranked</figcaption></figure>
          <figure><img src="/assets/gallery/ugc-creator.jpg" alt="" /><figcaption>Creator</figcaption></figure>
        </div>
        <div class="mosaic-copy">
          <p class="eyebrow">Immersed · Climbing · Ready for Pro</p>
          <h2>Your answers build the band.</h2>
          <p>Platform, play style, session length, and the pain that ends a night early. No LeadConnector form. No iframe.</p>
        </div>
      </aside>
    </div>
    <p class="fine">Results unlock after email · Soft-sell only · Existing pages stay put</p>\`;
  }

  function renderQuestion() {
    const q = questions[state.step];
    const cards = q.options.map((opt) => {
      const active = state.selected === opt.id;
      return \`<button class="card\${state.advancing && !active ? " dim" : ""}" type="button" data-action="pick" data-id="\${opt.id}" aria-pressed="\${active}">
        <div class="card-media"><img src="\${opt.image}" alt="\${escapeHtml(opt.imageAlt)}" /></div>
        <div class="card-body">
          <div class="card-top"><strong>\${escapeHtml(opt.label)}</strong><span class="check">✓</span></div>
          <p>\${escapeHtml(opt.blurb)}</p>
        </div>
      </button>\`;
    }).join("");
    return \`<div class="question animate" data-qid="\${q.id}">
      <p class="eyebrow">Gamer Audio Profile</p>
      <h2>\${escapeHtml(q.prompt)}</h2>
      <p class="sub">\${escapeHtml(q.sub)}</p>
      <div class="cards">\${cards}</div>
      <div class="nav-row">
        <button class="back" type="button" data-action="back" \${state.advancing ? "disabled" : ""}>Back</button>
        <p class="hint">\${state.advancing ? "Next…" : "Tap a card to continue"}</p>
      </div>
    </div>\`;
  }

  function renderCapture() {
    return \`<section class="capture animate">
      <p class="eyebrow">Unlock Your Gamer Audio Profile</p>
      <h2>Where should we send the band?</h2>
      <p class="lede">Name is optional. Email unlocks Immersed, Climbing, or Ready for Pro — and puts you on the HCG1 list.</p>
      <form class="form" data-action="submit">
        <div class="form-row">
          <label><span>First name</span><input type="text" name="firstName" autocomplete="given-name" value="\${escapeHtml(state.firstName)}" placeholder="Alex" /></label>
          <label><span>Email *</span><input type="email" name="email" required autocomplete="email" value="\${escapeHtml(state.email)}" placeholder="you@email.com" /></label>
        </div>
        <label class="opt"><input type="checkbox" name="optIn" \${state.optIn ? "checked" : ""} /> Occasional HCG1 notes and drop alerts. Unsubscribe anytime.</label>
        \${state.error ? \`<p class="error" role="alert">\${escapeHtml(state.error)}</p>\` : ""}
        <button class="button" type="submit" \${state.submitting ? "disabled" : ""}>\${state.submitting ? "Building your profile…" : "Unlock my profile →"}</button>
      </form>
      <div class="nav-row"><button class="back" type="button" data-action="back">Back</button><p class="hint">We do not sell the list.</p></div>
    </section>\`;
  }

  function renderResult() {
    const r = state.result;
    const name = state.firstName ? escapeHtml(state.firstName) + ", you" : "You";
    const promises = (r.promise || []).map((item) => \`<li>\${escapeHtml(item)}</li>\`).join("");
    return \`<section class="result animate">
      <div class="result-grid">
        <div class="result-photo"><img src="/assets/gallery/catalog-hero.jpg" alt="HCG1 Pro Gaming Headset" /></div>
        <div class="result-copy">
          <span class="band-pill" style="background:\${escapeHtml(r.accent)}">Your band · \${escapeHtml(r.bandTitle)}</span>
          <h2>\${name}’re <span style="color:\${escapeHtml(r.accent)}">\${escapeHtml(r.bandTitle)}</span></h2>
          <p class="lede">\${escapeHtml(r.tagline)}</p>
          <p class="quote">“\${escapeHtml(r.quote)}”</p>
          <p>\${escapeHtml(r.story)}</p>
          <div class="chose"><span>You chose</span>\${escapeHtml(r.answerSummary)}</div>
          <ul class="promises">\${promises}</ul>
          <p class="saved">Profile unlocked. You are tagged for HCG1 nurture.</p>
          <div class="cta-row">
            <a class="button" href="/#product">Meet the HCG1 Pro →</a>
            <a class="button button-quiet" href="/#drop">Register your interest</a>
            <button class="back" type="button" data-action="retake">Retake quiz</button>
          </div>
        </div>
      </div>
    </section>\`;
  }

  function render() {
    setProgress();
    root.innerHTML = state.phase === "intro"
      ? renderIntro()
      : state.phase === "questions"
        ? renderQuestion()
        : state.phase === "capture"
          ? renderCapture()
          : renderResult();
  }

  async function pick(optionId) {
    if (state.advancing || state.phase !== "questions") return;
    const q = questions[state.step];
    state.selected = optionId;
    state.advancing = true;
    render();
    await delay(340);
    state.answers[q.id] = optionId;
    state.selected = null;
    state.advancing = false;
    if (state.step < questions.length - 1) {
      state.step += 1;
    } else {
      state.phase = "capture";
    }
    render();
  }

  function goBack() {
    if (state.advancing || state.submitting) return;
    if (state.phase === "questions" && state.step === 0) {
      state.phase = "intro";
      state.answers = {};
      state.selected = null;
    } else if (state.phase === "questions") {
      state.step -= 1;
      const prev = questions[state.step];
      state.selected = state.answers[prev.id] || null;
    } else if (state.phase === "capture") {
      state.phase = "questions";
      state.step = questions.length - 1;
      state.selected = state.answers.pain || null;
      state.error = "";
    }
    render();
  }

  async function submit(form) {
    if (state.submitting) return;
    const data = new FormData(form);
    state.firstName = String(data.get("firstName") || "").trim();
    state.email = String(data.get("email") || "").trim();
    state.optIn = data.get("optIn") === "on";
    state.error = "";
    state.submitting = true;
    render();
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          firstName: state.firstName || undefined,
          answers: state.answers,
          marketingOptIn: state.optIn
        })
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error || "Could not save your profile");
      state.result = payload;
      state.phase = "result";
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    } catch (err) {
      state.error = err instanceof Error ? err.message : "Submit failed";
    } finally {
      state.submitting = false;
      render();
    }
  }

  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.getAttribute("data-action");
    if (action === "start") {
      state.phase = "questions";
      render();
    } else if (action === "pick") {
      pick(target.getAttribute("data-id"));
    } else if (action === "back") {
      goBack();
    } else if (action === "retake") {
      state.phase = "intro";
      state.step = 0;
      state.answers = {};
      state.selected = null;
      state.result = null;
      state.error = "";
      history.replaceState(null, "", "/quiz");
      render();
    }
  });

  root.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-action=submit]");
    if (!form) return;
    event.preventDefault();
    submit(form);
  });

  render();
})();`;

export function renderQuizPage(): Response {
  const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0d0b0a" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta name="description" content="Take the HC GamerLife audio profile quiz. Four taps, a named band, and a soft path to the HCG1 Pro." />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${SITE_URL}/quiz" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="HC GamerLife" />
    <meta property="og:url" content="${SITE_URL}/quiz" />
    <meta property="og:title" content="Gamer Audio Profile Quiz | HC GamerLife" />
    <meta property="og:description" content="Four questions. Your Immersed, Climbing, or Ready for Pro band. Then the HCG1 Pro." />
    <meta property="og:image" content="${SEO_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Gamer Audio Profile Quiz | HC GamerLife" />
    <meta name="twitter:description" content="Find your HCG1 audio profile in sixty seconds." />
    <meta name="twitter:image" content="${SEO_IMAGE}" />
    <link rel="manifest" href="/site.webmanifest" />
    <script type="application/ld+json">${QUIZ_JSON_LD}</script>
    <title>Gamer Audio Profile Quiz | HC GamerLife</title>
    <style>${STYLES}</style>
  </head>
  <body>
    <div class="topline"><strong>FIELD NOTE 002</strong> On-site quiz · no iframe · HCG1 Pro audio profile</div>
    <div class="shell">
      <header>
        <a class="brand" href="/" aria-label="HC GamerLife home"><span class="brand-mark">HC</span> GAMERLIFE</a>
        <a class="nav-link" href="/">Home</a>
      </header>
      <div class="progress-wrap hidden" id="progress-wrap">
        <div class="progress" aria-hidden="true"><i id="progress-bar"></i></div>
        <div class="progress-meta"><span id="progress-step">Question 1 of 4</span><span>HCG1 Pro</span></div>
      </div>
    </div>
    <main class="shell stage">
      <div id="quiz-app"></div>
    </main>
    <script type="application/json" id="quiz-data">${escapeScript(JSON.stringify(clientConfig()))}</script>
    <script>${RUNTIME}</script>
  </body>
</html>`;

  return new Response(page, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "content-security-policy": "default-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'",
      "referrer-policy": "strict-origin-when-cross-origin",
      "x-content-type-options": "nosniff",
      "strict-transport-security": "max-age=31536000"
    }
  });
}
