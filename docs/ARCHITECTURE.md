# Architecture Notes

This document explains how Pattern Recall is designed, why it is currently structured this way, and where the architecture can evolve.

## Product Goal

Pattern Recall is not a general notes app. It is shaped around one learning loop:

1. Solve a Leetcode problem.
2. Capture the reusable pattern.
3. Explain the core idea in your own words.
4. Record the mistake you made.
5. Save syntax you want to remember.
6. Schedule the next re-solve.

The UI is built to keep those fields visible instead of hiding them in a free-form document.

## Runtime Architecture

The app uses a client-first architecture:

```text
app/page.tsx
  |
  | React state
  v
notes, selectedId, draft, query, filter
  |
  | computed with useMemo
  v
patterns, visibleNotes, selectedNote
  |
  | persisted with useEffect
  v
browser localStorage
```

This means the browser is the source of persistence. The React state is the source of truth while the app is open, and `localStorage` keeps that state after refresh.

## Main Files

### `app/layout.tsx`

This file defines the root shell:

- Site title: `Pattern Recall`
- Site description
- App fonts
- Global CSS import

It does not contain product logic.

### `app/page.tsx`

This is the core application. It includes:

- The `Note` type.
- Starter note data.
- State setup.
- Local storage loading and saving.
- Search and filter logic.
- Add, edit, delete, and reset actions.
- The full page layout.
- The reusable `EditorArea` component.

Keeping this in one file is acceptable for the first version because the app is still compact. The next refactor should split this file when the interactions become more complex.

### `app/globals.css`

This file loads Tailwind and defines global theme basics.

Most visual styling currently uses Tailwind utility classes directly in `app/page.tsx`.

## Data Model

Each note has this shape:

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

The fields are intentionally specific. This nudges the user toward active recall instead of vague note-taking.

## State Design

The app keeps only essential state:

- `notes`: the saved learning records.
- `selectedId`: the active note.
- `draft`: the new note form.
- `query`: the search box value.
- `filter`: the active pattern filter.

It does not store `visibleNotes`, `patterns`, or `selectedNote` as state because those can be derived from the main state.

That is a useful React best practice: store source data, derive everything else.

## Persistence Design

The app uses browser `localStorage`:

```ts
const storageKey = "leetcode-learning-notes";
```

`loadInitialNotes()` checks for saved data. If the saved data is missing or invalid, the app falls back to the starter examples.

This is a good fit for version one because:

- It works without an account.
- It works without a backend.
- It keeps the app fast.
- It avoids adding database complexity before it is needed.

The tradeoff is that notes are tied to one browser on one device.

## UI Design

The layout has three main work zones:

1. Left sidebar: search, pattern filters, note list.
2. Center editor: the selected note fields.
3. Right panel: add note form and review prompt.

This supports the learning flow:

- Find a problem.
- Edit the learning explanation.
- Check the next re-solve prompt.
- Add another problem quickly.

The design uses restrained colors and compact panels because this is a study tool, not a marketing site.

## Best Practices Already Used

### Typed Data

The `Note` type prevents unclear or accidental note shapes.

### Immutable Updates

Edits use `map()` and array filtering instead of mutating existing note objects.

Example:

```ts
setNotes((current) =>
  current.map((note) =>
    note.id === selectedNote.id ? { ...note, [field]: value } : note,
  ),
);
```

This keeps React updates predictable.

### Derived State

Pattern filters and visible notes are derived with `useMemo`, so they stay aligned with `notes`, `query`, and `filter`.

### Progressive Complexity

The app does not start with a database, auth, or server actions. Those are powerful tools, but they would add weight before the core notebook workflow proves itself.

### Focused Component Extraction

Only the repeated editor textarea was extracted into `EditorArea`. More components can be created later when there is enough repeated structure to justify them.

## What Can Be Improved

### Split `app/page.tsx`

As the app grows, split it into:

```text
app/page.tsx
components/
  NoteEditor.tsx
  NoteList.tsx
  PatternFilters.tsx
  ReviewPanel.tsx
  AddNoteForm.tsx
lib/
  notes.ts
  storage.ts
hooks/
  useNotes.ts
```

### Add Tests

Good first tests:

- Adding a note.
- Editing a selected note.
- Filtering by pattern.
- Searching by problem name.
- Deleting a note.
- Restoring examples.
- Loading saved notes from storage.

### Improve Scheduling

The `reSolve` field is currently plain text. A stronger model would store:

```ts
type ReviewSchedule = {
  nextReviewAt: string;
  intervalDays: number;
  reviewCount: number;
};
```

That would support real spaced repetition.

### Add Import And Export

Exporting notes as JSON or Markdown would protect the user from browser storage loss.

### Add Database Storage Later

If cross-device sync becomes important, add Cloudflare D1 and move notes into a server-backed data model.

Do this only when the product needs it. For a personal local notebook, `localStorage` is simpler and more direct.

## Suggested Roadmap

### Version 1

- Finish the local note-taking experience.
- Add import/export.
- Add better empty states.
- Add tests for core note actions.

### Version 2

- Add true review dates.
- Add review mode.
- Add tags and difficulty.
- Add Leetcode URL support.
- Add syntax sections for multiple languages.

### Version 3

- Add optional sign-in.
- Add D1 database storage.
- Add cross-device sync.
- Add analytics for weak patterns and overdue reviews.

