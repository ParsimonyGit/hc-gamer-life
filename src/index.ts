const PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0a0e16" />
    <meta name="description" content="HC GamerLife makes long sessions sound better. Meet the HCG1 Pro Gaming Headset." />
    <title>HC GamerLife | Lock in. Play longer.</title>
    <style>
      :root {
        color-scheme: dark;
        --ink: #f5f7fb;
        --muted: #a8b1c4;
        --line: rgba(181, 196, 224, .16);
        --bg: #0a0e16;
        --panel: #101722;
        --panel-2: #131d2b;
        --red: #ff4f5e;
        --red-deep: #c92f4c;
        --cyan: #75e5db;
        --max: 1160px;
      }

      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--ink);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.5;
      }
      a { color: inherit; text-decoration: none; }
      .shell { width: min(var(--max), calc(100% - 40px)); margin: 0 auto; }
      .eyebrow {
        color: var(--cyan);
        font-size: .73rem;
        font-weight: 800;
        letter-spacing: .18em;
        text-transform: uppercase;
      }
      .topline {
        border-bottom: 1px solid var(--line);
        color: var(--muted);
        font-size: .77rem;
        letter-spacing: .08em;
        padding: 11px 0;
        text-align: center;
        text-transform: uppercase;
      }
      .topline strong { color: var(--ink); }
      header {
        align-items: center;
        display: flex;
        justify-content: space-between;
        padding: 25px 0;
      }
      .brand { align-items: center; display: inline-flex; gap: 11px; font-weight: 850; letter-spacing: -.04em; }
      .brand-mark {
        align-items: center;
        background: var(--red);
        border-radius: 10px;
        color: #19090e;
        display: inline-flex;
        font-size: .8rem;
        height: 33px;
        justify-content: center;
        letter-spacing: -.08em;
        width: 38px;
      }
      nav { display: flex; gap: 27px; }
      nav a { color: var(--muted); font-size: .88rem; }
      nav a:hover, nav a:focus-visible { color: var(--ink); }
      .nav-cta { border: 1px solid var(--line); border-radius: 999px; color: var(--ink); padding: 9px 15px; }
      .hero {
        align-items: center;
        display: grid;
        gap: 55px;
        grid-template-columns: 1.02fr .98fr;
        min-height: 615px;
        padding: 55px 0 76px;
      }
      h1, h2, h3, p { margin-top: 0; }
      h1 { font-size: clamp(3.35rem, 8vw, 6.6rem); letter-spacing: -.085em; line-height: .92; margin-bottom: 25px; max-width: 720px; }
      h1 span { color: var(--red); }
      .hero-copy > p { color: var(--muted); font-size: clamp(1.05rem, 1.7vw, 1.22rem); max-width: 510px; }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 33px; }
      .button { border-radius: 999px; display: inline-flex; font-size: .9rem; font-weight: 800; padding: 14px 20px; transition: transform .2s, background .2s; }
      .button:hover, .button:focus-visible { transform: translateY(-2px); }
      .button-primary { background: var(--red); color: #210a10; }
      .button-primary:hover, .button-primary:focus-visible { background: #ff6673; }
      .button-quiet { border: 1px solid var(--line); color: var(--ink); }
      .button-quiet:hover, .button-quiet:focus-visible { background: var(--panel-2); }
      .microproof { color: #768197; font-size: .78rem; margin: 18px 0 0; }
      .hero-art { position: relative; }
      .hero-art::before {
        background: radial-gradient(circle, rgba(255, 79, 94, .3), transparent 65%);
        content: "";
        inset: 8% -9% -10% 4%;
        position: absolute;
        filter: blur(18px);
      }
      .product-stage {
        background: linear-gradient(145deg, #192437, #0c121c 68%);
        border: 1px solid var(--line);
        border-radius: 26px;
        min-height: 480px;
        overflow: hidden;
        padding: 29px;
        position: relative;
      }
      .product-stage::after {
        background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
        background-size: 34px 34px;
        content: "";
        inset: 0;
        mask-image: linear-gradient(to bottom, black, transparent 85%);
        opacity: .5;
        position: absolute;
      }
      .stage-label { color: var(--muted); font-size: .76rem; letter-spacing: .12em; position: relative; text-transform: uppercase; z-index: 1; }
      .stage-label strong { color: var(--ink); }
      .headset {
        display: block;
        height: auto;
        margin: 29px auto 8px;
        max-width: 92%;
        position: relative;
        transform: rotate(-7deg);
        z-index: 1;
      }
      .stage-note { align-items: end; display: flex; justify-content: space-between; position: relative; z-index: 1; }
      .price-note { color: var(--muted); font-size: .84rem; }
      .price-note strong { color: var(--ink); display: block; font-size: 1.18rem; }
      .signal { display: flex; gap: 5px; }
      .signal i { background: var(--cyan); border-radius: 3px; display: block; height: 7px; width: 7px; }
      .signal i:nth-child(2) { opacity: .7; }
      .signal i:nth-child(3) { opacity: .45; }
      .stats { border-bottom: 1px solid var(--line); border-top: 1px solid var(--line); display: grid; grid-template-columns: repeat(3, 1fr); }
      .stat { padding: 23px 0; }
      .stat + .stat { border-left: 1px solid var(--line); padding-left: 28px; }
      .stat strong { display: block; font-size: 1.03rem; }
      .stat span { color: var(--muted); display: block; font-size: .83rem; margin-top: 3px; }
      section { padding: 116px 0; }
      .section-head { align-items: end; display: flex; gap: 30px; justify-content: space-between; margin-bottom: 45px; }
      h2 { font-size: clamp(2.25rem, 5vw, 4.4rem); letter-spacing: -.075em; line-height: .95; margin-bottom: 0; max-width: 650px; }
      .section-head p { color: var(--muted); margin-bottom: 0; max-width: 365px; }
      .feature-grid { display: grid; gap: 15px; grid-template-columns: repeat(3, 1fr); }
      .feature-card { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; padding: 27px; }
      .feature-card:nth-child(2) { background: linear-gradient(145deg, rgba(117,229,219,.1), var(--panel) 60%); }
      .feature-card:nth-child(3) { background: linear-gradient(145deg, rgba(255,79,94,.13), var(--panel) 60%); }
      .feature-icon { align-items: center; background: var(--panel-2); border: 1px solid var(--line); border-radius: 11px; display: flex; height: 44px; justify-content: center; margin-bottom: 28px; width: 44px; }
      .feature-icon svg { height: 21px; width: 21px; }
      h3 { font-size: 1.16rem; letter-spacing: -.035em; margin-bottom: 9px; }
      .feature-card p { color: var(--muted); font-size: .92rem; margin-bottom: 0; }
      .manifesto { background: var(--red); color: #250b12; overflow: hidden; padding: 95px 0; position: relative; }
      .manifesto::after { border: 1px solid rgba(37,11,18,.22); border-radius: 50%; content: ""; height: 560px; position: absolute; right: -80px; top: -210px; width: 560px; }
      .manifesto .shell { position: relative; z-index: 1; }
      .manifesto .eyebrow { color: #651c28; }
      .manifesto h2 { max-width: 800px; }
      .manifesto p { font-size: 1.06rem; margin: 25px 0 0; max-width: 560px; }
      .details { display: grid; gap: 60px; grid-template-columns: .8fr 1.2fr; }
      .details-copy p { color: var(--muted); max-width: 430px; }
      .specs { border-top: 1px solid var(--line); }
      .spec-row { align-items: baseline; border-bottom: 1px solid var(--line); display: flex; gap: 20px; justify-content: space-between; padding: 17px 0; }
      .spec-row span { color: var(--muted); font-size: .85rem; }
      .spec-row strong { font-size: .94rem; text-align: right; }
      .faq { display: grid; gap: 10px; grid-template-columns: repeat(2, 1fr); }
      details { background: var(--panel); border: 1px solid var(--line); border-radius: 13px; padding: 17px 18px; }
      summary { cursor: pointer; font-size: .92rem; font-weight: 750; list-style: none; }
      summary::-webkit-details-marker { display: none; }
      summary::after { color: var(--cyan); content: "+"; float: right; font-size: 1.25rem; font-weight: 400; line-height: 1; }
      details[open] summary::after { content: "–"; }
      details p { color: var(--muted); font-size: .86rem; margin: 13px 18px 2px 0; }
      .closing { background: var(--panel); border: 1px solid var(--line); border-radius: 22px; overflow: hidden; padding: 45px; position: relative; }
      .closing::before { background: var(--red); border-radius: 50%; content: ""; filter: blur(1px); height: 220px; opacity: .8; position: absolute; right: -75px; top: -105px; width: 220px; }
      .closing h2 { font-size: clamp(2.25rem, 5vw, 4rem); max-width: 640px; position: relative; }
      .closing p { color: var(--muted); max-width: 500px; position: relative; }
      footer { border-top: 1px solid var(--line); color: var(--muted); font-size: .8rem; padding: 25px 0 35px; }
      .footer-row { align-items: center; display: flex; justify-content: space-between; }
      .footer-row .brand { color: var(--ink); }
      :focus-visible { outline: 2px solid var(--cyan); outline-offset: 4px; }
      @media (max-width: 820px) {
        .shell { width: min(var(--max), calc(100% - 28px)); }
        nav { display: none; }
        header { padding: 18px 0; }
        .hero { gap: 34px; grid-template-columns: 1fr; padding: 50px 0 55px; }
        .product-stage { min-height: 385px; }
        section { padding: 78px 0; }
        .section-head, .details { display: block; }
        .section-head p { margin-top: 18px; }
        .details-copy { margin-bottom: 40px; }
      }
      @media (max-width: 580px) {
        h1 { font-size: clamp(3.05rem, 18vw, 5rem); }
        .topline { font-size: .65rem; }
        .stats { gap: 8px; grid-template-columns: 1fr; padding: 12px 0; }
        .stat { padding: 10px 0; }
        .stat + .stat { border-left: 0; padding-left: 0; }
        .feature-grid, .faq { grid-template-columns: 1fr; }
        .closing { padding: 30px 24px; }
        .footer-row { align-items: start; flex-direction: column; gap: 12px; }
      }
    </style>
  </head>
  <body>
    <div class="topline"><strong>Built for the long session.</strong> Wired comfort, clear comms, zero drama.</div>
    <div class="shell">
      <header>
        <a class="brand" href="#top" aria-label="HC GamerLife home"><span class="brand-mark">HC</span> GAMERLIFE</a>
        <nav aria-label="Main navigation">
          <a href="#product">The headset</a>
          <a href="#setup">Your setup</a>
          <a href="#faq">FAQ</a>
          <a class="nav-cta" href="#drop">Get in the game</a>
        </nav>
      </header>
    </div>

    <main id="top">
      <div class="shell">
        <section class="hero">
          <div class="hero-copy">
            <div class="eyebrow">HCG1 Pro Gaming Headset</div>
            <h1>Lock in.<br /><span>Play longer.</span></h1>
            <p>Crystal-clear game audio, a mic that keeps your squad close, and comfort that holds up when “one more match” turns into an all-nighter.</p>
            <div class="actions">
              <a class="button button-primary" href="#product">Meet the HCG1 <span aria-hidden="true">↗</span></a>
              <a class="button button-quiet" href="#setup">Check your setup</a>
            </div>
            <p class="microproof">Made for everyday players on console, PC, and mobile.</p>
          </div>
          <div class="hero-art" aria-label="Stylized illustration of the HCG1 headset" role="img">
            <div class="product-stage">
              <div class="stage-label"><strong>HCG1</strong> / PRO SERIES</div>
              <svg class="headset" viewBox="0 0 560 390" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M137 234V177C137 83.2 198.8 30 280 30C361.2 30 423 83.2 423 177V234" stroke="#EAF1FF" stroke-width="30" stroke-linecap="round"/>
                <path d="M137 235C137 211.8 119.2 193 97.2 193C75.2 193 57 211.8 57 235V290C57 313.2 75.2 332 97.2 332C119.2 332 137 313.2 137 290V235Z" fill="#172335" stroke="#F2F6FF" stroke-width="13"/>
                <path d="M423 235C423 211.8 440.8 193 462.8 193C484.8 193 503 211.8 503 235V290C503 313.2 484.8 332 462.8 332C440.8 332 423 313.2 423 290V235Z" fill="#172335" stroke="#F2F6FF" stroke-width="13"/>
                <path d="M93 272H116" stroke="#FF4F5E" stroke-width="12" stroke-linecap="round"/>
                <path d="M444 272H467" stroke="#75E5DB" stroke-width="12" stroke-linecap="round"/>
                <path d="M421 295C449 301 461 315 465 338" stroke="#FF4F5E" stroke-width="10" stroke-linecap="round"/>
                <path d="M465 338H503" stroke="#FF4F5E" stroke-width="10" stroke-linecap="round"/>
                <path d="M504 338C522 338 530 351 530 360" stroke="#FF4F5E" stroke-width="10" stroke-linecap="round"/>
                <circle cx="280" cy="44" r="13" fill="#FF4F5E"/>
              </svg>
              <div class="stage-note"><div class="price-note"><strong>Sound that stays sharp</strong> Hear the moment before it happens.</div><div class="signal" aria-label="Three signal bars"><i></i><i></i><i></i></div></div>
            </div>
          </div>
        </section>

        <div class="stats" aria-label="Product highlights">
          <div class="stat"><strong>3.5mm ready</strong><span>Plug into the gear you already own.</span></div>
          <div class="stat"><strong>Detachable mic</strong><span>Clear callouts when the match gets loud.</span></div>
          <div class="stat"><strong>2-year warranty</strong><span>Backed for the sessions ahead.</span></div>
        </div>

        <section id="product">
          <div class="section-head"><div><div class="eyebrow">Why HCG1</div><h2>Every detail earns its spot.</h2></div><p>Good gear disappears into the moment. You hear more, say more, and think less about what is on your head.</p></div>
          <div class="feature-grid">
            <article class="feature-card"><div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 15a8 8 0 0 1 16 0"/><path d="M4 15v3a2 2 0 0 0 2 2h1v-5H4Zm16 0v3a2 2 0 0 1-2 2h-1v-5h3Z"/><path d="M12 7v4m-2 0h4"/></svg></div><h3>Sound with a point of view</h3><p>Balanced stereo audio keeps footsteps, movement, and your favorite soundtrack distinct when the screen gets busy.</p></article>
            <article class="feature-card"><div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 5v7a5 5 0 0 0 10 0V5"/><path d="M4 10v2a8 8 0 0 0 16 0v-2M12 20v-3m-3 3h6"/></svg></div><h3>Comfort for the “last game”</h3><p>Soft over-ear cushions and a flexible fit stay easy through long queues, long flights, and long nights with friends.</p></article>
            <article class="feature-card"><div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3 5 6v5c0 4.5 2.9 8.2 7 10 4.1-1.8 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg></div><h3>Ready when you are</h3><p>A detachable boom mic, inline controls, and broad device compatibility keep the setup simple and the focus where it belongs.</p></article>
          </div>
        </section>
      </div>

      <section class="manifesto"><div class="shell"><div class="eyebrow">The player mindset</div><h2>Bring your whole self to the session.</h2><p>For the players who chase a cleaner callout, a closer finish, and the kind of comfort that lets the night unfold. HC GamerLife is gear for showing up again tomorrow.</p></div></section>

      <div class="shell">
        <section id="setup"><div class="details"><div class="details-copy"><div class="eyebrow">Your setup</div><h2>One jack. Every lobby.</h2><p>Use the included 3.5mm connection with the devices you already play on. The HCG1 is designed to move with you from desk to couch to wherever the next match starts.</p></div><div class="specs" aria-label="HCG1 specifications"><div class="spec-row"><span>Connection</span><strong>Wired 3.5mm · inline controls</strong></div><div class="spec-row"><span>Microphone</span><strong>Detachable boom · inline mute</strong></div><div class="spec-row"><span>Fit</span><strong>Closed-back over-ear</strong></div><div class="spec-row"><span>Compatibility</span><strong>PC · PlayStation · Xbox · Switch · mobile</strong></div><div class="spec-row"><span>Coverage</span><strong>Two-year warranty</strong></div></div></div></section>
        <section id="faq"><div class="section-head"><div><div class="eyebrow">Quick answers</div><h2>Before you queue up.</h2></div><p>Keep the setup moving. Here are the details players ask about most.</p></div><div class="faq"><details><summary>Is the microphone removable?</summary><p>Yes. Remove the boom mic when you are playing solo or listening on the go.</p></details><details><summary>Does it work across consoles?</summary><p>Yes. The wired 3.5mm connection works with PC, PlayStation, Xbox, Nintendo Switch, and compatible mobile devices. Some setups may need the included adapter.</p></details><details><summary>Does it use active noise cancellation?</summary><p>No. The closed-back design offers passive isolation so you can stay focused without a battery or software.</p></details><details><summary>How is it supported?</summary><p>Every HCG1 comes with a two-year, no-questions-asked warranty for extra confidence in your gear.</p></details></div></section>
        <section id="drop"><div class="closing"><div class="eyebrow">Your next main character arc</div><h2>Hear the play. Call the play. Own the moment.</h2><p>The store link and custom domain can drop in here when you are ready. The Worker is already set up to carry the experience.</p><a class="button button-primary" href="#top">Back to the top <span aria-hidden="true">↑</span></a></div></section>
      </div>
    </main>

    <div class="shell"><footer><div class="footer-row"><a class="brand" href="#top"><span class="brand-mark">HC</span> GAMERLIFE</a><span>Original concept site · Built for the long session.</span></div></footer></div>
  </body>
</html>`;

const HEADERS = {
  "content-type": "text/html; charset=UTF-8",
  "cache-control": "public, max-age=300",
  "content-security-policy": "default-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:; script-src 'none'; base-uri 'none'; frame-ancestors 'none'",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "permissions-policy": "camera=(), microphone=(), geolocation=()"
};

export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    if (url.pathname === "/healthz") {
      return new Response(JSON.stringify({ ok: true, service: "hc-gamer-life" }), {
        headers: { "content-type": "application/json; charset=UTF-8", "cache-control": "no-store" }
      });
    }
    return new Response(PAGE, { headers: HEADERS });
  }
};


