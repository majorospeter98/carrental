import { flushPromises, mount } from "@vue/test-utils";
import { test, expect, vi } from "vitest";
import { router } from "@inertiajs/vue3";
import AppLayout from "../../resources/js/Layouts/AppLayout.vue";
import MainPage from "../../resources/js/Pages/MainPage.vue";
import Rents from "../../resources/js/Pages/Rents.vue";
import DateStrip from "../../resources/js/components/DateStrip.vue";
import { preferences } from "../../resources/js/preferences";
import { addDays, today } from "../../resources/js/utils/booking";
import { cars } from "./fixtures";

/* the listener the layout gave to router.on for this event */
const listener = (name: string) =>
  (vi.mocked(router.on).mock.calls as unknown as [string, (event: object) => void][]).find(([event]) => event === name)![1];

test.each([
  ["httpException", { response: { status: 429 } }, "Túl sok próbálkozás."],
  ["httpException", { response: { status: 500 } }, "Hiba történt a szerveren."],
  ["networkError", {}, "A szerver nem érhető el."],
])("%s is told in the page's language", async (name, detail, message) => {
  const wrapper = mount(AppLayout);
  const preventDefault = vi.fn();
  listener(name)({ detail, preventDefault });
  await flushPromises();
  expect(preventDefault).toHaveBeenCalled();
  expect(wrapper.find("[role=alert]").text()).toContain(message);
});

test("a search with a missing date moves focus to it", async () => {
  preferences.dates = { from: "", to: today() };
  const wrapper = mount(MainPage, { props: { cars: cars() }, attachTo: document.body });
  await wrapper.find("form").trigger("submit");
  await flushPromises();
  expect(document.activeElement!.id).toBe("field-from");
  wrapper.unmount();
});

test("a search says how many cars are free", async () => {
  const wrapper = mount(MainPage, { props: { cars: cars() } });
  await wrapper.find("form").trigger("submit");
  // the Corolla is taken on the last of the three default days
  expect(wrapper.find("[role=status]").text()).toBe("2 szabad autó erre az időszakra.");
});

test("the chosen car and the typed details survive leaving the page", async () => {
  const first = mount(Rents, { props: { car: cars()[2] } });
  await first.find("input[name='name']").setValue("Teszt Elek");
  first.unmount();

  expect(mount(MainPage, { props: { cars: cars() } }).find("h1").text()).toContain("BMW");
  const again = mount(Rents, { props: { car: cars()[2] } });
  expect((again.find("input[name='name']").element as HTMLInputElement).value).toBe("Teszt Elek");
  expect(localStorage.length).toBe(0);
});

test("the date strip says where it stops", () => {
  const strip = (days: number) => mount(DateStrip, { props: { car: cars()[0], from: today(), to: addDays(today(), days) } });
  expect(strip(100).text()).toContain("A naptár utolsó látható napja:");
  expect(strip(5).text()).not.toContain("A naptár utolsó látható napja:");
});
