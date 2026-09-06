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

const SITE_URL = "https://hcgamerlife.org";
const SEO_IMAGE_URL = `${SITE_URL}/media/image?key=product-hero&variant=product&v=4`;
type Env = {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_PRICE_ID?: string;
};
const safeJsonLd = (value: unknown): string => JSON.stringify(value).replace(/</g, "\\u003c");
const HOME_JSON_LD = safeJsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "HC GamerLife",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      description: "Practical gaming gear, setup advice, and long-session guides for everyday players."
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "HC GamerLife",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      description: "Gaming headset guides, setup help, and game-night ideas for players who stay for one more match."
    },
    {
      "@type": "Product",
      name: "HCG1 Pro Gaming Headset",
      image: [SEO_IMAGE_URL],
      description: "A wired over-ear gaming headset with 53mm stereo drivers, detachable microphone, inline controls, and broad device compatibility.",
      brand: { "@type": "Brand", name: "HC GamerLife" },
      category: "Gaming headset",
      additionalProperty: [
        { "@type": "PropertyValue", name: "Connection", value: "Wired 3.5mm" },
        { "@type": "PropertyValue", name: "Microphone", value: "Detachable boom" },
        { "@type": "PropertyValue", name: "Drivers", value: "53mm stereo" }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Is the microphone removable?", acceptedAnswer: { "@type": "Answer", text: "Yes. Remove the boom microphone for solo play or listening on the go." } },
        { "@type": "Question", name: "Does it work across consoles?", acceptedAnswer: { "@type": "Answer", text: "The wired 3.5mm connection works with PC, PlayStation, Xbox, Nintendo Switch, and compatible mobile devices." } },
        { "@type": "Question", name: "Does it use active noise cancellation?", acceptedAnswer: { "@type": "Answer", text: "No. The closed-back design provides passive isolation without a battery or software." } }
      ]
    }
  ]
});

type Article = {
  slug: string;
  section: string;
  title: string;
  excerpt: string;
  body: string;
};

const ARTICLES: Article[] = [
  {
    slug: "wired-vs-wireless-gaming-headsets",
    section: "Buyer's guide",
    title: "Wired vs. wireless gaming headsets: choose your play style",
    excerpt: "The right connection comes down to how you play, where you play, and how much setup you want between you and the next match.",
    body: `<p>There is no universal winner between wired and wireless audio. The better choice is the one that fits the way your sessions actually happen. A desk player who wants a simple, always-ready setup has different priorities from someone who moves between a console, a couch, and a phone.</p><h2>Choose wired when you want simple reliability</h2><p>A wired headset starts working as soon as it is plugged in. There is no battery to charge, pairing menu to troubleshoot, or wireless mode to remember. A good 3.5mm connection also makes it easy to move between compatible devices.</p><p>The tradeoff is the cable. Route it behind the desk, leave a little slack near the controller, and keep the inline controls where your hand can find them without looking.</p><h2>Choose wireless when movement matters most</h2><p>Wireless is a great fit for players who stand up often, play from a couch, or want a clean desk. Keep an eye on battery habits and make sure the headset supports the devices you use. A fast charging routine is as important as the headset itself.</p><h2>The practical answer</h2><p>If you value a low-friction setup and broad compatibility, wired is still a strong choice. If freedom of movement is the feature you notice every session, wireless may be worth the extra charging step. Start with the habit you want to improve, then choose the connection that supports it.</p>`
  },
  {
    slug: "long-session-headset-comfort",
    section: "Setup",
    title: "What makes a gaming headset comfortable for a long session?",
    excerpt: "Comfort is more than soft padding. Fit, weight, heat, and small adjustments decide whether a headset disappears into the moment.",
    body: `<p>A headset can sound excellent and still end a session early if the fit keeps asking for attention. Long-session comfort comes from a few small details working together: even pressure, breathable contact points, a headband that stays put, and controls that do not force you to reach.</p><h2>Look for even pressure</h2><p>The earcups should sit around your ears instead of pressing directly on them. The headband should feel supportive without creating a hot spot at the top of your head. If you are constantly shifting the headset, the fit is giving you useful information.</p><h2>Give heat somewhere to go</h2><p>Over-ear cushions create a quiet seal, but they also hold warmth. Take a short break between matches, keep hair and glasses frames clear of the cushion edge, and store the headset somewhere dry rather than inside a closed bag.</p><h2>Make the setup do less</h2><p>Place the volume control where your hand naturally rests. Keep the cable or wireless receiver out of the path of your chair. The best comfort upgrade is often removing the tiny interruptions that make you notice your gear.</p>`
  },
  {
    slug: "fix-party-chat-echo",
    section: "Setup",
    title: "How to fix party-chat echo without guesswork",
    excerpt: "Echo usually has a small number of causes. This quick checklist helps you isolate the problem before you change everything.",
    body: `<p>When a teammate hears their own voice, start with the simplest possibility: sound from your headset or TV is leaking back into the microphone. Lower the game and chat volume for a moment, then ask whether the echo changes.</p><h2>Check the microphone path</h2><p>Move the microphone slightly to the side of your mouth, about a finger-width away. Make sure the microphone opening is not pointed directly at the earcup. If your setup has a mute switch, toggle it once to confirm the input is being recognized.</p><h2>Check the output device</h2><p>Confirm that chat audio is going to the headset rather than the television or monitor. On a computer, open the sound settings and make sure the headset is selected for both input and output.</p><h2>Test one change at a time</h2><p>Echo is much easier to solve when you change one setting, test, and keep the result. If the issue follows one controller or one app, the headset may be fine and the problem may be in that device's chat routing.</p>`
  },
  {
    slug: "balance-game-and-chat-audio",
    section: "Setup",
    title: "How to balance game audio and chat audio",
    excerpt: "Your squad should be clear without turning the game into background noise. Start with a repeatable mix instead of chasing one perfect number.",
    body: `<p>Good audio balance lets you understand a callout and still feel what is happening in the game. Begin with both channels at a comfortable middle level. Then ask one question: can you understand a teammate without losing the important game cues?</p><h2>Use voices as the reference</h2><p>Set chat so a normal speaking voice is easy to follow. If voices are sharp or tiring, lower the overall volume before you change equalizer settings. Clear is more useful than loud.</p><h2>Protect the cues you rely on</h2><p>Footsteps, movement, reloads, and objective sounds should sit apart from music and effects. If the game offers separate sliders, lower music first and then adjust effects until the important cues return.</p><h2>Save a second profile</h2><p>Keep one balanced profile for multiplayer and another for story games or music. A small amount of preparation means you can switch modes without rebuilding your mix every night.</p>`
  },
  {
    slug: "detachable-microphone-guide",
    section: "Buyer’s guide",
    title: "What a detachable microphone is actually useful for",
    excerpt: "A removable boom mic gives one headset more than one job, especially when gaming, listening, and travel share the same gear.",
    body: `<p>A detachable microphone is a small design choice with a practical effect. Keep it attached for team play and calls, then remove it when you want a cleaner profile for music, travel, or solo play.</p><h2>It keeps the mic where it belongs</h2><p>A boom microphone sits closer to your mouth than a built-in laptop or controller mic. That usually means clearer speech and less room noise, provided the boom is placed just off the corner of your mouth.</p><h2>It makes the headset easier to live with</h2><p>Removable hardware is easier to pack and less likely to snag on a bag. Store the microphone in a small pocket rather than leaving it attached while the headset is compressed.</p><h2>It is also a backup plan</h2><p>If you switch from multiplayer to music, removing the mic changes the feel immediately. The headset can move with you instead of staying tied to one kind of session.</p>`
  },
  {
    slug: "console-and-pc-headset-setup",
    section: "Setup",
    title: "A simple console and PC headset setup guide",
    excerpt: "Get the connection right first, then tune the details that make voice chat and game audio feel natural.",
    body: `<p>Start by identifying the device that should receive both game audio and your microphone. On consoles, that is often the controller or a console headset port. On a PC, it may be a combined jack, a splitter, or a small USB adapter.</p><h2>Connect before changing settings</h2><p>Plug in the headset, then open the device sound menu. Select the headset as both the output and input device. Speak once and watch for the input meter to move before you enter a party.</p><h2>Set a comfortable baseline</h2><p>Keep the main volume below the point where voices feel sharp. Test the microphone with a friend or a private recording. If the voice is quiet, move the mic closer before raising every other level.</p><h2>Save the physical details</h2><p>Leave enough cable slack to turn your chair or move the controller. A two-minute cable tidy now prevents the sudden tug that ends a good match later.</p>`
  },
  {
    slug: "hear-footsteps-and-directional-cues",
    section: "Game audio",
    title: "How to hear footsteps and directional cues more clearly",
    excerpt: "Better positional awareness starts with a clean mix and a quiet setup, not simply turning everything up.",
    body: `<p>Directional audio works best when the signal has room to breathe. Start by lowering music and unnecessary effects. The goal is not maximum loudness; it is enough separation to notice a sound before it becomes urgent.</p><h2>Keep both sides of the headset sealed</h2><p>A loose earcup or uneven fit can make one direction seem farther away. Adjust the headband and check that glasses arms or hair are not breaking the seal.</p><h2>Use a familiar test</h2><p>Choose a safe area in a game and move in a circle around a fixed sound source. Listen for whether the sound follows your movement smoothly. If it jumps, check the game mix and platform settings before blaming the headset.</p><h2>Take care of your ears</h2><p>Fatigue makes subtle cues harder to hear. Short breaks and a moderate listening level will help more than pushing the volume higher.</p>`
  },
  {
    slug: "gaming-with-glasses",
    section: "Comfort",
    title: "How to choose and wear a headset with glasses",
    excerpt: "The right fit keeps the earcup comfortable around your frames without giving up a stable seal.",
    body: `<p>Glasses and headsets can work well together when the contact points are managed. The frame arm should sit in the cushion groove rather than being pressed sharply against the side of your head.</p><h2>Start with the frame</h2><p>Thinner, straighter arms are usually easier to accommodate, but the most important detail is where they cross the cushion. Adjust the headset slightly forward or back until the pressure feels even.</p><h2>Set the headband once</h2><p>Raise or lower the headband so the earcups sit centered around your ears. If you keep widening the headset to make room, you may be trading short-term relief for a loose fit.</p><h2>Make comfort a repeatable check</h2><p>After ten minutes, ask whether the frames are creating one hot spot. If they are, make a small adjustment before the next match rather than waiting for discomfort to build.</p>`
  },
  {
    slug: "clean-gaming-headset",
    section: "Care",
    title: "How to clean your gaming headset safely",
    excerpt: "A gentle routine keeps cushions, headbands, and controls comfortable without soaking the parts that carry the signal.",
    body: `<p>Unplug the headset before cleaning. Use a dry, soft cloth for the headband and hard surfaces, then a barely damp cloth for marks that need more help. Keep liquid away from the microphone opening, inline control, and connector.</p><h2>Care for the cushions</h2><p>Wipe the cushion surface lightly and let it dry fully before wearing the headset. If the cushions are removable, follow the manufacturer instructions rather than pulling at the seam.</p><h2>Keep the microphone clear</h2><p>Use a dry cotton swab around the microphone grille, never inside it. Store a detachable microphone separately when the headset is in a bag.</p><h2>Finish with the cable</h2><p>Coil the cable loosely instead of wrapping it tightly around the earcups. Tight bends are harder on the cable than a relaxed loop.</p>`
  },
  {
    slug: "reduce-gaming-desk-cable-clutter",
    section: "Setup",
    title: "How to reduce cable clutter at a gaming desk",
    excerpt: "A cleaner cable path makes the setup easier to use and protects the connection from sudden pulls.",
    body: `<p>Start by deciding where the headset should rest when it is not on your head. A hook or the side of the desk keeps the cable from collecting under a chair wheel.</p><h2>Give the cable one route</h2><p>Run the cable along the back edge of the desk, leaving one relaxed loop near the controller or keyboard. Use soft ties rather than tight knots so the cable can still move.</p><h2>Keep controls within reach</h2><p>Place the inline volume control where you can find it without looking. If the control disappears behind the desk, you will end up reaching for system menus during the match.</p><h2>Leave room to move</h2><p>Sit down and turn your chair before you finalize the route. The right setup has enough slack for normal movement and no slack dangling near wheels.</p>`
  },
  {
    slug: "plan-a-low-pressure-squad-night",
    section: "Game night",
    title: "How to plan a low-pressure squad night",
    excerpt: "The best group sessions leave room for changing games, late arrivals, and the friend who only has twenty minutes.",
    body: `<p>Pick a loose start time and one anchor activity, then let the night move. A simple plan keeps the group from spending the first hour asking what everyone wants to play.</p><h2>Offer three lanes</h2><p>Have one competitive option, one co-op option, and one low-stakes option ready. People can move between them without making the whole group restart.</p><h2>Make joining easy</h2><p>Share the game, platform, and voice-chat plan in one message. If a friend arrives late, give them a clear way to join rather than asking them to reconstruct the evening.</p><h2>End while it is still fun</h2><p>A good squad night does not have to run until everyone is exhausted. Stop after a strong final round and leave the group wanting another session.</p>`
  },
  {
    slug: "first-gaming-headset-gift-guide",
    section: "Buyer’s guide",
    title: "A first gaming headset guide for gift buyers",
    excerpt: "When you do not know every detail of someone’s setup, choose the features that create the fewest compatibility surprises.",
    body: `<p>A first headset should be comfortable, easy to connect, and useful across more than one device. Ask what platform the player uses most, then look for a connection that matches that setup.</p><h2>Prioritize fit and microphone quality</h2><p>Players notice an uncomfortable headset immediately. A removable or adjustable microphone also makes the gift more flexible for music, travel, and solo games.</p><h2>Do not overbuy features</h2><p>Extra modes and software can be useful, but they also add setup. For a first headset, reliable stereo audio, simple controls, and a clear warranty are often better value.</p><h2>Make the gift easy to use</h2><p>Include a short setup note with the connection type and the first three steps. The best gift is one that can be used the same day it is opened.</p>`
  },
  {
    slug: "weekend-squad-night",
    section: "Game night",
    title: "The weekend squad-night playbook",
    excerpt: "A flexible mix of games, food, and audio habits keeps a group together even when everyone has a different energy level.",
    body: `<p>Start with a familiar game for the first round. It gives everyone time to arrive, catch up, and settle into the voice chat before you ask the group to learn something new.</p><h2>Build in a reset</h2><p>After two or three rounds, take five minutes to stretch, refill a drink, and check the headset fit. A small reset keeps the night from turning into a test of endurance.</p><h2>Keep the playlist in the background</h2><p>Music should support the room rather than compete with the conversation. Let the person who is not playing choose the next track, then lower it when a match begins.</p><h2>Save a highlight</h2><p>Write down the funniest moment or closest finish before everyone signs off. A tiny record gives the next squad night a natural opening.</p>`
  }
];

const ARTICLE_MEDIA_KEYS = [
  "campaign-gaming", "campaign-studio", "campaign-party", "campaign-beach",
  "campaign-streamer", "campaign-esports", "product-angle", "product-comfort",
  "product-controls", "campaign-party", "campaign-streamer", "campaign-gaming"
];

const articleMediaKey = (article: Article): string => ARTICLE_MEDIA_KEYS[Math.max(0, ARTICLES.indexOf(article))] ?? "campaign-gaming";

const JOURNAL_CARDS = ARTICLES.map((article) => `<a class="journal-card" href="/journal/${article.slug}"><div class="journal-card-image"><img src="/media/image?key=${articleMediaKey(article)}&amp;variant=card&amp;v=3" alt="${article.title}" loading="lazy" decoding="async" /></div><div class="journal-card-copy"><span class="journal-kicker">${article.section}</span><h3>${article.title}</h3><p>${article.excerpt}</p><span class="journal-link">Read the guide ↗</span></div></a>`).join("");

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#ff4f5e"/><text x="32" y="40" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="800" fill="#19090e">HC</text></svg>`;
const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}/</loc></url>${ARTICLES.map((article) => `<url><loc>${SITE_URL}/journal/${article.slug}</loc></url>`).join("")}</urlset>`;
const MANIFEST_JSON = JSON.stringify({ name: "HC GamerLife", short_name: "HC GamerLife", start_url: "/", display: "standalone", background_color: "#0a0e16", theme_color: "#0a0e16", icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }] });

const PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0a0e16" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta name="description" content="HC GamerLife makes long sessions sound better. Meet the HCG1 Pro Gaming Headset." />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="HC GamerLife" />
    <link rel="canonical" href="${SITE_URL}/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="HC GamerLife" />
    <meta property="og:url" content="${SITE_URL}/" />
    <meta property="og:title" content="HC GamerLife | Lock in. Play longer." />
    <meta property="og:description" content="Gaming headset guides, setup help, and gear for the long session." />
    <meta property="og:image" content="${SEO_IMAGE_URL}" />
    <meta property="og:image:alt" content="HCG1 Pro Gaming Headset" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="HC GamerLife | Lock in. Play longer." />
    <meta name="twitter:description" content="Gaming headset guides, setup help, and gear for the long session." />
    <meta name="twitter:image" content="${SEO_IMAGE_URL}" />
    <link rel="manifest" href="/site.webmanifest" />
    <script type="application/ld+json">${HOME_JSON_LD}</script>
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
      .purchase-panel { align-items: center; background: linear-gradient(135deg, rgba(255,79,94,.11), rgba(117,229,219,.08)); border: 1px solid var(--line); border-radius: 18px; display: flex; gap: 24px; justify-content: space-between; margin-top: 24px; padding: 24px; }
      .purchase-panel h3 { font-size: 1.25rem; margin: 8px 0 5px; }
      .purchase-panel p { color: var(--muted); font-size: .88rem; margin: 0; max-width: 510px; }
      .purchase-panel form { align-items: end; display: flex; flex: 0 0 auto; gap: 10px; }
      .quantity-label { color: var(--muted); display: grid; font-size: .72rem; gap: 5px; letter-spacing: .08em; text-transform: uppercase; }
      .quantity-label select { background: var(--panel-2); border: 1px solid var(--line); border-radius: 9px; color: var(--ink); font: inherit; padding: 12px 13px; }
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
      .journal-grid { display: grid; gap: 14px; grid-template-columns: repeat(3, 1fr); }
      .journal-card { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; display: flex; flex-direction: column; overflow: hidden; transition: border-color .2s, transform .2s; }
      .journal-card:hover, .journal-card:focus-visible { border-color: rgba(117,229,219,.65); transform: translateY(-3px); }
      .journal-card-image { aspect-ratio: 1.45 / 1; background: #182334; overflow: hidden; }
      .journal-card-image img { height: 100%; object-fit: cover; transition: transform .35s ease; width: 100%; }
      .journal-card:hover .journal-card-image img { transform: scale(1.045); }
      .journal-card-copy { display: flex; flex: 1; flex-direction: column; padding: 21px 21px 23px; }
      .journal-card h3 { font-size: 1.18rem; line-height: 1.08; margin: 7px 0 10px; }
      .journal-card p { color: var(--muted); font-size: .88rem; margin-bottom: 18px; }
      .journal-kicker { color: var(--cyan); font-size: .66rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
      .journal-link { color: var(--ink); font-size: .78rem; font-weight: 800; margin-top: auto; }
      .editorial-grid { display: grid; gap: 14px; grid-template-columns: repeat(4, 1fr); }
      .editorial-card { background: linear-gradient(145deg, rgba(117,229,219,.08), var(--panel) 58%); border: 1px solid var(--line); border-radius: 18px; padding: 24px; }
      .editorial-card:nth-child(2) { background: linear-gradient(145deg, rgba(255,79,94,.11), var(--panel) 58%); }
      .editorial-card:nth-child(3) { background: linear-gradient(145deg, rgba(143,117,255,.1), var(--panel) 58%); }
      .editorial-card:nth-child(4) { background: linear-gradient(145deg, rgba(255,190,92,.1), var(--panel) 58%); }
      .editorial-card .eyebrow { margin-bottom: 26px; }
      .editorial-card h3 { font-size: 1.28rem; line-height: 1.08; }
      .editorial-card p { color: var(--muted); font-size: .9rem; margin: 0 0 18px; }
      .editorial-card a { color: var(--cyan); font-size: .78rem; font-weight: 800; }
      .featured-guide { align-items: stretch; background: var(--panel); border: 1px solid var(--line); border-radius: 22px; display: grid; gap: 0; grid-template-columns: 1.02fr .98fr; overflow: hidden; }
      .featured-guide-media { min-height: 410px; position: relative; }
      .featured-guide-media::after { background: linear-gradient(90deg, transparent 40%, rgba(16,23,34,.35)); content: ""; inset: 0; pointer-events: none; position: absolute; }
      .featured-guide-media img { display: block; height: 100%; object-fit: cover; width: 100%; }
      .featured-guide-copy { display: flex; flex-direction: column; justify-content: center; padding: 42px; }
      .featured-guide-copy h2 { font-size: clamp(2.1rem, 4vw, 3.7rem); margin: 10px 0 18px; }
      .featured-guide-copy p { color: var(--muted); font-size: .98rem; max-width: 470px; }
      .featured-guide-copy p + p { margin-top: 0; }
      .featured-guide-copy .text-link { color: var(--cyan); font-size: .84rem; font-weight: 800; margin-top: 10px; }
      .method-grid { display: grid; gap: 14px; grid-template-columns: repeat(4, 1fr); }
      .method-card { border-top: 2px solid var(--cyan); padding: 19px 4px 0; }
      .method-card:nth-child(2) { border-color: var(--red); }
      .method-card:nth-child(3) { border-color: #a78bfa; }
      .method-card:nth-child(4) { border-color: #ffbe5c; }
      .method-card h3 { font-size: 1.05rem; }
      .method-card p { color: var(--muted); font-size: .88rem; margin: 0; }
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
        .journal-grid { grid-template-columns: repeat(2, 1fr); }
        .editorial-grid, .method-grid { grid-template-columns: repeat(2, 1fr); }
        .featured-guide { grid-template-columns: 1fr; }
        .featured-guide-media { min-height: 330px; }
        .purchase-panel { align-items: start; flex-direction: column; }
        .purchase-panel form { width: 100%; }
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
        .journal-grid { grid-template-columns: 1fr; }
        .editorial-grid, .method-grid { grid-template-columns: 1fr; }
        .featured-guide-copy { padding: 30px 24px 34px; }
        .featured-guide-media { min-height: 250px; }
        .purchase-panel form { align-items: stretch; flex-direction: column; }
        .quantity-label select { width: 100%; }
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
          <a href="#journal">Journal</a>
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
              <img class="product-photo" src="/media/image?key=product-hero&amp;variant=product&amp;v=2" alt="Black and red HCG1 Pro Gaming Headset with detachable microphone" decoding="async" fetchpriority="high" />
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
            <article class="visual-main"><img src="/media/image?key=product-angle&amp;variant=hero&amp;v=2" alt="HCG1 headset shown at an angle with its detachable microphone" loading="lazy" decoding="async" /><div class="visual-caption"><h3>Focus on the play.</h3><p>The closed-back over-ear fit keeps the room out while the 53mm drivers keep the action clear.</p></div></article>
            <div class="visual-stack">
              <article class="visual-card"><img src="/media/image?key=product-comfort&amp;variant=card&amp;v=2" alt="HCG1 earcup and padded headband detail" loading="lazy" decoding="async" /><span>All-weekend comfort</span></article>
              <article class="visual-card"><img src="/media/image?key=product-controls&amp;variant=card&amp;v=2" alt="HCG1 detachable boom microphone and inline controls" loading="lazy" decoding="async" /><span>Clear comms, simple controls</span></article>
            </div>
          </div>
          <div class="spec-callout"><span class="spec-pip">53</span><div><strong>53mm stereo drivers</strong><span>20Hz–20kHz response, 32 ohms impedance, and an inline volume controller.</span></div></div>
        </section>

        <section id="scenes">
          <div class="section-head"><div><div class="eyebrow">HCG1 in the wild</div><h2>One headset. Every kind of session.</h2></div><p>From ranked matches to late-night playlists, the HCG1 is made to move with the people who use it.</p></div>
          <div class="campaign-grid">
            <figure class="campaign-card"><img src="/media/image?key=campaign-gaming&amp;variant=card&amp;v=2" alt="Gamer wearing the HCG1 headset during a focused PC session" decoding="async" /><figcaption><span>Ranked mode</span>Lock in and read the room.</figcaption></figure>
            <figure class="campaign-card"><img src="/media/image?key=campaign-studio&amp;variant=card&amp;v=2" alt="Music producer wearing the HCG1 headset in a home studio" decoding="async" /><figcaption><span>Studio time</span>Make every layer count.</figcaption></figure>
            <figure class="campaign-card"><img src="/media/image?key=campaign-party&amp;variant=card&amp;v=2" alt="Friend wearing the HCG1 headset at a rooftop game night" decoding="async" /><figcaption><span>Squad night</span>Pass the controller, keep the energy.</figcaption></figure>
            <figure class="campaign-card"><img src="/media/image?key=campaign-beach&amp;variant=card&amp;v=2" alt="Skater wearing the HCG1 headset on a sunny beach boardwalk" decoding="async" /><figcaption><span>Out of office</span>Your soundtrack travels.</figcaption></figure>
            <figure class="campaign-card"><img src="/media/image?key=campaign-streamer&amp;variant=card&amp;v=2" alt="Streamer wearing the HCG1 headset in a cozy creator setup" decoding="async" /><figcaption><span>Creator mode</span>Clear comms, camera ready.</figcaption></figure>
            <figure class="campaign-card"><img src="/media/image?key=campaign-esports&amp;variant=card&amp;v=2" alt="Esports teammate wearing the HCG1 headset in a tournament arena" decoding="async" /><figcaption><span>Match point</span>Call the play when it matters.</figcaption></figure>
          </div>
        </section>

        <section id="journal">
          <div class="section-head"><div><div class="eyebrow">The HC GamerLife journal</div><h2>Play smarter. Set up better. Stay for the next round.</h2></div><p>Practical guides, honest game-night advice, and buyer’s notes for people who want their gear to disappear into the moment.</p></div>
          <div class="journal-grid">${JOURNAL_CARDS}</div>
        </section>

        <section id="field-notes">
          <div class="section-head"><div><div class="eyebrow">Start where you are</div><h2>A better session has more than one setting.</h2></div><p>Use the journal like a toolkit. Pick the problem in front of you, make one useful change, and come back when the next part of the setup needs attention.</p></div>
          <div class="editorial-grid">
            <article class="editorial-card"><div class="eyebrow">01 · Choose</div><h3>Find the right fit for your play style.</h3><p>Compare wired and wireless habits, comfort details, microphone choices, and the compatibility questions that matter before you buy.</p><a href="/journal/wired-vs-wireless-gaming-headsets">Open the buyer’s guide ↗</a></article>
            <article class="editorial-card"><div class="eyebrow">02 · Tune</div><h3>Make the room work harder for you.</h3><p>Fix echo, balance game and chat audio, clean up the cable path, and protect the directional cues that help you react sooner.</p><a href="/journal/fix-party-chat-echo">Start with the setup fixes ↗</a></article>
            <article class="editorial-card"><div class="eyebrow">03 · Play</div><h3>Give game night a little shape.</h3><p>Plan a low-pressure squad night, keep late arrivals included, and build a flexible rhythm that works for competitive and casual players.</p><a href="/journal/plan-a-low-pressure-squad-night">Plan the next session ↗</a></article>
            <article class="editorial-card"><div class="eyebrow">04 · Keep</div><h3>Stay comfortable for the long haul.</h3><p>Small fit checks, short resets, and simple care habits help your headset and your ears feel ready for the next round.</p><a href="/journal/long-session-headset-comfort">Read the comfort notes ↗</a></article>
          </div>
        </section>

        <section id="featured-guide">
          <div class="featured-guide">
            <div class="featured-guide-media"><img src="/media/image?key=campaign-gaming&amp;variant=hero&amp;v=3" alt="Player wearing the HCG1 headset during a focused gaming session" loading="lazy" decoding="async" /></div>
            <div class="featured-guide-copy"><div class="eyebrow">Featured guide · Make the setup disappear</div><h2>Start with the habit, then choose the hardware.</h2><p>The best headset decision is rarely about the longest feature list. It is about the little friction you want to remove from every session: pairing menus, a microphone that sits too far away, a cable that catches on the chair, or cushions that make you quit early.</p><p>Our wired-versus-wireless guide turns those tradeoffs into a simple checklist. Read it before you shop, share it with a friend who is upgrading, or use it to tune the gear you already own.</p><a class="text-link" href="/journal/wired-vs-wireless-gaming-headsets">Read the featured guide ↗</a></div>
          </div>
        </section>

        <section id="method">
          <div class="section-head"><div><div class="eyebrow">Our editorial lens</div><h2>What we look for when gear meets real life.</h2></div><p>Every recommendation starts with the same question: does this make an actual session clearer, easier, or more comfortable?</p></div>
          <div class="method-grid">
            <article class="method-card"><h3>Clarity</h3><p>Can you follow voices, footsteps, movement, and music without turning the volume into a guessing game?</p></article>
            <article class="method-card"><h3>Communication</h3><p>Does the microphone keep your callouts understandable when the room and the match both get loud?</p></article>
            <article class="method-card"><h3>Comfort</h3><p>Does the fit stay easy through a full session, including glasses, breaks, and the inevitable “one more”?</p></article>
            <article class="method-card"><h3>Friction</h3><p>Can you connect, adjust, clean, and move the setup without needing a manual open beside you?</p></article>
          </div>
        </section>

        <section id="product">
          <div class="section-head"><div><div class="eyebrow">Why HCG1</div><h2>Every detail earns its spot.</h2></div><p>Good gear disappears into the moment. You hear more, say more, and think less about what is on your head.</p></div>
          <div class="feature-grid">
            <article class="feature-card"><div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 15a8 8 0 0 1 16 0"/><path d="M4 15v3a2 2 0 0 0 2 2h1v-5H4Zm16 0v3a2 2 0 0 1-2 2h-1v-5h3Z"/><path d="M12 7v4m-2 0h4"/></svg></div><h3>Sound with a point of view</h3><p>Balanced stereo audio keeps footsteps, movement, and your favorite soundtrack distinct when the screen gets busy.</p></article>
            <article class="feature-card"><div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 5v7a5 5 0 0 0 10 0V5"/><path d="M4 10v2a8 8 0 0 0 16 0v-2M12 20v-3m-3 3h6"/></svg></div><h3>Comfort for the “last game”</h3><p>Soft over-ear cushions and a flexible fit stay easy through long queues, long flights, and long nights with friends.</p></article>
            <article class="feature-card"><div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3 5 6v5c0 4.5 2.9 8.2 7 10 4.1-1.8 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg></div><h3>Ready when you are</h3><p>A detachable boom mic, inline controls, and broad device compatibility keep the setup simple and the focus where it belongs.</p></article>
          </div>
          <div class="purchase-panel"><div><div class="eyebrow">Stripe test checkout</div><h3>Put the HCG1 in your cart.</h3><p>This checkout is wired for Stripe test mode. It stays inactive until the store’s test price and server-side secret are configured.</p></div><form action="/checkout" method="post"><input type="hidden" name="product" value="hcg1" /><label class="quantity-label" for="quantity">Quantity<select id="quantity" name="quantity"><option value="1">1 headset</option><option value="2">2 headsets</option><option value="3">3 headsets</option><option value="4">4 headsets</option></select></label><button class="button button-primary" type="submit">Open test checkout <span aria-hidden="true">↗</span></button></form></div>
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

function renderArticle(article: Article): Response {
  const imageKey = articleMediaKey(article);
  const articleUrl = `${SITE_URL}/journal/${article.slug}`;
  const articleImageUrl = `${SITE_URL}/media/image?key=${imageKey}&variant=hero&v=4`;
  const articleJsonLd = safeJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    articleSection: article.section,
    mainEntityOfPage: articleUrl,
    image: [articleImageUrl],
    author: { "@type": "Organization", name: "HC GamerLife", url: SITE_URL },
    publisher: { "@type": "Organization", name: "HC GamerLife", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` } },
    isPartOf: { "@type": "WebSite", name: "HC GamerLife", url: SITE_URL }
  });
  const breadcrumbJsonLd = safeJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HC GamerLife", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/#journal` },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl }
    ]
  });
  const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0a0e16" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta name="description" content="${article.excerpt}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="HC GamerLife" />
    <link rel="canonical" href="${articleUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="HC GamerLife" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:title" content="${article.title} | HC GamerLife" />
    <meta property="og:description" content="${article.excerpt}" />
    <meta property="og:image" content="${articleImageUrl}" />
    <meta property="og:image:alt" content="${article.title}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${article.title} | HC GamerLife" />
    <meta name="twitter:description" content="${article.excerpt}" />
    <meta name="twitter:image" content="${articleImageUrl}" />
    <link rel="manifest" href="/site.webmanifest" />
    <script type="application/ld+json">${articleJsonLd}</script>
    <script type="application/ld+json">${breadcrumbJsonLd}</script>
    <title>${article.title} | HC GamerLife</title>
    <style>
      :root { color-scheme: dark; --ink:#f5f7fb; --muted:#a8b1c4; --line:rgba(181,196,224,.16); --bg:#0a0e16; --panel:#101722; --red:#ff4f5e; --cyan:#75e5db; }
      * { box-sizing: border-box; }
      body { margin:0; background:var(--bg); color:var(--ink); font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; line-height:1.6; }
      a { color:inherit; text-decoration:none; }
      .wrap { margin:0 auto; max-width:1040px; padding:0 24px; }
      header { align-items:center; display:flex; justify-content:space-between; padding:25px 0; }
      .brand { align-items:center; display:inline-flex; font-weight:850; gap:11px; letter-spacing:-.04em; }
      .brand-mark { align-items:center; background:var(--red); border-radius:10px; color:#19090e; display:inline-flex; font-size:.8rem; height:33px; justify-content:center; width:38px; }
      .back { color:var(--muted); font-size:.86rem; }
      .back:hover { color:var(--ink); }
      .hero { border-bottom:1px solid var(--line); padding:58px 0 54px; }
      .kicker { color:var(--cyan); font-size:.72rem; font-weight:800; letter-spacing:.18em; text-transform:uppercase; }
      h1 { font-size:clamp(2.75rem,7vw,5.8rem); letter-spacing:-.085em; line-height:.94; margin:13px 0 21px; max-width:850px; }
      .dek { color:var(--muted); font-size:1.15rem; max-width:650px; }
      .feature { border:1px solid var(--line); border-radius:22px; margin:42px 0; overflow:hidden; }
      .feature img { display:block; height:clamp(240px,38vw,430px); object-fit:cover; width:100%; }
      .prose { max-width:730px; padding-bottom:80px; }
      .prose h2 { font-size:1.75rem; letter-spacing:-.04em; line-height:1.1; margin:39px 0 12px; }
      .prose p { color:#d6dce7; font-size:1.04rem; margin:0 0 17px; }
      .callout { background:linear-gradient(135deg,rgba(117,229,219,.1),rgba(255,79,94,.08)); border:1px solid var(--line); border-radius:16px; color:#dfe6f1; margin:30px 0; padding:20px 22px; }
      .more { border-top:1px solid var(--line); padding:34px 0 70px; }
      .more h2 { font-size:1.5rem; letter-spacing:-.04em; }
      .more a { color:var(--cyan); }
      footer { border-top:1px solid var(--line); color:var(--muted); font-size:.8rem; padding:25px 0 40px; }
      @media (max-width:580px) { header { padding:18px 0; } .hero { padding-top:38px; } .wrap { padding:0 16px; } }
    </style>
  </head>
  <body>
    <div class="wrap"><header><a class="brand" href="/"><span class="brand-mark">HC</span> GAMERLIFE</a><a class="back" href="/#journal">Back to the journal ↗</a></header></div>
    <main><div class="wrap"><section class="hero"><div class="kicker">${article.section}</div><h1>${article.title}</h1><p class="dek">${article.excerpt}</p></section><figure class="feature"><img src="/media/image?key=${imageKey}&amp;variant=hero&amp;v=3" alt="${article.title}" decoding="async" fetchpriority="high" /></figure><article class="prose">${article.body}<div class="callout"><strong>Make the next session easier.</strong><br />Save this guide, share it with your squad, and explore the HCG1 setup when you are ready for a simple, wired connection.</div></article><section class="more"><h2>Keep exploring</h2><p><a href="/#product">Meet the HCG1 Pro Gaming Headset</a> · <a href="/#setup">See the setup guide</a> · <a href="/#journal">Browse every guide</a></p></section></div></main>
    <div class="wrap"><footer><a class="brand" href="/"><span class="brand-mark">HC</span> GAMERLIFE</a></footer></div>
  </body>
</html>`;
  return new Response(page, { headers: HEADERS });
}

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

function checkoutStatusPage(title: string, message: string, status: number): Response {
  const page = `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex, nofollow" /><link rel="icon" href="/favicon.svg" type="image/svg+xml" /><title>${title} | HC GamerLife</title><style>:root{color-scheme:dark;--ink:#f5f7fb;--muted:#a8b1c4;--line:rgba(181,196,224,.16);--bg:#0a0e16;--panel:#101722;--red:#ff4f5e;--cyan:#75e5db}*{box-sizing:border-box}body{align-items:center;background:var(--bg);color:var(--ink);display:flex;font-family:Inter,ui-sans-serif,system-ui,sans-serif;justify-content:center;line-height:1.6;margin:0;min-height:100vh;padding:24px}.card{background:var(--panel);border:1px solid var(--line);border-radius:22px;max-width:620px;padding:42px}.eyebrow{color:var(--cyan);font-size:.72rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase}h1{font-size:clamp(2.3rem,7vw,4.5rem);letter-spacing:-.08em;line-height:.95;margin:12px 0 18px}p{color:var(--muted);font-size:1.02rem}.button{background:var(--red);border-radius:999px;color:#210a10;display:inline-flex;font-weight:800;margin-top:12px;padding:13px 19px;text-decoration:none}</style></head><body><main class="card"><div class="eyebrow">HC GamerLife checkout</div><h1>${title}</h1><p>${message}</p><a class="button" href="/#product">Back to the HCG1</a></main></body></html>`;
  const headers = new Headers(HEADERS);
  headers.set("cache-control", "no-store");
  return new Response(page, { status, headers });
}

async function createStripeCheckout(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return checkoutStatusPage("Checkout is ready", "Use the checkout button on the product section to start a test order.", 405);
  const form = await request.formData();
  if (form.get("product") !== "hcg1") return checkoutStatusPage("Product not found", "That cart item is no longer available.", 400);
  const parsedQuantity = Number.parseInt(String(form.get("quantity") ?? "1"), 10);
  const quantity = Number.isFinite(parsedQuantity) ? Math.min(Math.max(parsedQuantity, 1), 4) : 1;
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
    return checkoutStatusPage("Test checkout is not configured yet", "The site is ready for Stripe test mode. Add the test price ID and server-side Stripe secret to the Worker, then this button will open a real test checkout.", 503);
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("line_items[0][price]", env.STRIPE_PRICE_ID);
  params.set("line_items[0][quantity]", String(quantity));
  params.set("success_url", `${SITE_URL}/?checkout=success#drop`);
  params.set("cancel_url", `${SITE_URL}/?checkout=cancel#product`);
  params.set("billing_address_collection", "auto");
  params.set("allow_promotion_codes", "true");

  let upstream: Response;
  try {
    upstream = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "content-type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });
  } catch {
    return checkoutStatusPage("Stripe could not be reached", "The test checkout service did not respond. Try again in a moment.", 502);
  }
  if (!upstream.ok) return checkoutStatusPage("Stripe test checkout needs attention", "Stripe rejected the test checkout request. Check the Worker’s test price ID and secret configuration.", 502);
  const payload = await upstream.json() as { url?: unknown };
  return typeof payload.url === "string" ? Response.redirect(payload.url, 303) : checkoutStatusPage("Stripe returned no checkout link", "The test session was created without a redirect link. Check the Stripe test-mode configuration.", 502);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/healthz") {
      return new Response(JSON.stringify({ ok: true, service: "hc-gamer-life" }), {
        headers: { "content-type": "application/json; charset=UTF-8", "cache-control": "no-store" }
      });
    }
    if (url.pathname === "/robots.txt") {
      return new Response(`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`, {
        headers: { "content-type": "text/plain; charset=UTF-8", "cache-control": "public, max-age=3600" }
      });
    }
    if (url.pathname === "/sitemap.xml") {
      return new Response(SITEMAP_XML, {
        headers: { "content-type": "application/xml; charset=UTF-8", "cache-control": "public, max-age=3600" }
      });
    }
    if (url.pathname === "/site.webmanifest") {
      return new Response(MANIFEST_JSON, {
        headers: { "content-type": "application/manifest+json; charset=UTF-8", "cache-control": "public, max-age=3600" }
      });
    }
    if (url.pathname === "/favicon.svg") {
      return new Response(FAVICON, { headers: { "content-type": "image/svg+xml; charset=UTF-8", "cache-control": "public, max-age=31536000, immutable" } });
    }
    if (url.pathname === "/checkout/config" && request.method === "GET") {
      return new Response(JSON.stringify({ publishableKey: env.STRIPE_PUBLISHABLE_KEY ?? null, ready: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID) }), {
        headers: { "content-type": "application/json; charset=UTF-8", "cache-control": "no-store" }
      });
    }
    if (url.pathname === "/checkout") return createStripeCheckout(request, env);
    if (url.pathname.startsWith("/journal/")) {
      const slug = decodeURIComponent(url.pathname.slice("/journal/".length)).replace(/\/+$/, "");
      const article = ARTICLES.find((candidate) => candidate.slug === slug);
      return article ? renderArticle(article) : new Response("Guide not found", { status: 404, headers: { "content-type": "text/plain; charset=UTF-8" } });
    }
    if (url.pathname === "/media/image") return serveOptimizedImage(request, url);
    return new Response(PAGE, { headers: HEADERS });
  }
};

