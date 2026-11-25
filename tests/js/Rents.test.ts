import { mount } from "@vue/test-utils";
import { test, expect, vi } from "vitest";
import { nextTick } from "vue";
import { router } from "@inertiajs/vue3";
import Rents from "../../resources/js/Pages/Rents.vue";
import { preferences } from "../../resources/js/preferences";
import { addDays, today } from "../../resources/js/utils/booking";
import { cars } from "./fixtures";

const render = () => mount(Rents, { props: { car: cars()[0] } });

test("sends the form with the chosen dates, but no price", async () => {
  const wrapper = render();
  await wrapper.find("input[name='name']").setValue("Teszt Elek");
  await wrapper.find("form").trigger("submit");

  const [url, data] = vi.mocked(router.post).mock.calls[0];
  expect(url).toBe("/rents/1");
  expect(data).toEqual({ name: "Teszt Elek", email: "", phone: "", address: "", from: today(), to: addDays(today(), 2) });
});

test("shows the server's errors and forgets the date ones when the dates change", async () => {
  const wrapper = render();
  // "range" is not a field of the form, so the typed errors do not list it
  Object.assign(wrapper.vm.form, { errors: { range: "taken", email: "badEmail" } });
  await nextTick();
  expect(wrapper.text()).toContain("Ez az autó ebben az időszakban már foglalt.");
  expect(wrapper.find("input[name='email']").attributes("aria-invalid")).toBe("true");

  preferences.dates = { from: today(), to: addDays(today(), 3) };
  await nextTick();
  expect(wrapper.text()).not.toContain("Ez az autó ebben az időszakban már foglalt.");
});
