/* The pages are tested without a server: Inertia is replaced by plain stand-ins. */
import { config } from "@vue/test-utils";
import { vi, beforeEach, type Mock } from "vitest";
import { defineComponent, h, reactive } from "vue";

vi.mock("@inertiajs/vue3", () => {
  const page = reactive({ url: "/", component: "", props: {} });
  const router = { post: vi.fn(), put: vi.fn(), delete: vi.fn() };
  const useForm = (initial: Record<string, unknown>) => {
    let transform = (data: Record<string, unknown>) => data;
    const form: Record<string, any> = reactive({
      ...initial,
      errors: {},
      processing: false,
      data: () => Object.fromEntries(Object.keys(initial).map((key) => [key, form[key]])),
      transform(callback: typeof transform) {
        transform = callback;
        return form;
      },
      clearErrors: (...keys: string[]) => keys.forEach((key) => delete form.errors[key]),
      post: (url: string, options: object) => router.post(url, transform(form.data()), options),
      put: (url: string, options: object) => router.put(url, transform(form.data()), options),
    });
    return form;
  };
  return {
    page,
    router,
    useForm,
    Link: defineComponent({ props: ["href"], render() { return h("a", { href: this.href }, this.$slots.default?.()); } }),
    Head: { render: () => null },
  };
});

const mocked = await import("@inertiajs/vue3");
// "page" exists only on the stand-in above
const { page, router } = mocked as unknown as { page: { props: object }; router: Record<string, Mock> };
const { preferences } = await import("../../resources/js/preferences");
const { locale } = await import("../../resources/js/i18n");

beforeEach(() => {
  Object.values(router).forEach((fn) => fn.mockReset());
  localStorage.clear();
  preferences.dates = null;
  locale.lang = "hu";
  page.props = {};
});

config.global.mocks.$page = page;
