/* The visitor's choices are kept in the browser (localStorage). */
import { reactive } from "vue";
import type { Period } from "./types";
import { addDays, today } from "./utils/booking";

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
  return typeof from === "string" && typeof to === "string" ? { from, to } : null;
}

export const loadLang = (): Lang => (load("lang") === "en" ? "en" : "hu");

export const saveLang = (lang: Lang) => save("lang", lang);

/* carId is the car last put on stage, so "Back" returns to it. It is not saved. */
export const preferences = reactive({ dates: loadDates(), carId: null as number | null });

/* What the renter has typed, kept while they look around. Personal data: memory only, never storage. */
const emptyDraft = { name: "", email: "", phone: "", address: "" };
export const draft = reactive({ ...emptyDraft });
export const clearDraft = () => Object.assign(draft, emptyDraft);

/* Nothing saved or a day gone by: start from today. A field the visitor emptied stays empty. */
export function chosenDates(saved: Period | null): Period {
  let { from, to } = saved ?? { from: today(), to: addDays(today(), 2) };
  if (from && from < today()) from = today();
  if (to && to < today()) to = addDays(from || today(), 2);
  return { from, to };
}

export function setDates(dates: Period) {
  preferences.dates = dates;
  save("dates", dates);
}
