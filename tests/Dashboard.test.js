// A szükséges importok
import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import { createPinia } from "pinia";

import DashBoard from "../src/Pages/Dashboard.vue";

test("renders the form correctly", () => {
  const pinia = createPinia({
    //
    initialState: {
      car: {
        cars: [],
        selectedCar: null,
      },
    },
  });

  const wrapper = mount(DashBoard, {
    global: {
      plugins: [pinia],
    },
  });

  expect(wrapper.text()).toContain("Autók");
  expect(wrapper.text()).toContain("Kijelentkezés");
  expect(wrapper.text()).toContain("Foglalások");
});
