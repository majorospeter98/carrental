/* The visitor's choices are kept in the browser (localStorage). */
import { reactive } from "vue";
import type { Period } from "./types";
import { addDays, isDate, today } from "./utils/booking";

export type Lang = "hu" | "en";

/* Storage can be blocked or hold anything: then there is no saved value. */
function load(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* the choice then lasts until the page is reloaded */
  }
}

export function loadDates(): Period | null {
  const { from, to } = (load("dates") ?? {}) as Partial<Record<keyof Period, unknown>>;
  // an emptied field is saved as ""
  const ok = (value: unknown): value is string => typeof value === "string" && (value === "" || isDate(value));
  return ok(from) && ok(to) ? { from, to } : null;
}

export const loadLang = (): Lang => (load("lang") === "en" ? "en" : "hu");

export const saveLang = (lang: Lang) => save("lang", lang);

export type Theme = "dark" | "light";

/* dark is the design's own look, so it is what a first visit gets */
export const loadTheme = (): Theme => (load("theme") === "light" ? "light" : "dark");

export const appearance = reactive({ theme: loadTheme() });

/* app.blade.php does the same before the first paint */
export function setTheme(theme: Theme) {
  appearance.theme = theme;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f4f6fb" : "#060d1f");
  save("theme", theme);
}

/* carId is the car last put on stage, so "Back" returns to it. It is not saved. */
export const preferences = reactive({ dates: loadDates(), carId: null as number | null });

/* What the renter has typed, kept while they look around. Personal data: memory only, never storage. */
const emptyDraft = { name: "", email: "", phone: "" };
export const draft = reactive({ ...emptyDraft });
export const clearDraft = () => Object.assign(draft, emptyDraft);

/* Nothing saved or a day gone by: start from today. A field the visitor emptied stays empty. */
export function chosenDates(saved: Period | null): Period {
  let { from, to } = saved ?? { from: today(), to: addDays(today(), 2) };
  if (from && from < today()) from = today();
  if (to && to < today()) to = addDays(isDate(from) ? from : today(), 2);
  return { from, to };
}

export function setDates(dates: Period) {
  preferences.dates = dates;
  save("dates", dates);
}
