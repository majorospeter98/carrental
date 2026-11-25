/* Dates are "YYYY-MM-DD" strings, so they compare correctly as text. */
import type { MessageKey } from "../i18n";
import type { Car, Period } from "../types";

const DAY = 86400000;
const pad = (n: number) => String(n).padStart(2, "0");

export function today() {
  const d = new Date(); // the visitor's own calendar day, not UTC
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const addDays = (iso: string, n: number) => new Date(Date.parse(iso) + n * DAY).toISOString().slice(0, 10);

/* Both the pick-up and the return day are charged. */
export const dayCount = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / DAY) + 1;

export const isValidRange = (from: string, to: string) => !!from && !!to && from >= today() && to >= from;

export const isFree = (car: Car, from: string, to: string) =>
  (car.bookings ?? []).every((b) => to < b.from || from > b.to);

export const isBookedOn = (car: Car, day: string) =>
  (car.bookings ?? []).some((b) => day >= b.from && day <= b.to);

export function quote(car: Car | undefined, from: string, to: string) {
  const days = car && isValidRange(from, to) ? dayCount(from, to) : 0;
  return { days, price: car ? days * car.pricePerDay : 0 };
}

/* The days drawn in the strip: three weeks, moved and stretched to hold the selection. */
export function stripDays(from: string, to: string) {
  const now = today();
  if (!isValidRange(from, to)) return Array.from({ length: 21 }, (_, i) => addDays(now, i));
  const lead = addDays(from, -3);
  const start = to <= addDays(now, 20) ? now : lead > now ? lead : now;
  const length = Math.min(Math.max(21, dayCount(start, to) + 3), 63);
  return Array.from({ length }, (_, i) => addDays(start, i));
}

export function dateErrors(from: string, to: string) {
  const errors: Partial<Record<keyof Period, MessageKey>> = {};
  if (!from) errors.from = "required";
  else if (from < today()) errors.from = "badFrom";
  if (!to) errors.to = "required";
  else if (from && to < from) errors.to = "badTo";
  return errors;
}
