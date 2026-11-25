import { createApp, h, type DefineComponent } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import AppLayout from "./Layouts/AppLayout.vue";

import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow/700.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "../css/app.css";

const pages = import.meta.glob<{ default: DefineComponent }>("./Pages/*.vue", { eager: true });

createInertiaApp({
  resolve: (name) => {
    const page = pages[`./Pages/${name}.vue`].default;
    // the header stays mounted between pages
    page.layout ??= AppLayout;
    return page;
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el!); // only server rendering has no element
  },
  progress: { color: "var(--color-amber)" },
});
