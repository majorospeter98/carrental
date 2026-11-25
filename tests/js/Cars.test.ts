import { mount, type VueWrapper } from "@vue/test-utils";
import { test, expect, vi } from "vitest";
import { router } from "@inertiajs/vue3";
import Cars from "../../resources/js/Pages/Cars.vue";
import { cars } from "./fixtures";

const render = () => mount(Cars, { props: { cars: cars() } });
const button = (wrapper: VueWrapper, text: string) => wrapper.findAll("button").find((b) => b.text() === text);

test("lists the fleet", () => {
  const wrapper = render();
  expect(wrapper.text()).toContain("Autók");
  expect(wrapper.text()).toContain("Autó hozzáadása");
  expect(wrapper.text()).toContain("Volkswagen Golf");
});

test("sends a new car to the server", async () => {
  const wrapper = render();
  await button(wrapper, "Autó hozzáadása")!.trigger("click");
  await wrapper.find("input[name='brand']").setValue("Skoda");
  await wrapper.find("input[name='model']").setValue("Octavia");
  await wrapper.find("input[name='pricePerDay']").setValue("9000");
  await wrapper.find("form").trigger("submit");
  expect(vi.mocked(router.post).mock.calls[0].slice(0, 2)).toEqual([
    "/admin/dashboard/cars",
    { brand: "Skoda", model: "Octavia", pricePerDay: "9000" },
  ]);
});

test("sends an edit and returns to the list once saved", async () => {
  const wrapper = render();
  await button(wrapper, "Szerkesztés")!.trigger("click");
  await wrapper.find("input[name='pricePerDay']").setValue("13000");
  await wrapper.find("form").trigger("submit");

  const [url, data, options] = vi.mocked(router.put).mock.calls[0];
  expect(url).toBe("/admin/dashboard/cars/1");
  expect((data as Record<string, string>).pricePerDay).toBe("13000");
  options!.onSuccess!({} as never);
  await wrapper.vm.$nextTick();
  expect(wrapper.find("form").exists()).toBe(false);
});
