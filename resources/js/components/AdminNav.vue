<template>
  <nav class="mb-8 flex flex-wrap items-center gap-2" :aria-label="t('adminNav')">
    <Link
      v-for="link in links"
      :key="link.to"
      :href="link.to"
      class="inline-flex min-h-11 items-center rounded px-3 font-bold sm:px-5 text-soft aria-[current=page]:bg-deep aria-[current=page]:text-amber-ink"
      :aria-current="$page.url === link.to ? 'page' : undefined"
    >{{ t(link.label) }}</Link>
    <button type="button" class="btn btn-quiet ml-auto min-h-11 px-4 sm:px-6" @click="logOutAdmin">{{ t("logout") }}</button>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Link, router } from "@inertiajs/vue3";
import { t, type MessageKey } from "../i18n";

export default defineComponent({
  components: { Link },
  data() {
    return {
      links: [
        { to: "/admin/dashboard", label: "bookings" },
        { to: "/admin/dashboard/cars", label: "cars" },
      ] as { to: string; label: MessageKey }[],
    };
  },
  methods: {
    t,
    logOutAdmin() {
      router.post("/admin/logout");
    },
  },
});
</script>
