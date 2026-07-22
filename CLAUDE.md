# Wichita pickup soccer/futsal app — build plan

**Working name:** 316ball

This is your roadmap. You don't need to understand every technical term below right now — each phase gets built one step at a time, with me walking through the actual code and setup when we get there. This document exists so you always know *where we are* and *what's next*, even between sessions.

---

## The first big decision: website (PWA), not a native app

Build this as a **mobile-first responsive website** that can be "installed" to a phone's home screen (this is called a PWA — Progressive Web App), rather than a native iOS/Android app. Reasoning:

- **Zero barrier to entry.** Someone taps a link and they're in. No App Store, no install, no "is this worth 40MB of storage" hesitation — which directly serves your "as little friction as possible" requirement.
- **One codebase, works everywhere.** Same app on phone browser and desktop browser. No separate iOS/Android builds.
- **No app store review process.** As a first-time builder, you do not want Apple's review process standing between you and shipping an update.
- **Upgrade path stays open.** If this takes off and you eventually want a "real" app in the App Store, tools exist (Capacitor) to wrap the same website into one later. Nothing here is wasted work.

---

## Recommended tech stack

Picked specifically to minimize how much infrastructure *you* have to build and maintain, since this is your first solo ship.

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | **Next.js** (React) | Handles routing, pages, and backend logic in one project. Huge community/docs, so when you get stuck, answers exist. |
| Styling | **Tailwind CSS** | Fast to style, pairs well with the modern/clean look you want. |
| Database + backend | **Supabase** | A managed Postgres database that *also* gives you phone-number OTP auth and live realtime updates out of the box. This one choice removes three separate hard problems (database hosting, login system, live updates) from your plate. |
| Maps | **Mapbox GL JS** | Generous free tier, and gives you the styling control to pull off the aviation/radar look later. (Leaflet + OpenStreetMap is a fully free fallback if Mapbox pricing ever becomes a concern.) |
| Hosting | **Vercel** | Built by the Next.js team. Deploying is: push to GitHub, it's live. No server management. |
| Code home | **GitHub** | Free, standard, and where Claude Code/Fable will work from directly when we start building. |

You will not need to touch a server, write SQL migrations by hand, or manage authentication infrastructure yourself. That's the point.

---

## Phased roadmap

Each phase ends with something real — either visibly working or deployed. We don't move to polish until the mechanics work.

### Phase 0 — Foundations (setup, no code yet)
- Create accounts: GitHub, Supabase, Vercel, Mapbox
- Local dev environment set up (Node.js installed, project scaffolded)
- Empty Next.js project pushed to GitHub and successfully deployed to Vercel (even showing just "hello world")
- **Done when:** you can visit a live `.vercel.app` URL and see a page you made.

### Phase 1 — Static venue directory
- Build the `venues` table (name, coordinates, surface type, indoor/outdoor, amenities)
- Manually seed it with the ~10–15 courts you already know, directly in Supabase's table editor — no admin UI needed yet
- Build the map page: pins rendered from that table, tap a pin to see venue details
- **No accounts, no check-ins yet** — just a browsable map
- **Done when:** anyone can open the link and find real Wichita courts with accurate info. This alone is useful and shippable.

### Phase 2 — Phone auth + light profiles
- Wire up Supabase's phone/OTP login (text a code, type it in, you're in)
- First-login flow: optional nickname + pick an avatar from a preset set
- **Done when:** a new user can go from "never used this" to "logged in" in under 15 seconds.

### Phase 3 — "I'm here now" check-ins
- `checkins` table; tapping the button inserts a row tied to user + venue + timestamp
- Venue card shows a **recency-based status** ("Busy · updated 12m ago") instead of a hard busy/empty flag
- **Done when:** you can check in from your phone and watch the status update on the venue card.

### Phase 4 — Planned visits (time-bucketed RSVPs)
- `planned_visits` table storing user + venue + target time
- Aggregation logic: group RSVPs into ~30-minute buckets, headline = biggest bucket
- UI: primary "I'm going at 6:00pm" button (dynamic) + smaller chips for other times
- **Done when:** picking a different time updates the counts, and the headline shifts if a different time overtakes the leader.

### Phase 5 — Live updates
- Supabase Realtime subscriptions so counts/status refresh without reloading the page
- Passive "still here?" nudge around the 60–90 min mark to keep check-ins fresh without full re-entry
- **Done when:** two phones open at once see each other's check-ins appear live.

### Phase 6 — Court suggestions
- Simple in-app form: "suggest a court" (name, rough location, optional photo)
- Submissions land in a queue **only you see** — start this as a plain Google Form or Airtable to avoid building an admin panel before it's needed; upgrade to a real in-app queue later if volume justifies it
- **Done when:** a friend can submit a court and you can see it land somewhere you check.

### Phase 7 — Visual polish (aviation theme)
- This comes *after* the mechanics work, on purpose — form follows function, and it's a common first-project trap to polish before the core loop is proven
- Apply the radar/flight-tracker visual language, animations, final color system, app name/logo

### Phase 8 — PWA packaging
- Add a manifest + service worker (Next.js has plugins that mostly automate this) so the site can be "added to home screen" and feels like an installed app
- **Done when:** it's on your home screen and opens without a browser address bar.

### Phase 9 — Soft launch
- Ship to the group of players you already know
- Watch real usage, fix what breaks, adjust based on what people actually do vs. what we guessed they'd do

### Phase 10 — Future / optional
- Native app wrapper (Capacitor) if there's real demand for App Store presence
- Push notifications
- Expansion beyond Wichita, if it ever comes to that

---

## What to do before we start building

- [ ] Create free accounts: GitHub, Supabase, Vercel, Mapbox
- [ ] Have Node.js installed on your machine (I'll walk you through checking/installing this)
- [ ] Start a running list of the courts you already know (name + rough location is enough to start — surface type etc. can be filled in later)
- [ ] Think of a placeholder app name (doesn't need to be final — we need *something* to put in the project)

---

## How we'll work together

- We're on Sonnet for planning/design conversations like this one.
- When it's time to actually write and ship code (starting around Phase 0), switch to **Claude Code** (via Fable/Opus as you mentioned) — that's built for hands-on, step-by-step building with you, including running commands and pushing to GitHub.
- Expect each phase to be its own focused session — get one working end-to-end before starting the next. Since this is your first solo build, we'll go slower than the "phase" framing might suggest, and that's expected.
