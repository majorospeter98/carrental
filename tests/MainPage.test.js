import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import MainPage from "../src/Pages/MainPage.vue";

test("renders the form correctly", () => {
  const wrapper = mount(MainPage);
  expect(wrapper.text()).toContain("Keresés");
  expect(wrapper.findAll("input[type='date']").length).toBe(2);
});

test("startdate has correct early value", () => {
  const wrapper = mount(MainPage);
  const today = new Date().toISOString().split("T")[0];
  expect(wrapper.findAll("input[type='date']")[0].attributes("min")).toBe(
    today
  );
  expect(wrapper.findAll("input[type='date']")[1].attributes("min")).toBe(
    today
  );
});
