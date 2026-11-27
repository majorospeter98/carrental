import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import MainPage from "../../resources/js/Pages/MainPage.vue";
import { loadDates } from "../../resources/js/preferences";
import { addDays, dateErrors, isValidRange, lastPickup, today } from "../../resources/js/utils/booking";
import { cars } from "./fixtures";

test("the date fields have upper limits", () => {
  const inputs = mount(MainPage, { props: { cars: cars() } }).findAll("input[type='date']");
  expect(inputs[0].attributes("max")).toBe(lastPickup());
  // 90 days with both ends counted, from today
  expect(inputs[1].attributes("max")).toBe(addDays(today(), 89));
});

test("too far ahead and too long are named", () => {
  const far = addDays(today(), 366);
  expect(dateErrors(far, far).from).toBe("tooFarAhead");
  expect(dateErrors(today(), addDays(today(), 90)).to).toBe("tooLongStay");
  expect(isValidRange(today(), addDays(today(), 89))).toBe(true);
});

test("a six-digit year is not a date", () => {
  expect(dateErrors("202612-12-15", "202612-12-15").from).toBe("badDate");
  expect(isValidRange("202612-12-15", "202612-12-15")).toBe(false);
  localStorage.setItem("dates", JSON.stringify({ from: "202612-12-15", to: "zzz" }));
  expect(loadDates()).toBe(null);
});
