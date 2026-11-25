<template>
  <div>
    <ul class="grid grid-cols-7 gap-1 sm:grid-cols-[repeat(auto-fit,minmax(2.25rem,1fr))]" aria-hidden="true">
      <li v-for="day in days" :key="day.date" class="text-center text-xs text-soft" :title="day.title">
        <span class="mb-1 block h-11 rounded-xs transition-colors duration-300" :class="day.class"></span>
        {{ day.label }}
      </li>
    </ul>
    <p class="sr-only">{{ bookedText }}</p>
    <p class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-soft">
      <span><i class="day-picked mr-2 inline-block h-3 w-3" aria-hidden="true"></i>{{ summary }}</span>
      <span aria-hidden="true"><i class="day-free mr-2 inline-block h-3 w-3"></i>{{ t("available") }}</span>
      <span aria-hidden="true"><i class="day-booked mr-2 inline-block h-3 w-3"></i>{{ t("booked") }}</span>
      <span v-if="clash" aria-hidden="true"><i class="day-clash mr-2 inline-block h-3 w-3"></i>{{ t("clash") }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { dayCount, isBookedOn, isFree, isValidRange, stripDays, today } from "../utils/booking";
import { dayLabel, formatDate, t } from "../i18n";
import type { Car } from "../types";

export default defineComponent({
  props: {
    car: { type: Object as PropType<Car>, required: true },
    from: { type: String, default: "" },
    to: { type: String, default: "" },
  },
  computed: {
    days() {
      const valid = isValidRange(this.from, this.to);
      return stripDays(this.from, this.to).map((date, i) => {
        const busy = isBookedOn(this.car, date);
        const picked = valid && date >= this.from && date <= this.to;
        const number = Number(date.slice(8));
        return {
          date,
          // name the month where it starts, so a strip far ahead is not ambiguous
          label: i === 0 || number === 1 ? formatDate(date) : number,
          title: `${formatDate(date)} · ${t(busy ? "booked" : "available")}`,
          class: busy ? (picked ? "day-clash" : "day-booked") : picked ? "day-picked" : "day-free",
        };
      });
    },
    clash() {
      return isValidRange(this.from, this.to) && !isFree(this.car, this.from, this.to);
    },
    bookedText() {
      const now = today();
      const ranges = (this.car.bookings ?? [])
        .filter((b) => b.to >= now)
        .sort((a, b) => a.from.localeCompare(b.from))
        .map((b) => `${formatDate(b.from)} – ${formatDate(b.to)}`);
      return ranges.length ? `${t("bookedDays")}: ${ranges.join(", ")}` : t("noBookedDays");
    },
    summary() {
      if (!isValidRange(this.from, this.to)) return t("pickDates");
      return `${formatDate(this.from)} – ${formatDate(this.to)} · ${dayLabel(dayCount(this.from, this.to))}`;
    },
  },
  methods: { t },
});
</script>
