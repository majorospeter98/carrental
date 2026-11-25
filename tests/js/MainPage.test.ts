import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import MainPage from "../../resources/js/Pages/MainPage.vue";
import { loadDates, loadLang, preferences } from "../../resources/js/preferences";
import { addDays, today } from "../../resources/js/utils/booking";
import { cars } from "./fixtures";

const render = () => mount(MainPage, { props: { cars: cars() } });

test("renders the search form", () => {
  const wrapper = render();
  expect(wrapper.text()).toContain("Szabad autók");
  expect(wrapper.findAll("input[type='date']").length).toBe(2);
});

test("date inputs cannot start in the past", () => {
  const inputs = render().findAll("input[type='date']");
  expect(inputs[0].attributes("min")).toBe(today());
  expect(inputs[1].attributes("min")).toBe(today());
});

test("shows the total for the selected days", () => {
  // the Golf is free today: 3 days x 12 000 Ft
  expect(render().text().replace(/\s/g, "")).toContain("36000Ft");
});

test("says so when no car is free", async () => {
  preferences.dates = { from: addDays(today(), 12), to: addDays(today(), 13) };
  const wrapper = render();
  await wrapper.find("form").trigger("submit");
  expect(wrapper.text()).toContain("Erre az időszakra nincs szabad autó.");
});

test("saved dates that have passed start again from today", () => {
  preferences.dates = { from: addDays(today(), -9), to: addDays(today(), -7) };
  const inputs = render().findAll("input[type='date']");
  expect(inputs.map((input) => (input.element as HTMLInputElement).value)).toEqual([today(), addDays(today(), 2)]);
});

test("a later pick-up moves the return date and both are saved", async () => {
  const day = addDays(today(), 5);
  const inputs = render().findAll("input[type='date']");
  await inputs[0].setValue(day);
  expect((inputs[1].element as HTMLInputElement).value).toBe(day);
  expect(loadDates()).toEqual({ from: day, to: day });
});

test.each(["{broken", '"de"', '{"from":1}'])("a saved value like %s is ignored", (value) => {
  localStorage.setItem("lang", value);
  localStorage.setItem("dates", value);
  expect(loadLang()).toBe("hu");
  expect(loadDates()).toBe(null);
});
