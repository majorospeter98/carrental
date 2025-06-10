import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import addForm from "../src/components/NewForm.vue";

test("renders the form correctly", () => {
  const wrapper = mount(addForm);
  expect(wrapper.text()).toContain("Autó hozzáadása");
  expect(wrapper.text()).toContain("Márka");
  expect(wrapper.text()).toContain("Napi ár (Ft)");
  expect(wrapper.findAll("button").length).toBe(3);
});
