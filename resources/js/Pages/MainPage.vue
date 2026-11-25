<template>
  <!-- phones: dates first. wider screens: the car first, dates in the dock below -->
  <div class="flex flex-col pb-8">
    <form
      class="order-1 flex flex-wrap items-start gap-3 px-4 pt-5 sm:order-2 sm:px-12"
      novalidate
      @submit.prevent="searchAvailableCars"
    >
      <DateFields :errors="errors" />
      <button type="submit" class="btn w-full sm:mt-6 sm:w-auto">{{ t("search") }}</button>
    </form>

    <!-- the live region is always there, so a message added to it is announced -->
    <div class="order-1 sm:order-3" role="status">
      <p v-if="noResults" class="notice mx-4 mt-4 sm:mx-12">
        <strong class="block text-lg">{{ t("noResults") }}</strong>
        {{ t("noResultsHelp") }}
      </p>
    </div>

    <CarStage v-if="car" :car="car" class="order-2 mt-5 sm:order-1 sm:mt-0 sm:min-h-[min(60vh,40rem)]">
      <div class="sm:text-right" aria-live="polite">
        <strong class="block font-display text-5xl leading-none text-amber lg:text-6xl">
          {{ money(free ? current.price : car.pricePerDay) }}
        </strong>
        <span class="mb-3 block">
          {{ free ? `${dayLabel(current.days)} · ${money(car.pricePerDay)} ${t("perDay")}` : t("perDay") }}
        </span>
        <Link v-if="free" :href="'/rents/' + car.id" class="btn">{{ t("choose") }}</Link>
        <span v-else class="btn btn-off" aria-disabled="true">{{ valid ? t("booked") : t("pickDates") }}</span>
      </div>
    </CarStage>
    <p v-else class="notice order-2 mx-4 mt-4 sm:mx-12">{{ t("noCars") }}</p>

    <div v-if="car" class="order-3 grid gap-5 px-4 pt-5 sm:order-4 sm:px-12">
      <ul class="grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
        <li v-for="item in fleet" :key="item.car.id">
          <button
            type="button"
            class="grid h-full w-full grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 rounded border border-line bg-deep p-2 text-left aria-pressed:border-amber aria-pressed:bg-raise"
            :aria-pressed="item.car.id === car.id"
            @click="shownId = item.car.id"
          >
            <CarPhoto :car="item.car" decorative sizes="72px" class="h-14 w-18 rounded-xs" :class="{ 'brightness-50 grayscale': item.booked }" />
            <span class="min-w-0 wrap-anywhere">
              <b class="block leading-tight">{{ item.car.brand }} {{ item.car.model }}</b>
              <!-- every car shows its total, so prices compare without clicking -->
              <span v-if="item.booked" class="block text-sm text-alert">{{ t("booked") }}</span>
              <span v-else-if="valid" class="block text-sm text-soft">
                {{ t("available") }} · <b class="text-amber">{{ money(item.price) }}</b>
              </span>
              <span v-else class="block text-sm text-soft">{{ money(item.car.pricePerDay) }} {{ t("perDay") }}</span>
            </span>
          </button>
        </li>
      </ul>
      <DateStrip :car="car" :from="dates.from" :to="dates.to" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { Link } from "@inertiajs/vue3";
import CarPhoto from "../components/CarPhoto.vue";
import CarStage from "../components/CarStage.vue";
import DateFields from "../components/DateFields.vue";
import DateStrip from "../components/DateStrip.vue";
import { chosenDates, preferences } from "../preferences";
import { dateErrors, isFree, isValidRange, quote } from "../utils/booking";
import { dayLabel, money, t } from "../i18n";
import type { Car, FieldErrors, Period } from "../types";

export default defineComponent({
  components: { Link, CarPhoto, CarStage, DateFields, DateStrip },
  props: {
    cars: { type: Array as PropType<Car[]>, required: true },
  },
  data() {
    return {
      shownId: null as number | null,
      searched: false,
      errors: {} as FieldErrors,
    };
  },
  computed: {
    dates(): Period {
      return chosenDates(preferences.dates);
    },
    valid() {
      return isValidRange(this.dates.from, this.dates.to);
    },
    // undefined while the fleet is empty
    car(): Car | undefined {
      return this.cars.find((car) => car.id === this.shownId) ?? this.cars[0];
    },
    current() {
      return quote(this.car, this.dates.from, this.dates.to);
    },
    free() {
      return this.valid && !!this.car && isFree(this.car, this.dates.from, this.dates.to);
    },
    fleet() {
      const { from, to } = this.dates;
      return this.cars.map((car) => ({
        car,
        booked: this.valid && !isFree(car, from, to),
        price: quote(car, from, to).price,
      }));
    },
    noResults() {
      return this.searched && this.valid && this.fleet.every((item) => item.booked);
    },
  },
  watch: {
    "dates.from": "forgetSearch",
    "dates.to": "forgetSearch",
  },
  methods: {
    t,
    money,
    dayLabel,
    forgetSearch() {
      this.searched = false;
      this.errors = {};
    },
    searchAvailableCars() {
      this.errors = dateErrors(this.dates.from, this.dates.to);
      this.searched = !Object.keys(this.errors).length;
      if (!this.searched) return;
      // put a free car on stage if the current one is taken
      const freeCar = this.fleet.find((item) => !item.booked);
      if (!this.free && freeCar) this.shownId = freeCar.car.id;
    },
  },
});
</script>
