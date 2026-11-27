import { mount } from "@vue/test-utils";
import { test, expect, vi } from "vitest";
import { router } from "@inertiajs/vue3";
import Dashboard from "../../resources/js/Pages/Dashboard.vue";
import AdminNav from "../../resources/js/components/AdminNav.vue";
import { rents } from "./fixtures";

const render = () => mount(Dashboard, { props: { rents: rents() } });

test("lists the bookings", () => {
  const wrapper = render();
  expect(wrapper.text()).toContain("Foglalások");
  expect(wrapper.text()).toContain("Minta Anna");
  expect(wrapper.text()).toContain("Toyota Corolla");
  expect(wrapper.findComponent(AdminNav).text()).toContain("Kijelentkezés");
});

test("logs out through the server", async () => {
  const wrapper = render();
  await wrapper.findComponent(AdminNav).find("button").trigger("click");
  expect(router.post).toHaveBeenCalledWith("/admin/logout");
});

test("deletes one booking only after confirming", async () => {
  const wrapper = render();
  const button = (text: string) => wrapper.findAll("button").find((b) => b.text() === text)!;

  await button("Törlés").trigger("click");
  await button("Mégse").trigger("click");
  expect(router.delete).not.toHaveBeenCalled();

  await button("Törlés").trigger("click");
  await button("Igen, törlöm").trigger("click");
  expect(vi.mocked(router.delete).mock.calls[0][0]).toBe("/admin/dashboard/bookings/1");
});
