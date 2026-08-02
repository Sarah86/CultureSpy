<p align="center">
  <img src="https://github.com/user-attachments/assets/db93a83a-2fd8-49e0-8db6-1c386ccb39b6" width="100%" alt="CultureSpy Cover">
</p>

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

- **Location-aware missions** — scan surroundings via GPS or search manually for any museum, gallery, or landmark, sorted nearest-to-farthest
- **AI-generated tasks** — each location gets a unique set of sensory micro-tasks with a hidden curiosity fact per task
- **One-task focus mode** — mission screens show a single task at a time, with a step indicator and prev/next navigation to revisit or undo a step, so kids stay on task instead of facing a full checklist at once
- **Mission regeneration** — generate a new mission variant for the same location on demand
- **Delete missions** — remove a mission (with confirmation) from the home list or from within it
- **Mission completion celebration** — a trophy/confetti screen on finishing the last task, with a shortcut to scan for a new target
- **Place details on demand** — distance, category, address, and a "View on Maps" link for both the target-selection list and the generated mission
- **Persistent state, minimal API usage** — agent profile, missions, and the last scan/search result list are all saved locally; reloading the app, revisiting a mission, or reopening the last search list costs zero extra API calls. Generated missions are cached per place + language, so picking the same target again never re-triggers the AI
- **Age-based ranks** — Recruit (6–8), Agent (9–10), Commander (11–12)
- **Multilingual** — English, Italian, French, Portuguese
- **Fully offline-capable after first load**

---

## Tech Stack

| Area | Tech |
|---|---|
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Vercel Serverless Functions |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Tooling | Google Maps Tool (Grounding) via Gemini |
| Build | Vite |
| Deploy | Vercel |

---

## Is this "AI Agentic"? 🤖

Yes. While many apps simply "chat" with AI, CultureSpy is **agentic** because it uses **Tool-Augmented Generation**:

1.  **Tool Use**: The AI isn't just predicting text; it is actively **using the Google Maps tool** (grounding) to "see" the real world, verify locations, and retrieve live data about museums and landmarks.
2.  **Structured Reasoning**: It takes raw geospatial data and "reasons" through it to generate a structured 10-part sensory mission based on the specific context of that location.
3.  **Contextual Agency**: It acts as a bridge between the digital world and the physical world, making decisions on what tasks are appropriate for a specific "Agent" (the child) based on their rank and surroundings.

---

## Project Structure

```
CultureSpy/
├── api/                  # Vercel Serverless Functions (AI Logic)
│   ├── mission.ts        # AI mission generation
│   ├── scan.ts           # Location scanning with Google Maps tool
│   └── search.ts         # Manual search with Google Maps tool
├── App.tsx               # Main app UI and state management
├── components/           # UI Components
│   ├── MissionCard.tsx   # Mission list card
│   ├── MissionComplete.tsx # Mission-finished celebration screen
│   ├── TaskItem.tsx      # Individual sensory task (focus-mode card)
│   ├── TerminalText.tsx  # Typewriter text effect
│   └── LocationScanner.tsx # Scanning overlay UI
├── data.ts               # Local cache / fallback data
├── storage.ts            # Typed localStorage layer (profile, missions, search results, mission cache)
├── types.ts              # TypeScript types
└── index.tsx             # Entry point
```

---

## How It Works

1. **Onboarding** — child picks language, creates a codename, and selects their age/rank (skipped on return visits — the profile is remembered)
2. **Radar** — app scans nearby cultural locations via GPS (or manual search); results are sorted nearest-to-farthest and persisted, so reopening the same list later is instant and free
3. **Target selection** — nearby locations are presented as "targets" with distance, category, address, and a maps link
4. **Mission generation** — Gemini generates a structured mission with sensory tasks specific to that location; the same place + language never re-triggers the AI
5. **Mission execution** — child completes one task at a time in focus mode (with the option to step back and revisit a task), earns XP, unlocks curiosity facts
6. **Persistence** — agent profile, mission progress, generated mission content, and the last search results are all stored locally; reloading the app never starts from scratch

---

## Running Locally

**Prerequisites:** Node.js 18+, Vercel CLI (`npm i -g vercel`)

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Set up Environment**:
    Create a `.env` file in the root and add your `GEMINI_API_KEY`. The prompt templates are pre-configured in the repository's logic but can also be overridden via `.env`.
3.  **Start Development Server**:
    ```bash
    vercel dev
    ```
    This runs both the Vite frontend and the Vercel serverless functions locally.

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com).

---

## Design Decisions

**Why structured mindmap-style tasks instead of open-ended AI prompts?**
Tasks are designed by child development and sensory engagement specialists, not generated freely by the LLM. The AI fills the content (what to look for, curiosity facts) within a fixed structure. This gives clinical safety and predictability — important when the target audience has ADHD.

**Why cache missions and search results locally?**
The same museum visit — or reopening the same list of nearby spots — shouldn't trigger a new API call every time. Persisting profile, missions, mission content, and search results locally keeps costs near zero and makes the app feel instant on repeat visits and after a reload. Users can always regenerate a fresh mission variant, or start a new search, if they want something new.

**Why one task at a time instead of a full checklist?**
The target audience (including kids with ADHD) tends to lose focus faced with a long list. Showing a single task with a step indicator keeps attention on the current action, while prev/next navigation still allows revisiting and undoing a step.

**Why Gemini Flash over larger models?**
Speed matters for kids. Flash responds in under 2 seconds, keeps costs minimal, and the structured JSON output schema ensures reliable parsing without post-processing.

**On the prototype origin:**
The initial prototype was built in Google AI Studio for rapid iteration. The app was then extended with custom caching, mission regeneration, multilingual support, and a full UX overhaul — using AI Studio as a scaffold, not the final product.

---

## Status

Live at [culture-spy.vercel.app](https://culture-spy.vercel.app).

See [CHANGELOG.md](./CHANGELOG.md) for a dated history of what's changed.