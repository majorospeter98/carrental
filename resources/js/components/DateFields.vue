<template>
  <FormField
    name="from"
    type="date"
    required
    :label="t('from')"
    :error="errors.from"
    :min="today"
    :max="latestStart"
    :model-value="dates.from"
    @update:model-value="setStart"
  />
  <FormField
    name="to"
    type="date"
    required
    :label="t('to')"
    :error="errors.to"
    :min="dates.from || today"
    :max="latestEnd"
    :model-value="dates.to"
    @update:model-value="setEnd"
  />
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import FormField from "./FormField.vue";
import { chosenDates, preferences, setDates } from "../preferences";
import { lastPickup, lastReturn, today } from "../utils/booking";
import { t } from "../i18n";
import type { FieldErrors, Period } from "../types";

export default defineComponent({
  components: { FormField },
  props: {
    errors: { type: Object as PropType<FieldErrors>, default: () => ({}) },
  },
  data() {
    // "max" also makes the browser move on after a four-digit year
    return { today: today(), latestStart: lastPickup() };
  },
  computed: {
    dates(): Period {
      return chosenDates(preferences.dates);
    },
    latestEnd(): string {
      return lastReturn(this.dates.from);
    },
  },
  methods: {
    t,
    /* a pick-up after the return date takes the return date with it */
    setStart(from: string) {
      const to = from && this.dates.to < from ? from : this.dates.to;
      setDates({ from, to });
    },
    setEnd(to: string) {
      setDates({ from: this.dates.from, to });
    },
  },
});
</script>
