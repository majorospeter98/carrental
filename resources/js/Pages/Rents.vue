<template>
  <div class="grid grid-cols-1 lg:min-h-[75vh] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
    <!-- the stage is as tall as the form, so a cropped photo is far wider than its column -->
    <CarStage :car="car" :task="t('bookingTitle')" sizes="(min-width: 1024px) 1600px, max(100vw, 750px)">
      <Link href="/main" class="btn btn-quiet">{{ t("back") }}</Link>
    </CarStage>

    <form class="grid grid-cols-1 content-start gap-4 bg-deep px-4 py-8 sm:px-10" novalidate @submit.prevent="submitForm">
      <h2 class="text-3xl">{{ t("bookingTitle") }}</h2>
      <p class="-mt-2 text-sm text-soft">{{ t("allRequired") }}</p>
      <div class="grid gap-4 sm:grid-cols-2">
        <DateFields :errors="errors" />
      </div>
      <p v-if="errors.range" class="text-sm font-semibold text-alert" role="alert">{{ t(errors.range) }}</p>

      <FormField v-model.trim="form.name" name="name" required maxlength="80" :label="t('name')" :error="form.errors.name" autocomplete="name" />
      <FormField v-model.trim="form.email" name="email" type="email" required maxlength="120" :label="t('email')" :error="form.errors.email" autocomplete="email" />
      <FormField v-model.trim="form.phone" name="phone" type="tel" required maxlength="20" :label="t('phone')" :error="form.errors.phone" autocomplete="tel" placeholder="36301234567" />

      <div class="flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-4" aria-live="polite">
        <span>{{ t("total") }}<br />{{ dayLabel(current.days) }} × {{ money(car.pricePerDay) }}</span>
        <strong class="font-display text-5xl leading-none text-amber-ink">{{ money(current.price) }}</strong>
      </div>
      <button type="submit" class="btn" :disabled="form.processing">{{ t("book") }}</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { Link, useForm } from "@inertiajs/vue3";
import CarStage from "../components/CarStage.vue";
import DateFields from "../components/DateFields.vue";
import FormField from "../components/FormField.vue";
import { chosenDates, clearDraft, draft, preferences } from "../preferences";
import { quote } from "../utils/booking";
import { dayLabel, money, t } from "../i18n";
import type { Car, FieldErrors, Period } from "../types";

export default defineComponent({
  components: { Link, CarStage, DateFields, FormField },
  props: {
    car: { type: Object as PropType<Car>, required: true },
  },
  data() {
    return {
      form: useForm({ ...draft }),
    };
  },
  computed: {
    // the dates and "range" come back from the server but are not fields of the form
    errors(): FieldErrors {
      return this.form.errors as FieldErrors;
    },
    dates(): Period {
      return chosenDates(preferences.dates);
    },
    /* a preview: the server works out the price that is charged */
    current() {
      return quote(this.car, this.dates.from, this.dates.to);
    },
    typed(): typeof draft {
      return this.form.data();
    },
  },
  watch: {
    "dates.from": "forgetDateErrors",
    "dates.to": "forgetDateErrors",
    typed(value: typeof draft) {
      Object.assign(draft, value);
    },
  },
  created() {
    preferences.carId = this.car.id;
  },
  methods: {
    t,
    money,
    dayLabel,
    forgetDateErrors() {
      (this.form.clearErrors as (...fields: string[]) => void)("from", "to", "range");
    },
    submitForm() {
      this.form
        .transform((data) => ({ ...data, ...this.dates }))
        .post(`/rents/${this.car.id}`, {
          // "back" from the confirmation should not return to a filled form
          replace: true,
          preserveScroll: true,
          onSuccess: () => clearDraft(),
          onError: () => this.$nextTick(() => (this.$el as HTMLElement).querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()),
        });
    },
  },
});
</script>
