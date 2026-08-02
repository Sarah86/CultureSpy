# Changelog

All notable changes to CultureSpy are documented here. This project doesn't
follow strict semantic versioning yet (see `package.json`), so entries are
grouped by date instead of version number.

## 2026-08-02

### Added
- **Resume last search results** — a "View Last Scan Results" banner appears
  on the home screen whenever a previous scan/search list is available, so
  reopening it costs zero API calls. Only starting a new search replaces it.
- **Target details on missions** — the mission detail screen now shows the
  address, distance, and a "View on Maps" link for the place the mission was
  generated from, reusing data already fetched during search instead of
  discarding it.
- **Step navigation in mission focus mode** — the step-progress dots are now
  clickable and prev/next arrows were added, so a task can be revisited and
  unchecked instead of only being checkable in forward order.

### Changed
- Search results (scanned/searched targets, origin, last-selected target)
  are now persisted to local storage and restored on load, instead of being
  lost on every page refresh and forcing a repeat API call.
- Rebalanced the mission list card: the delete button moved to a small
  corner badge and the category icon shrank into the ID row, so long
  mission titles no longer get squeezed onto 3–4 lines.
- Rebalanced the task step card: the sensory icon and "up next" indicator
  now sit in a compact row above the instruction text instead of a left
  column that squeezed it into a narrow strip.

## 2026-08-01

### Added
- **Local persistence layer** (`storage.ts`) — a small typed, versioned
  wrapper around `localStorage` that the agent profile, mission list, and
  per-location mission cache all go through, so returning players land
  straight on their dashboard with prior progress intact instead of
  restarting onboarding.
- **Delete missions** — missions can be removed (with a confirmation step)
  from the home list or from within the mission detail screen.
- **One-task focus mode** — mission detail now shows one task at a time
  instead of the full list, to help younger players stay on task; falls
  back to a full review list once a mission is completed.
- **Mission completion celebration** — a trophy/confetti screen appears the
  moment the last task in a mission is checked off, with a shortcut back to
  scanning for a new target.
- **Distance, category, address, and a "View on Maps" link** on each
  place card in the target-selection list.

### Changed
- Search results (scan and manual search) are now sorted nearest-to-farthest
  from the player, and the underlying prompts were tightened so the model
  is explicitly told to order results that way instead of relying solely on
  client-side sorting of possibly-imprecise coordinates.
- Disabled Gemini's default "thinking" budget on the search/scan/mission
  endpoints (they only need structured extraction, not multi-step
  reasoning) and relaxed the geolocation accuracy/timeout used for "scan
  sector" — both cut perceived wait time for a scan or search.
- Increased touch target size and readability across onboarding, the
  footer navigation, and mission/task cards; fixed several responsive
  layout bugs (footer icon overflow at narrow widths, header badge
  wrapping, long non-English button/heading labels overflowing their
  containers) surfaced by that pass and by testing at 320–375px widths.
- Rebalanced font sizes after over-correcting in an earlier pass — most
  labels returned to their original size, while the low-contrast task
  curiosity text and its icon alignment were fixed for real, since that was
  the actual readability complaint.

### Fixed
- Selecting a target no longer regenerates its mission via the AI on every
  visit to the same place — the AI response is cached per place+language
  the first time it's generated.

---

For the code-level detail behind any entry, see the corresponding pull
request on GitHub (`#1`–`#8` at the time of writing).
