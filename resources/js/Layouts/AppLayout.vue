<template>
  <Head :title="pageTitle">
    <meta head-key="description" name="description" :content="t('description')" />
  </Head>
  <div class="flex min-h-screen flex-col">
    <header class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-2 sm:px-12">
      <Link href="/main" class="inline-flex min-h-11 min-w-0 items-center font-display text-2xl font-bold wrap-anywhere uppercase">{{ t("brand") }}</Link>
      <nav class="flex flex-wrap items-center gap-x-3" :aria-label="t('mainNav')">
        <Link href="/admin" class="inline-flex min-h-11 min-w-11 items-center justify-center font-semibold text-soft hover:text-ink">{{ t("admin") }}</Link>
        <div role="group" :aria-label="t('language')" class="flex">
          <button
            v-for="lang in (['hu', 'en'] as const)"
            :key="lang"
            type="button"
            class="min-h-11 min-w-11 px-2 text-sm font-bold uppercase aria-pressed:text-amber-ink aria-pressed:underline aria-pressed:decoration-2 aria-pressed:underline-offset-4"
            :aria-pressed="locale.lang === lang"
            @click="setLang(lang)"
          >
            {{ lang }}
          </button>
        </div>
        <!-- the name and the icon both say what a press gives -->
        <button
          type="button"
          class="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-soft hover:text-ink"
          :aria-label="t(appearance.theme === 'light' ? 'darkTheme' : 'lightTheme')"
          :title="t(appearance.theme === 'light' ? 'darkTheme' : 'lightTheme')"
          data-theme-toggle
          @click="toggleTheme"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path v-if="appearance.theme === 'light'" d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
            <template v-else>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </template>
          </svg>
        </button>
      </nav>
    </header>

    <!-- a request that got no page back. Sticky: it takes its own space under the header, and
         stays at the top once scrolled, away from the button the visitor will press again -->
    <div class="sticky top-2 z-10 mx-4 sm:mx-auto sm:w-full sm:max-w-md" role="alert">
      <div v-if="failure" class="notice mt-2 flex items-center justify-between gap-4 border-alert!">
        <p class="font-semibold">{{ t(failure) }}</p>
        <button type="button" class="btn btn-quiet px-4" @click="dismiss">{{ t("close") }}</button>
      </div>
    </div>

    <main ref="main" class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Head, Link, router } from "@inertiajs/vue3";
import { locale, setLang, t, type MessageKey } from "../i18n";
import { appearance, setTheme } from "../preferences";
import type { Car } from "../types";

const titles: Partial<Record<string, MessageKey>> = {
  Rents: "bookingTitle",
  Done: "doneTitle",
  Admin: "loginTitle",
  Dashboard: "bookings",
  Cars: "cars",
  NotFound: "notFound",
};

export default defineComponent({
  components: { Head, Link },
  data() {
    return {
      locale,
      appearance,
      failure: null as MessageKey | null,
      // what had focus when the last request started
      returnTo: null as HTMLElement | null,
      stopListening: [] as (() => void)[],
    };
  },
  computed: {
    pageTitle(): string {
      const key = titles[this.$page.component];
      if (!key) return t("brand");
      const car = this.$page.component === "Rents" && (this.$page.props.car as Car | undefined);
      const name = car ? `${t(key)}: ${car.brand} ${car.model}` : t(key);
      return `${name} – ${t("brand")}`;
    },
    path() {
      return this.$page.url.split("?")[0];
    },
  },
  watch: {
    // after a page change, move focus to the new page so it is announced (not on first load)
    path() {
      this.$nextTick(() => {
        const main = this.$refs.main as HTMLElement;
        const target = main.querySelector<HTMLElement>("[data-focus]") ?? main.querySelector("h1");
        target?.setAttribute("tabindex", "-1");
        target?.focus({ preventScroll: true });
      });
    },
  },
  created() {
    document.documentElement.lang = locale.lang;
    // without these, Inertia shows the raw error page in an overlay, or nothing at all
    this.stopListening = [
      router.on("start", () => {
        this.failure = null;
        this.returnTo = document.activeElement as HTMLElement | null;
      }),
      router.on("httpException", (event) => {
        event.preventDefault();
        this.failure = event.detail.response.status === 429 ? "tooMany" : "serverError";
      }),
      router.on("networkError", (event) => {
        event.preventDefault();
        this.failure = "offline";
      }),
    ];
  },
  unmounted() {
    this.stopListening.forEach((stop) => stop());
  },
  methods: {
    t,
    setLang,
    toggleTheme() {
      setTheme(this.appearance.theme === "light" ? "dark" : "light");
    },
    /* closing removes the button that has focus: send it back to where the visitor was */
    dismiss() {
      this.failure = null;
      this.$nextTick(() => {
        let target = this.returnTo;
        if (!target?.isConnected || target === document.body) {
          target = (this.$refs.main as HTMLElement).querySelector("h1");
          target?.setAttribute("tabindex", "-1");
        }
        target?.focus();
      });
    },
  },
});
</script>
