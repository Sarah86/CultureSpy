# Vision

> Human-owned durable intent for every role. Keep this file at or below 1000 lines. The injected copy is capped at 1000 lines; keep each item high-signal and move supporting history to feature notes. The coordinator may propose changes but does not invent or rewrite this intent unprompted.

## Product principles

- CultureSpy is for children, including children with ADHD, who find museums and city visits passive and text-heavy. Every feature must keep a child's attention active, not add to what they read.
- A visit is a spy mission. The child is an agent with a codename. The five senses (sight, sound, touch, smell, vibe) are the tools.
- One task at a time. Never show a full checklist. The child can step back and revisit a task.
- Task structure is fixed and designed for sensory engagement. The AI fills in content (what to look for, curiosity facts). It does not invent the structure.
- Missions are tied to a real place. Location data comes from Google Maps grounding, not from model memory.
- Cost stays near zero on repeat use. Profile, missions, mission content, and the last search results are saved on the device. The same place and language never calls the AI twice. A new variant or a new search is always the user's choice.
- The app works in English, Italian, French, and Portuguese. A new feature ships in all four.
- Speed matters for a child. Prefer the fast model and structured JSON output over larger models and post-processing.
- The child's data stays on the device. No accounts, no server-side profile.

## Current direction

- The app is live at culture-spy.vercel.app and was extended from a Google AI Studio prototype. Current work hardens and polishes it: reliable missions, clear screens, and no lost state on reload.
- Keep the stack small: React, Vite, Vercel serverless functions, Gemini. Add a dependency only when it removes real work.
- The project has no automated tests yet. Prove a change by running the app. Add tests only where a failure would be costly or hard to see.
