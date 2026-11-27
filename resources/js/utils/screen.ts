import { reactive } from "vue";

// Tailwind's "sm" breakpoint. Tests have no matchMedia: they get the narrow layout
const media = window.matchMedia?.("(min-width: 40rem)");

export const screen = reactive({ wide: !!media?.matches });

media?.addEventListener("change", (event) => (screen.wide = event.matches));
