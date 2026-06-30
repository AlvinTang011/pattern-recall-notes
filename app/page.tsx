"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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

const starterNotes: Note[] = [
  {
    id: "two-sum",
    problem: "Two Sum",
    pattern: "Hash map",
    coreIdea:
      "Instead of checking every pair, store numbers we have already seen. For each number, calculate target - number. If the complement already exists in the hash map, we found the pair.",
    whyPattern: "It lets us check if a number exists in O(1).",
    mistake:
      "I tried to use two loops first. I also forgot dictionary syntax.",
    syntax: "dict.get(key, default)\nenumerate(nums)",
    reSolve: "Tomorrow, then 3 days later",
    confidence: 68,
  },
  {
    id: "valid-parentheses",
    problem: "Valid Parentheses",
    pattern: "Stack",
    coreIdea:
      "Push opening brackets as I scan. When I see a closing bracket, compare it with the latest opening bracket. The order matters, so last-in first-out matches the problem shape.",
    whyPattern: "A stack tracks the most recent unresolved opening bracket.",
    mistake: "I only checked counts at first and missed ordering mistakes.",
    syntax: "stack.append(char)\nstack.pop()",
    reSolve: "In 2 days",
    confidence: 44,
  },
];

const emptyDraft: Note = {
  id: "",
  problem: "",
  pattern: "",
  coreIdea: "",
  whyPattern: "",
  mistake: "",
  syntax: "",
  reSolve: "",
  confidence: 50,
};

const storageKey = "leetcode-learning-notes";

function makeId(problem: string) {
  return `${problem.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
}

function loadInitialNotes() {
  if (typeof window === "undefined") return starterNotes;

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return starterNotes;

  try {
    const parsed = JSON.parse(saved) as Note[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : starterNotes;
  } catch {
    window.localStorage.removeItem(storageKey);
    return starterNotes;
  }
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(loadInitialNotes);
  const [selectedId, setSelectedId] = useState(starterNotes[0].id);
  const [draft, setDraft] = useState<Note>(emptyDraft);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes]);

  const patterns = useMemo(
    () => ["All", ...Array.from(new Set(notes.map((note) => note.pattern)))],
    [notes],
  );

  const visibleNotes = useMemo(() => {
    const normalized = query.toLowerCase();
    return notes.filter((note) => {
      const matchesFilter = filter === "All" || note.pattern === filter;
      const haystack = `${note.problem} ${note.pattern} ${note.coreIdea}`.toLowerCase();
      return matchesFilter && haystack.includes(normalized);
    });
  }, [filter, notes, query]);

  const selectedNote =
    notes.find((note) => note.id === selectedId) ?? visibleNotes[0] ?? notes[0];

  function updateSelected(field: keyof Note, value: string | number) {
    setNotes((current) =>
      current.map((note) =>
        note.id === selectedNote.id ? { ...note, [field]: value } : note,
      ),
    );
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.problem.trim()) return;

    const nextNote = {
      ...draft,
      id: makeId(draft.problem),
      problem: draft.problem.trim(),
      pattern: draft.pattern.trim() || "Unsorted",
    };

    setNotes((current) => [nextNote, ...current]);
    setSelectedId(nextNote.id);
    setDraft(emptyDraft);
  }

  function resetNotes() {
    setNotes(starterNotes);
    setSelectedId(starterNotes[0].id);
    setQuery("");
    setFilter("All");
  }

  function deleteSelected() {
    if (!selectedNote) return;

    const nextNotes = notes.filter((note) => note.id !== selectedNote.id);
    setNotes(nextNotes);
    setSelectedId(nextNotes[0]?.id ?? "");
  }

  return (
    <main className="min-h-screen bg-[#f4f5f1] text-[#17201b]">
      <section className="border-b border-[#d4d8d0] bg-[#fbfbf7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="flex flex-col justify-center gap-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#526151]">
              Leetcode learning notebook
            </p>
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-[#111813] sm:text-5xl">
                Capture the pattern, the mistake, and the next re-solve date.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#516052]">
                A focused workspace for turning solved problems into reusable
                memory. Your notes stay in this browser so you can keep editing
                while you learn.
              </p>
            </div>
          </div>
          <div className="grid min-h-64 gap-3 rounded-lg border border-[#cfd6c8] bg-[#18211c] p-4 text-[#eef5e9] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#3d4a40] pb-3">
              <span className="text-sm font-medium">Recall Loop</span>
              <span className="rounded bg-[#9ee6d4] px-2 py-1 text-xs font-semibold text-[#10241f]">
                {notes.length} notes
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Tomorrow", "3 days", "1 week"].map((label, index) => (
                <div
                  className="rounded-md border border-[#3d4a40] bg-[#212d25] p-3"
                  key={label}
                >
                  <div
                    className={`mb-4 h-2 rounded ${
                      index === 0
                        ? "bg-[#9ee6d4]"
                        : index === 1
                          ? "bg-[#f0c36b]"
                          : "bg-[#96b8ff]"
                    }`}
                  />
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-2 text-xs leading-5 text-[#b8c5b4]">
                    Re-open one problem and explain the pattern out loud.
                  </p>
                  <p className="mt-4 text-2xl font-semibold">
                    {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-5 lg:grid-cols-[300px_1fr_360px] lg:px-8">
        <aside className="space-y-4">
          <div className="rounded-lg border border-[#d7d9cf] bg-white p-3 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667165]">
              Search
            </label>
            <input
              className="mt-2 h-11 w-full rounded-md border border-[#cfd6c8] px-3 text-sm outline-none focus:border-[#496f57]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Problem, pattern, idea"
              value={query}
            />
          </div>
          <div className="rounded-lg border border-[#d7d9cf] bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667165]">
              Pattern
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {patterns.map((pattern) => (
                <button
                  className={`rounded-md border px-3 py-2 text-sm font-medium ${
                    filter === pattern
                      ? "border-[#243b53] bg-[#243b53] text-white"
                      : "border-[#d4d9ce] bg-[#f7f8f1] text-[#38443a]"
                  }`}
                  key={pattern}
                  onClick={() => setFilter(pattern)}
                  type="button"
                >
                  {pattern}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[#d7d9cf] bg-white shadow-sm">
            {visibleNotes.map((note) => (
              <button
                className={`block w-full border-b border-[#eceee6] p-4 text-left last:border-b-0 ${
                  selectedNote?.id === note.id ? "bg-[#eff4e8]" : "bg-white"
                }`}
                key={note.id}
                onClick={() => setSelectedId(note.id)}
                type="button"
              >
                <span className="block text-sm font-semibold text-[#1f2a22]">
                  {note.problem}
                </span>
                <span className="mt-1 block text-xs text-[#667165]">
                  {note.pattern}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <article className="rounded-lg border border-[#d7d9cf] bg-white p-4 shadow-sm sm:p-5">
          {selectedNote ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7e9df] pb-4">
                <p className="text-sm font-medium text-[#526151]">
                  Saved in this browser
                </p>
                <button
                  className="h-10 rounded-md border border-[#e0c0b8] px-3 text-sm font-semibold text-[#804333]"
                  onClick={deleteSelected}
                  type="button"
                >
                  Delete note
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667165]">
                    Problem
                  </span>
                  <input
                    className="mt-2 h-12 w-full rounded-md border border-[#cfd6c8] px-3 text-lg font-semibold outline-none focus:border-[#496f57]"
                    onChange={(event) =>
                      updateSelected("problem", event.target.value)
                    }
                    value={selectedNote.problem}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667165]">
                    Pattern
                  </span>
                  <input
                    className="mt-2 h-12 w-full rounded-md border border-[#cfd6c8] px-3 outline-none focus:border-[#496f57]"
                    onChange={(event) =>
                      updateSelected("pattern", event.target.value)
                    }
                    value={selectedNote.pattern}
                  />
                </label>
              </div>

              <EditorArea
                label="Core idea"
                onChange={(value) => updateSelected("coreIdea", value)}
                value={selectedNote.coreIdea}
              />
              <EditorArea
                label={`Why ${selectedNote.pattern || "this pattern"}`}
                onChange={(value) => updateSelected("whyPattern", value)}
                value={selectedNote.whyPattern}
              />
              <EditorArea
                label="Mistake I made"
                onChange={(value) => updateSelected("mistake", value)}
                value={selectedNote.mistake}
              />
              <EditorArea
                label="Python syntax learned"
                monospace
                onChange={(value) => updateSelected("syntax", value)}
                value={selectedNote.syntax}
              />

              <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667165]">
                    Re-solve date
                  </span>
                  <input
                    className="mt-2 h-12 w-full rounded-md border border-[#cfd6c8] px-3 outline-none focus:border-[#496f57]"
                    onChange={(event) =>
                      updateSelected("reSolve", event.target.value)
                    }
                    value={selectedNote.reSolve}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Tomorrow", "3 days later", "1 week later"].map(
                      (date) => (
                        <button
                          className="rounded-md border border-[#ccd6dd] bg-[#f4f8fb] px-2 py-1 text-xs font-semibold text-[#294760]"
                          key={date}
                          onClick={() => updateSelected("reSolve", date)}
                          type="button"
                        >
                          {date}
                        </button>
                      ),
                    )}
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667165]">
                    Confidence
                  </span>
                  <input
                    className="mt-4 w-full accent-[#496f57]"
                    max="100"
                    min="0"
                    onChange={(event) =>
                      updateSelected("confidence", Number(event.target.value))
                    }
                    type="range"
                    value={selectedNote.confidence}
                  />
                  <span className="mt-1 block text-sm font-semibold text-[#263229]">
                    {selectedNote.confidence}%
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#667165]">No notes match the filter.</p>
          )}
        </article>

        <aside className="space-y-5">
          <form
            className="rounded-lg border border-[#d7d9cf] bg-white p-4 shadow-sm"
            onSubmit={addNote}
          >
            <h2 className="text-lg font-semibold text-[#1f2a22]">
              Add a learned problem
            </h2>
            <div className="mt-4 grid gap-3">
              <input
                className="h-11 rounded-md border border-[#cfd6c8] px-3 text-sm outline-none focus:border-[#496f57]"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    problem: event.target.value,
                  }))
                }
                placeholder="Problem name"
                value={draft.problem}
              />
              <input
                className="h-11 rounded-md border border-[#cfd6c8] px-3 text-sm outline-none focus:border-[#496f57]"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    pattern: event.target.value,
                  }))
                }
                placeholder="Pattern"
                value={draft.pattern}
              />
              <textarea
                className="min-h-24 rounded-md border border-[#cfd6c8] px-3 py-2 text-sm outline-none focus:border-[#496f57]"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    coreIdea: event.target.value,
                  }))
                }
                placeholder="Core idea"
                value={draft.coreIdea}
              />
              <button
                className="h-11 rounded-md bg-[#243b53] text-sm font-semibold text-white"
                type="submit"
              >
                Add note
              </button>
            </div>
          </form>

          <div className="rounded-lg border border-[#d7d9cf] bg-[#fbf7ea] p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f2a22]">
              Relearn prompt
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#596156]">
              Cover the solution, then explain: pattern, core idea, why it
              works, and the mistake you are avoiding this time.
            </p>
            <div className="mt-4 border-t border-[#e4d9b7] pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a6a3a]">
                Next
              </p>
              <p className="mt-1 text-sm font-semibold">
                {selectedNote?.reSolve ?? "Pick a note"}
              </p>
            </div>
            <div className="mt-4 border-t border-[#e4d9b7] pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a6a3a]">
                Mistake guard
              </p>
              <p className="mt-1 text-sm leading-6">
                {selectedNote?.mistake ?? "Add a mistake to avoid."}
              </p>
            </div>
            <button
              className="mt-4 h-10 rounded-md border border-[#c6b984] px-3 text-sm font-semibold text-[#4b4325]"
              onClick={resetNotes}
              type="button"
            >
              Restore examples
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

function EditorArea({
  label,
  monospace,
  onChange,
  value,
}: {
  label: string;
  monospace?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667165]">
        {label}
      </span>
      <textarea
        className={`mt-2 min-h-28 w-full rounded-md border border-[#cfd6c8] px-3 py-3 text-sm leading-6 outline-none focus:border-[#496f57] ${
          monospace ? "font-mono" : ""
        }`}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}
