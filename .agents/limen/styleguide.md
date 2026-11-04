# Styleguide

> Project-owned coding practice for every coordinator, worker, and reviewer turn. Keep this file at or below 1000 lines. The injected copy is capped at 1000 lines. Edit this file to change how agents write and organize code here. It is not product scope and not speech.

## Shape

- Frontend is React 19 with TypeScript and Tailwind CSS v4. Serverless functions in `api/` run on Vercel. Build with Vite.
- Shared types live in `types.ts`. All browser storage goes through `storage.ts`. Do not call `localStorage` anywhere else.
- One component per file in `components/`. Small, presentational components take props. State and flow stay in `App.tsx` until a piece has a clear reason to move out.
- One handler per file in `api/`. Each handler checks the HTTP method, checks required input, calls Gemini, and returns JSON.
- Prompt text lives in environment variables (`AI_PROMPT_*`), not in source. Handlers fill in placeholders.
- Keep files and functions short enough to read in one pass. Split `App.tsx` by screen when a change touches it heavily.

## Prefer

- Typed data. Share one type between the handler response and the client that reads it. Avoid `any`.
- Gemini calls with `responseMimeType: 'application/json'` and a `responseSchema`. Keep `thinkingBudget: 0` unless a task needs reasoning.
- Reading the cache first. Check `storage.ts` before any API call. A cached mission is keyed by place and language.
- Plain, explicit code. Early returns for bad input. Small pure functions for logic that does not need React.
- Translated text for every user-facing string in all four languages (EN, IT, FR, PT). Put strings with the existing language data, not inline.
- Tailwind utility classes. Match the spacing, colors, and tone of nearby components.
- Large touch targets and short text. The user is a child on a phone.
- Update `CHANGELOG.md` with a dated entry when a change is visible to a user.

## Avoid

- Calling the AI when a cached result exists, or on every render or reload.
- Putting a secret, API key, or prompt in client code. Only `api/` reads `GEMINI_API_KEY`.
- Showing a full task list at once. The mission screen shows one task.
- Free-form AI output that the client must parse as text. Use the schema.
- New dependencies for small jobs. Write the few lines instead.
- Comments that restate the code, dead code, unused exports, and compatibility shims for old data shapes unless stored data needs a migration.
- Reformatting or restyling files you did not change.
- Adding a test, mock, or fallback only to make a check pass.
