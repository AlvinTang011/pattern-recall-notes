# Pattern Recall

Pattern Recall is a Leetcode learning notebook for saving what you learned from each problem, why the pattern works, what mistake you made, and when to re-solve it.

The app is intentionally built around the note shape you described:

- Problem: `Two Sum`
- Pattern: `Hash map`
- Core idea: the reusable explanation
- Why pattern: why the technique fits
- Mistake: what went wrong the first time
- Python syntax learned: snippets to remember
- Re-solve date: when to practice again

## What It Does

- Lets you edit Leetcode learning notes directly on the page.
- Starts with example notes for `Two Sum` and `Valid Parentheses`.
- Saves notes in the browser with `localStorage`.
- Lets you search by problem, pattern, or idea.
- Lets you filter notes by pattern.
- Lets you add, delete, restore, and update notes.
- Shows a small recall panel for the next review date and mistake guard.

## Tech Stack

- `Next.js` and `React` for the application UI.
- `vinext` for Cloudflare Worker-compatible builds.
- `Tailwind CSS` for styling.
- Browser `localStorage` for device-local note persistence.
- GitHub Actions for optional GitHub Pages deployment.
- OpenAI Sites metadata in `.openai/hosting.json`.

This is currently a client-side personal notebook. It does not require a login or database.

## Project Structure

```text
app/
  layout.tsx       Site metadata, fonts, and root layout
  page.tsx         Main notebook UI and all note interactions
  globals.css      Global Tailwind and base styles

docs/
  ARCHITECTURE.md  Deeper explanation of the app design

.openai/
  hosting.json     Sites hosting configuration

package.json       Scripts and dependencies
.github/
  workflows/
    pages.yml      Builds and deploys the app to GitHub Pages
```

## How The Code Works

The main application lives in `app/page.tsx`.

The `Note` type defines the shape of one learning note:

```ts
type Note = {
  id: string;
  problem: string;
  pattern: string;
  coreIdea: string;
  whyPattern: string;
  mistake: string;
  syntax: string;
  reSolve: string;
  confidence: number;
};
```

The page stores the main app state with React state:

- `notes`: all saved notes.
- `selectedId`: which note is open in the editor.
- `draft`: the note currently being created.
- `query`: the search text.
- `filter`: the selected pattern filter.

`loadInitialNotes()` reads saved notes from `localStorage` when the browser loads. If there is no saved data, it falls back to the built-in example notes.

Whenever `notes` changes, this effect saves the latest version:

```ts
useEffect(() => {
  window.localStorage.setItem(storageKey, JSON.stringify(notes));
}, [notes]);
```

The app uses `useMemo` for derived data:

- `patterns` builds the list of pattern filter buttons.
- `visibleNotes` applies search and pattern filtering.

The editing functions keep updates immutable:

- `updateSelected()` replaces only the edited note.
- `addNote()` creates a new note and selects it.
- `deleteSelected()` removes the current note.
- `resetNotes()` restores the starter examples.

## Architecture

Pattern Recall is a single-page, client-first application.

```text
Browser
  |
  | edits notes
  v
React state in app/page.tsx
  |
  | auto-saves JSON
  v
localStorage
```

There is no backend service yet. That keeps the first version simple, fast, and private to the current browser.

For a deeper breakdown, see `docs/ARCHITECTURE.md`.

## Best Practices Used

- Typed data model: the `Note` type makes the note fields explicit.
- Immutable state updates: note edits create new arrays instead of mutating existing state.
- Derived state with `useMemo`: filters are computed from source state instead of stored separately.
- Graceful persistence fallback: invalid saved JSON is removed and the app returns to starter notes.
- Clear separation of repeated UI: `EditorArea` avoids repeating textarea markup.
- Accessible form basics: labels are paired with inputs and textareas.
- Responsive layout: the app moves from a three-column desktop layout to stacked mobile sections.
- Conservative persistence: browser storage avoids adding a database before the product needs one.

## Current Limitations

- Notes are saved only in the current browser.
- There is no account system or cross-device sync.
- Re-solve dates are plain text, not real scheduled dates.
- There are no import/export tools yet.
- All note logic currently lives in `app/page.tsx`; this is fine for the current size, but it should be split as the app grows.

## Future Roadmap

1. Add real spaced repetition scheduling.
2. Add tags such as `array`, `string`, `graph`, `dp`, and `sliding window`.
3. Add import/export as JSON or Markdown.
4. Add a review mode that hides the solution until you try to explain it.
5. Add problem difficulty, Leetcode URL, and last-solved date fields.
6. Move reusable UI into components such as `NoteEditor`, `NoteList`, and `ReviewPanel`.
7. Move note logic into a custom hook such as `useNotes()`.
8. Add tests for adding, editing, filtering, deleting, and restoring notes.
9. Add D1 database storage if cross-device sync becomes important.
10. Add authentication only if notes need to follow a user across devices.

## Development

Install dependencies:

```bash
npm ci
```

Start the local dev server:

```bash
npm run dev
```

Build the site:

```bash
npm run build
```

Lint the code:

```bash
npm run lint
```

## GitHub Pages

This project includes `.github/workflows/pages.yml`.

When the repository is pushed to the `main` branch, GitHub Actions will:

1. Install dependencies with `npm ci`.
2. Build the app with `next build` in static export mode.
3. Upload the generated `out/` folder.
4. Deploy the site with GitHub Pages.

For a repository named `pattern-recall-notes`, the site should become available at:

```text
https://AlvinTang011.github.io/pattern-recall-notes/
```

In the GitHub repository settings, Pages should use `GitHub Actions` as the source.
