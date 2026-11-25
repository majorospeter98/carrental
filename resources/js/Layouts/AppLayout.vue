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
            class="min-h-11 min-w-11 px-2 text-sm font-bold uppercase aria-pressed:text-amber aria-pressed:underline aria-pressed:decoration-2 aria-pressed:underline-offset-4"
            :aria-pressed="locale.lang === lang"
            @click="setLang(lang)"
          >
            {{ lang }}
          </button>
        </div>
      </nav>
    </header>

    <main ref="main" class="flex-1">
      <slot />
    </main>

    <!-- a request that got no page back. Fixed, so it shows wherever the visitor has scrolled;
         at the top, so it does not cover the button they will press again -->
    <div class="fixed inset-x-4 top-2 z-10 mx-auto max-w-md" role="alert">
      <div v-if="failure" class="notice flex items-center justify-between gap-4 border-alert!">
        <p class="font-semibold">{{ t(failure) }}</p>
        <button type="button" class="btn btn-quiet px-4" @click="failure = null">{{ t("close") }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Head, Link, router } from "@inertiajs/vue3";
import { locale, setLang, t, type MessageKey } from "../i18n";
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
      failure: null as MessageKey | null,
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
  },
});
</script>
