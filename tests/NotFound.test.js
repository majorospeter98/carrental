import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import NotFound from "../src/Pages/NotFound.vue";

test("renders the page correctly", () => {
  const wrapper = mount(NotFound);
  expect(wrapper.text()).toContain("Nem létező oldal");
  expect(wrapper.text()).toContain("Vissza a főoldalra");
});
