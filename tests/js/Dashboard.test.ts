import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
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
