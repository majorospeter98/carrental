<template>
  <div class="page-narrow">
    <p class="font-display text-8xl leading-none font-bold text-amber">404</p>
    <h1 class="my-4 text-5xl">{{ t("notFound") }}</h1>
    <p class="mb-6 text-soft">{{ t("notFoundHelp") }}</p>
    <Link href="/main" class="btn">{{ t("home") }}</Link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Link } from "@inertiajs/vue3";
import { t } from "../i18n";

export default defineComponent({
  components: { Link },
  methods: { t },
});
</script>
