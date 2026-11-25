import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import CarForm from "../../resources/js/components/CarForm.vue";
import NewForm from "../../resources/js/components/NewForm.vue";

test("renders the form correctly", () => {
  const wrapper = mount(NewForm);
  expect(wrapper.text()).toContain("Autó hozzáadása");
  expect(wrapper.text()).toContain("Márka");
  expect(wrapper.text()).toContain("Napi ár (Ft)");
  expect(wrapper.findAll("button").length).toBe(2);
});

test("shows the server's price error", async () => {
  const wrapper = mount(NewForm);
  const form = wrapper.findComponent(CarForm).vm.form;
  form.errors = { pricePerDay: "badPrice" };
  await wrapper.vm.$nextTick();
  expect(wrapper.text()).toContain("1000 és 50 000 Ft közötti árat adj meg.");
});
