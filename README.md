# CultureSpy 🕵️

**Live:** [culture-spy.vercel.app](https://culture-spy.vercel.app)

A gamified cultural exploration app designed for children with ADHD. CultureSpy turns museum and city visits into spy missions — using the 5 senses as tools for discovery, keeping kids engaged through short, sensory-focused micro-tasks instead of passive observation.

---

## The Problem

Children with ADHD often struggle in cultural spaces like museums and galleries. Traditional formats (read the label, look at the exhibit) are passive, text-heavy, and offer no agency. The result: disengagement, frustration, and missed experiences.

## The Solution

CultureSpy reframes the visit as a covert operation. Each child becomes a spy agent with a codename and rank. The app generates location-specific missions with 10 sensory micro-tasks (sight, sound, touch, smell, vibe) tailored to the place they're visiting — keeping attention active and curiosity rewarded.

---

## Features

- **Location-aware missions** — scan surroundings via GPS or search manually for any museum, gallery, or landmark
- **AI-generated tasks** — each location gets a unique set of 10 sensory micro-tasks with a hidden curiosity fact per task
- **Mission regeneration** — generate a new mission variant for the same location on demand
- **Response caching** — generated missions are cached locally, so revisiting the same location costs zero API calls
- **Age-based ranks** — Recruit (6–8), Agent (9–10), Commander (11–12)
- **Multilingual** — English, Italian, French, Portuguese
- **Fully offline-capable after first load**

---

## Tech Stack

| Area | Tech |
|---|---|
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS |
| AI | Google Gemini API (`gemini-3-flash-preview`) |
| Location | Google Maps grounding via Gemini |
| Build | Vite |
| Deploy | Vercel |

---

## Project Structure

```
CultureSpy/
├── App.tsx               # Main app — state, views, API calls
├── components/
│   ├── MissionCard.tsx   # Mission list card
│   ├── TaskItem.tsx      # Individual sensory task
│   ├── TerminalText.tsx  # Typewriter text effect
│   └── LocationScanner.tsx # Scanning overlay UI
├── data.ts               # Mock missions (fallback / demo)
├── types.ts              # TypeScript types
└── index.tsx             # Entry point
```

---

## How It Works

1. **Onboarding** — child picks language, creates a codename, and selects their age/rank
2. **Radar** — app scans nearby cultural locations via GPS (or manual search)
3. **Target selection** — 4 nearby locations are presented as "targets"
4. **Mission generation** — Gemini generates a structured mission with 10 sensory tasks specific to that location
5. **Mission execution** — child completes tasks, earns XP, unlocks curiosity facts
6. **Caching** — completed mission data is stored in localStorage; same location = instant load next time

---

## Running Locally

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Add your Gemini API key to .env.local
echo "API_KEY=your_gemini_api_key" > .env.local

# Start dev server
npm run dev
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com).

---

## Design Decisions

**Why structured mindmap-style tasks instead of open-ended AI prompts?**
Tasks are designed by child development and sensory engagement specialists, not generated freely by the LLM. The AI fills the content (what to look for, curiosity facts) within a fixed structure. This gives clinical safety and predictability — important when the target audience has ADHD.

**Why cache missions locally?**
The same museum visit shouldn't trigger a new API call every time. Caching keeps costs near zero and makes the app feel instant on repeat visits. Users can always regenerate a fresh variant if they want something new.

**Why Gemini Flash over larger models?**
Speed matters for kids. Flash responds in under 2 seconds, keeps costs minimal, and the structured JSON output schema ensures reliable parsing without post-processing.

**On the prototype origin:**
The initial prototype was built in Google AI Studio for rapid iteration. The app was then extended with custom caching, mission regeneration, multilingual support, and a full UX overhaul — using AI Studio as a scaffold, not the final product.

---

## Status

Live at [culture-spy.vercel.app](https://culture-spy.vercel.app). Planned next:
- [ ] Rate limiting per session
- [ ] Sketch task support (canvas drawing)
- [ ] PWA support for offline use
