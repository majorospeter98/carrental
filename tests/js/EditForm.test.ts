import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import EditForm from "../../resources/js/components/EditForm.vue";

test("renders the form correctly", () => {
  const wrapper = mount(EditForm);
  expect(wrapper.text()).toContain("Autó szerkesztése");
  expect(wrapper.text()).toContain("Márka");
  expect(wrapper.text()).toContain("Napi ár (Ft)");
  expect(wrapper.findAll("button").length).toBe(2);
});
