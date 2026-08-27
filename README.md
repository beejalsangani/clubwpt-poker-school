# ClubWPT Poker School

A static site teaching Free Social Poker: nine lessons, each with a quiz that
unlocks a code worth 10,000 play chips.

**Status: preview build for internal review. Not cleared for public launch.**
Legal review is required on the chip reward mechanic and the social-casino
disclosures before this is pointed at a public domain.

## Files

All files sit in one flat folder — no subfolders, so uploading via the GitHub
web interface works reliably.

```
index.html                          Course home
basics-how-a-hand-works.html        Beginner lesson 1
basics-hand-rankings.html           Beginner lesson 2
basics-glossary.html                Beginner lesson 3
ring-games-vs-tournaments.html      Ring game lesson 1
ring-games-buy-in-and-stack-size.html
ring-games-position.html
ring-games-table-selection.html
ring-games-when-to-leave.html
ring-games-moving-up-in-stakes.html
style.css                           All styling
app.js                              Quiz engine + progress tracking
```

No build step, no dependencies, no framework.

## Before launch — things to change

1. **Redemption email.** Open `app.js` and replace `[REDEMPTION EMAIL]` near
   the top with the real address.
2. **Play links.** Every "Find a table" button points to
   `https://www.clubwpt.com/`. Point these at the ring game lobby.
3. **Code words.** Codes are static, one per lesson, in each page's inline
   `window.QUIZ` object. They can be shared publicly — cap redemption at one per
   lesson per account and require the ClubWPT username with every claim.
4. **Legal.** Confirm the footer disclosure is sufficient and that reward terms
   are published somewhere linkable.

## Editing content

To change a lesson, edit its `.html` file — the prose sits inside
`<article class="prose">`.

To change a quiz, edit the `window.QUIZ` script block at the bottom of that
page. Format: `[question, [options], correctIndex, explanation]` with
`correctIndex` 0-based.

## Progress tracking

Stored in the browser via `localStorage`, key `cwpt_poker_school_v1`.
Per-device, per-browser. No server, no account linking. Passing a quiz does not
credit chips — the code word plus a manual claim does that.

## Deploying

GitHub Pages. Settings > Pages > Source "Deploy from a branch" > Branch `main`,
folder `/ (root)` > Save.

Upload all files to the repository root. All links are same-folder relative, so
the site works from a domain root or a subfolder.

## Running it locally

```
python3 -m http.server 8000
```
Then open http://localhost:8000

## Ownership

This is ClubWPT property. Keep the repo under a ClubWPT GitHub organization, or
transfer it to one before launch, so access does not depend on any one person's
account. Keep it entirely separate from personal projects.

## Accessibility

Keyboard navigable with visible focus rings, skip link, live region on the chip
counter, and `prefers-reduced-motion` respected.
