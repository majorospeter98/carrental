<template>
  <form class="flex flex-wrap items-start gap-3 px-4 pt-5 sm:px-12 sm:[&>div]:w-40" novalidate @submit.prevent="$emit('submit')">
    <DateFields :errors="errors" />
    <button type="submit" class="btn w-full sm:mt-6 sm:w-auto">{{ t("search") }}</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import DateFields from "./DateFields.vue";
import { t } from "../i18n";
import type { FieldErrors } from "../types";

export default defineComponent({
  components: { DateFields },
  props: {
    errors: { type: Object as PropType<FieldErrors>, default: () => ({}) },
  },
  emits: ["submit"],
  methods: { t },
});
</script>
