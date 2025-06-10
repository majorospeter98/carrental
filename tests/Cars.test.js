// A szükséges importok
import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import { createPinia } from "pinia";

import Cars from "../src/Pages/Cars.vue";

test("renders the form correctly", () => {
  // needed massive chatgpt help with this file and Dashboard.test.js file. Both file not worked because Pinia error.
  // Also two component not working for another Pinia error)
  //
  const pinia = createPinia({
    initialState: {
      car: {
        cars: [],
        selectedCar: null,
      },
    },
  });

  const wrapper = mount(Cars, {
    global: {
      plugins: [pinia],
    },
  });

  expect(wrapper.text()).toContain("Vissza");
  expect(wrapper.text()).toContain("Autók");
  expect(wrapper.text()).toContain("Autó hozzáadása");
});
