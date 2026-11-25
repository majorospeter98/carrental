<template>
  <CarStage :car="car" class="min-h-[75vh]">
    <div class="w-full sm:flex sm:items-end sm:justify-between sm:gap-6">
      <div>
        <h2 class="mb-2 text-4xl" data-focus tabindex="-1">{{ t("doneTitle") }}</h2>
        <p>{{ formatDate(rent.from) }} – {{ formatDate(rent.to) }}</p>
        <p class="mb-4">{{ t("doneText") }}</p>
      </div>
      <div class="sm:text-right">
        <strong class="block font-display text-6xl leading-none text-amber">{{ money(rent.price) }}</strong>
        <span class="mb-3 block">{{ dayLabel(rent.days) }}</span>
        <Link href="/main" class="btn">{{ t("newSearch") }}</Link>
      </div>
    </div>
  </CarStage>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { Link } from "@inertiajs/vue3";
import CarStage from "../components/CarStage.vue";
import { dayLabel, formatDate, money, t } from "../i18n";
import type { Car, Receipt } from "../types";

export default defineComponent({
  components: { Link, CarStage },
  props: {
    rent: { type: Object as PropType<Receipt>, required: true },
    car: { type: Object as PropType<Car>, required: true },
  },
  methods: { t, money, formatDate, dayLabel },
});
</script>
