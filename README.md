# ClubWPT Poker School

A static site teaching Free Social Poker: nine lessons, each with a quiz that
unlocks a code worth 10,000 play chips.

**Status: preview build for internal review. Not cleared for public launch.**
Legal review is required on the chip reward mechanic and the social-casino
disclosures before this is pointed at a public domain.

## What's here

```
index.html                    Course home
basics/                       Stage 0 — 3 beginner lessons
ring-games/                   Stage 1 — 6 ring game lessons
assets/style.css              All styling
assets/app.js                 Quiz engine + progress tracking
```

No build step, no dependencies, no framework. Every page is plain HTML.

## Before launch — things to change

1. **Redemption email.** Open `assets/app.js` and replace `[REDEMPTION EMAIL]`
   near the top with the real address.
2. **Play links.** Every "Find a table" button points to
   `https://www.clubwpt.com/`. Point these at the ring game lobby.
3. **Code words.** Codes are static, one per lesson, and live in each page's
   inline `window.QUIZ` object. They can be shared publicly — cap redemption at
   one per lesson per account and require the ClubWPT username with every claim.
   A unique code per completion would need a backend.
4. **Legal.** Confirm the footer disclosure is sufficient and that reward terms
   are published somewhere linkable.

## Editing content

Content is baked into the HTML. To change a lesson, edit its `index.html` —
the prose sits inside `<article class="prose">`.

To change a quiz, edit the `window.QUIZ` script block at the bottom of that
lesson's page. Format: `[question, [options], correctIndex, explanation]`
where `correctIndex` is 0-based.

## Progress tracking

Progress is stored in the browser via `localStorage` under the key
`cwpt_poker_school_v1`. Per-device, per-browser; clearing site data resets it.
There is no server and no account linking. Passing a quiz does not credit chips
automatically — the code word plus a manual claim does that.

## Running it locally

```
python3 -m http.server 8000
```
Then open http://localhost:8000

## Deploying

Recommended: GitHub Pages. Free, permitted for commercial and organization use,
and hosting lives with the code.

Settings > Pages > Source: "Deploy from a branch" > Branch `main`,
folder `/ (root)` > Save. Live in about a minute.

All internal links are relative, so the site works served from a domain root
or from a subfolder like `org.github.io/repo/`.

## Ownership

This is ClubWPT property. Keep the repo under a ClubWPT GitHub organization,
or transfer it to one before launch, so access does not depend on any one
person's account. Keep it entirely separate from personal projects.

## Accessibility

Keyboard navigable with visible focus rings, skip link, live region on the chip
counter, and `prefers-reduced-motion` respected.
