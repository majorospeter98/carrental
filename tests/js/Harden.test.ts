import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { test, expect, beforeEach, vi } from "vitest";
import { reactive } from "vue";
import { router } from "@inertiajs/vue3";
import AppLayout from "../../resources/js/Layouts/AppLayout.vue";
import Cars from "../../resources/js/Pages/Cars.vue";
import Dashboard from "../../resources/js/Pages/Dashboard.vue";
import DateStrip from "../../resources/js/components/DateStrip.vue";
import { loadLang } from "../../resources/js/preferences";
import { cars, rents } from "./fixtures";

beforeEach(() => {
  document.body.innerHTML = "";
});
const button = (wrapper: VueWrapper, text: string) => wrapper.findAll("button").find((b) => b.text() === text);

test("clearing the bookings asks first", async () => {
  const wrapper = mount(Dashboard, { props: { rents: rents() }, attachTo: document.body });
  await button(wrapper, "Bejegyzések törlése")!.trigger("click");
  expect(router.delete).not.toHaveBeenCalled();

  await button(wrapper, "Igen, törlöm")!.trigger("click");
  expect(vi.mocked(router.delete).mock.calls[0][0]).toBe("/admin/dashboard/bookings");
});

test("cancelling keeps the bookings", async () => {
  const wrapper = mount(Dashboard, { props: { rents: rents() }, attachTo: document.body });
  await button(wrapper, "Bejegyzések törlése")!.trigger("click");
  await button(wrapper, "Mégse")!.trigger("click");
  expect(router.delete).not.toHaveBeenCalled();
  expect(document.activeElement!.textContent.trim()).toBe("Bejegyzések törlése");
});

test("the date strip says which days are booked", () => {
  const wrapper = mount(DateStrip, { props: { car: cars()[0] } });
  expect(wrapper.find(".sr-only").text()).toMatch(/^Foglalt napok: .+ – .+/);
});

test("the car form takes focus and gives it back", async () => {
  const wrapper = mount(Cars, { props: { cars: cars() }, attachTo: document.body });
  await button(wrapper, "Autó hozzáadása")!.trigger("click");
  expect(document.activeElement!.tagName).toBe("H1");

  await button(wrapper, "Mégse")!.trigger("click");
  await flushPromises();
  expect(document.activeElement!.textContent.trim()).toBe("Autó hozzáadása");
});

test("a new page takes focus and is named in the title", async () => {
  const page = reactive({ url: "/main", component: "MainPage", props: {} });
  const wrapper = mount(AppLayout, {
    attachTo: document.body,
    slots: { default: "<h1>Foglalás</h1>" },
    global: { mocks: { $page: page } },
  });
  expect(wrapper.vm.pageTitle).toBe("Autókölcsönző");

  Object.assign(page, { url: "/rents/1", component: "Rents", props: { car: cars()[0] } });
  await flushPromises();
  expect(wrapper.vm.pageTitle).toBe("Foglalás: Volkswagen Golf – Autókölcsönző");
  expect(document.activeElement!.tagName).toBe("H1");
});

test("choosing a language saves it", async () => {
  const wrapper = mount(AppLayout);
  await button(wrapper, "en")!.trigger("click");
  expect(loadLang()).toBe("en");
  await button(wrapper, "hu")!.trigger("click");
});
