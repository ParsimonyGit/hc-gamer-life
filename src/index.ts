/// <reference types="@cloudflare/workers-types" />

const MEDIA_SOURCES: Record<string, string> = {
  "product-hero": "https://imagedelivery.net/br_zPISWrxm4a9uyt0OSzw/product-hero",
  "product-angle": "https://imagedelivery.net/br_zPISWrxm4a9uyt0OSzw/product-angle",
  "product-comfort": "https://imagedelivery.net/br_zPISWrxm4a9uyt0OSzw/product-comfort",
  "product-controls": "https://imagedelivery.net/br_zPISWrxm4a9uyt0OSzw/product-controls",
  "campaign-gaming": "https://imagedelivery.net/br_zPISWrxm4a9uyt0OSzw/campaign-gaming",
  "campaign-studio": "https://imagedelivery.net/br_zPISWrxm4a9uyt0OSzw/campaign-studio",
  "campaign-party": "https://imagedelivery.net/br_zPISWrxm4a9uyt0OSzw/campaign-party",
  "campaign-beach": "https://imagedelivery.net/br_zPISWrxm4a9uyt0OSzw/campaign-beach",
  "campaign-streamer": "https://imagedelivery.net/br_zPISWrxm4a9uyt0OSzw/campaign-streamer",
  "campaign-esports": "https://imagedelivery.net/br_zPISWrxm4a9uyt0OSzw/campaign-esports"
};

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
      img { display: block; max-width: 100%; }
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
      .product-photo {
        aspect-ratio: 1 / 1;
        border-radius: 18px;
        filter: drop-shadow(0 26px 28px rgba(0, 0, 0, .38));
        height: 330px;
        margin: 22px auto 18px;
        object-fit: contain;
        position: relative;
        width: 100%;
        z-index: 1;
      }
      .photo-credit { color: #768197; font-size: .7rem; margin: 4px 0 0; position: relative; z-index: 1; }
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
      .visual-product { align-items: stretch; display: grid; gap: 26px; grid-template-columns: 1.15fr .85fr; }
      .visual-main, .visual-card { background: var(--panel); border: 1px solid var(--line); border-radius: 20px; overflow: hidden; position: relative; }
      .visual-main { min-height: 420px; }
      .visual-main img { height: 100%; min-height: 420px; object-fit: cover; object-position: center; width: 100%; }
      .visual-main::after { background: linear-gradient(0deg, rgba(5,8,13,.8), transparent 60%); content: ""; inset: 0; pointer-events: none; position: absolute; }
      .visual-caption { bottom: 25px; left: 27px; max-width: 420px; position: absolute; right: 27px; z-index: 1; }
      .visual-caption h3 { font-size: 1.5rem; margin-bottom: 6px; }
      .visual-caption p { color: #c4ccdb; font-size: .9rem; margin: 0; }
      .visual-stack { display: grid; gap: 26px; grid-template-rows: 1fr 1fr; }
      .visual-card img { height: 100%; min-height: 197px; object-fit: cover; width: 100%; }
      .visual-card span { background: rgba(10,14,22,.82); bottom: 13px; color: var(--ink); font-size: .75rem; left: 13px; padding: 7px 10px; position: absolute; }
      .spec-callout { align-items: center; background: linear-gradient(135deg, rgba(117,229,219,.1), rgba(255,79,94,.08)); border: 1px solid var(--line); border-radius: 16px; display: flex; gap: 15px; margin-top: 24px; padding: 18px; }
      .spec-callout strong { display: block; font-size: 1.03rem; }
      .spec-callout span { color: var(--muted); display: block; font-size: .82rem; margin-top: 2px; }
      .spec-pip { align-items: center; background: var(--cyan); border-radius: 50%; color: #06201f; display: inline-flex; flex: 0 0 auto; font-size: .8rem; font-weight: 900; height: 34px; justify-content: center; width: 34px; }
      .campaign-grid { display: grid; gap: 14px; grid-template-columns: repeat(3, 1fr); }
      .campaign-card { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; position: relative; }
      .campaign-card img { background: #182334; display: block; height: 220px; object-fit: cover; object-position: center; transition: transform .35s ease; width: 100%; }
      .campaign-card:hover img { transform: scale(1.04); }
      .campaign-card figcaption { background: var(--panel); color: var(--ink); font-size: .78rem; padding: 12px 15px 14px; }
      .campaign-card figcaption span { color: var(--cyan); display: block; font-size: .66rem; font-weight: 800; letter-spacing: .11em; margin-bottom: 3px; text-transform: uppercase; }
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
        .visual-product { grid-template-columns: 1fr; }
        .visual-main, .visual-main img { min-height: 350px; }
        .campaign-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 580px) {
        h1 { font-size: clamp(3.05rem, 18vw, 5rem); }
        .topline { font-size: .65rem; }
        .stats { gap: 8px; grid-template-columns: 1fr; padding: 12px 0; }
        .stat { padding: 10px 0; }
        .stat + .stat { border-left: 0; padding-left: 0; }
        .feature-grid, .faq { grid-template-columns: 1fr; }
        .visual-stack { grid-template-rows: 1fr 1fr; }
        .visual-main, .visual-main img { min-height: 285px; }
        .campaign-grid { grid-template-columns: 1fr; }
        .campaign-card img { height: 185px; }
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
          <div class="hero-art" aria-label="HCG1 Pro Gaming Headset product photography" role="img">
            <div class="product-stage">
              <div class="stage-label"><strong>HCG1</strong> / PRO SERIES</div>
              <img class="product-photo" src="/media/image?key=product-hero&amp;width=1000&amp;height=1000&amp;fit=contain" alt="Black and red HCG1 Pro Gaming Headset with detachable microphone" decoding="async" fetchpriority="high" />
              <div class="stage-note"><div class="price-note"><strong>Sound that stays sharp</strong> Hear the moment before it happens.</div><div class="signal" aria-label="Three signal bars"><i></i><i></i><i></i></div></div>
              <div class="photo-credit">Official HCG1 product photography · 53mm drivers · wired 3.5mm</div>
            </div>
          </div>
        </section>

        <div class="stats" aria-label="Product highlights">
          <div class="stat"><strong>53mm drivers</strong><span>Hear footsteps, movement, and music in detail.</span></div>
          <div class="stat"><strong>Detachable mic</strong><span>Clear callouts when the match gets loud.</span></div>
          <div class="stat"><strong>2-year warranty</strong><span>Backed for the sessions ahead.</span></div>
        </div>

        <section id="gallery">
          <div class="section-head"><div><div class="eyebrow">See the HCG1</div><h2>Built to look as sharp as it sounds.</h2></div><p>Black-and-red hardware, a detachable boom mic, and the controls you need close at hand.</p></div>
          <div class="visual-product">
            <article class="visual-main"><img src="/media/image?key=product-angle&amp;width=1200&amp;height=900&amp;fit=cover" alt="HCG1 headset shown at an angle with its detachable microphone" loading="lazy" decoding="async" /><div class="visual-caption"><h3>Focus on the play.</h3><p>The closed-back over-ear fit keeps the room out while the 53mm drivers keep the action clear.</p></div></article>
            <div class="visual-stack">
              <article class="visual-card"><img src="/media/image?key=product-comfort&amp;width=900&amp;height=700&amp;fit=cover" alt="HCG1 earcup and padded headband detail" loading="lazy" decoding="async" /><span>All-weekend comfort</span></article>
              <article class="visual-card"><img src="/media/image?key=product-controls&amp;width=900&amp;height=700&amp;fit=cover" alt="HCG1 detachable boom microphone and inline controls" loading="lazy" decoding="async" /><span>Clear comms, simple controls</span></article>
            </div>
          </div>
          <div class="spec-callout"><span class="spec-pip">53</span><div><strong>53mm stereo drivers</strong><span>20Hz–20kHz response, 32 ohms impedance, and an inline volume controller.</span></div></div>
        </section>

        <section id="scenes">
          <div class="section-head"><div><div class="eyebrow">HCG1 in the wild</div><h2>One headset. Every kind of session.</h2></div><p>From ranked matches to late-night playlists, the HCG1 is made to move with the people who use it.</p></div>
          <div class="campaign-grid">
            <figure class="campaign-card"><img src="/media/image?key=campaign-gaming&amp;width=1200&amp;height=900&amp;fit=cover" alt="Gamer wearing the HCG1 headset during a focused PC session" decoding="async" /><figcaption><span>Ranked mode</span>Lock in and read the room.</figcaption></figure>
            <figure class="campaign-card"><img src="/media/image?key=campaign-studio&amp;width=1200&amp;height=900&amp;fit=cover" alt="Music producer wearing the HCG1 headset in a home studio" decoding="async" /><figcaption><span>Studio time</span>Make every layer count.</figcaption></figure>
            <figure class="campaign-card"><img src="/media/image?key=campaign-party&amp;width=1200&amp;height=900&amp;fit=cover" alt="Friend wearing the HCG1 headset at a rooftop game night" decoding="async" /><figcaption><span>Squad night</span>Pass the controller, keep the energy.</figcaption></figure>
            <figure class="campaign-card"><img src="/media/image?key=campaign-beach&amp;width=1200&amp;height=900&amp;fit=cover" alt="Skater wearing the HCG1 headset on a sunny beach boardwalk" decoding="async" /><figcaption><span>Out of office</span>Your soundtrack travels.</figcaption></figure>
            <figure class="campaign-card"><img src="/media/image?key=campaign-streamer&amp;width=1200&amp;height=900&amp;fit=cover" alt="Streamer wearing the HCG1 headset in a cozy creator setup" decoding="async" /><figcaption><span>Creator mode</span>Clear comms, camera ready.</figcaption></figure>
            <figure class="campaign-card"><img src="/media/image?key=campaign-esports&amp;width=1200&amp;height=900&amp;fit=cover" alt="Esports teammate wearing the HCG1 headset in a tournament arena" decoding="async" /><figcaption><span>Match point</span>Call the play when it matters.</figcaption></figure>
          </div>
        </section>

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
      "content-security-policy": "default-src 'self'; style-src 'unsafe-inline'; img-src 'self' https://www.hcgamerlife.com https://hcgamerlife.com https://raw.githubusercontent.com data:; script-src 'none'; base-uri 'none'; frame-ancestors 'none'",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "permissions-policy": "camera=(), microphone=(), geolocation=()"
};

const clampDimension = (value: string | null, fallback: number, maximum: number): number => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 120), maximum) : fallback;
};

const negotiatedFormat = (request: Request): "avif" | "webp" | undefined => {
  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("image/avif")) return "avif";
  if (accept.includes("image/webp")) return "webp";
  return undefined;
};

async function serveOptimizedImage(request: Request, url: URL): Promise<Response> {
  const sourceKey = url.searchParams.get("key") ?? "";
  const source = MEDIA_SOURCES[sourceKey];
  if (!source) return new Response("Unknown media asset", { status: 404 });

  const width = clampDimension(url.searchParams.get("width"), 1200, 2400);
  const height = clampDimension(url.searchParams.get("height"), 900, 2400);
  const requestedFit = url.searchParams.get("fit");
  const fit = requestedFit === "contain" || requestedFit === "scale-down" ? requestedFit : "cover";
  const format = negotiatedFormat(request);
  const requestedVariant = url.searchParams.get("variant");
  const defaultVariant = sourceKey === "product-hero" ? "product" : sourceKey === "product-angle" ? "hero" : "card";
  const variant = requestedVariant === "public" || requestedVariant === "product" || requestedVariant === "hero" || requestedVariant === "card"
    ? requestedVariant
    : defaultVariant;
  const imageDeliverySource = source.includes("imagedelivery.net/") ? `${source}/${variant}` : source;
  const cacheUrl = new URL(request.url);
  cacheUrl.searchParams.set("format", format ?? "source");
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
  const cache = (caches as unknown as { default: Cache }).default;
  let cached: Response | undefined;
  try {
    cached = await cache.match(cacheKey);
  } catch {
    cached = undefined;
  }
  if (cached) return cached;

  let upstream: Response | undefined;
  try {
    upstream = source.includes("imagedelivery.net/")
      ? await fetch(imageDeliverySource)
      : await fetch(source, {
          cf: {
            image: {
              fit,
              width,
              height,
              quality: 82,
              ...(format ? { format } : {})
            }
          }
        } as RequestInit);
  } catch {
    upstream = undefined;
  }

  if (!upstream?.ok) {
    try {
      upstream = await fetch(imageDeliverySource);
    } catch {
      upstream = undefined;
    }
  }
  if (!upstream?.ok) return new Response("Media source unavailable", { status: 502 });
  const headers = new Headers(upstream.headers);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("cdn-cache-control", "public, max-age=31536000, immutable");
  headers.set("vary", "Accept");
  headers.set("cross-origin-resource-policy", "same-origin");
  const response = new Response(upstream.body, { status: upstream.status, headers });
  try {
    await cache.put(cacheKey, response.clone());
  } catch {
    // Cache writes are best effort; the transformed response is still valid.
  }
  return response;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/healthz") {
      return new Response(JSON.stringify({ ok: true, service: "hc-gamer-life" }), {
        headers: { "content-type": "application/json; charset=UTF-8", "cache-control": "no-store" }
      });
    }
    if (url.pathname === "/media/image") return serveOptimizedImage(request, url);
    return new Response(PAGE, { headers: HEADERS });
  }
};

