<template>
  <form class="grid max-w-md gap-4" novalidate @submit.prevent="submit">
    <h1 ref="heading" class="text-3xl wrap-anywhere" tabindex="-1">{{ title }}</h1>
    <p class="-mt-2 text-sm text-soft">{{ t("allRequired") }}</p>
    <FormField v-model.trim="form.brand" name="brand" required maxlength="30" :label="t('brandField')" :error="form.errors.brand" />
    <FormField v-model.trim="form.model" name="model" required maxlength="30" :label="t('model')" :error="form.errors.model" />
    <FormField v-model="form.pricePerDay" name="pricePerDay" type="number" required min="1000" max="50000" :label="t('price')" :error="form.errors.pricePerDay" />
    <div class="flex flex-wrap gap-3">
      <button type="submit" class="btn" :disabled="form.processing || unchanged">{{ t("save") }}</button>
      <button type="button" class="btn btn-quiet" @click="$emit('close')">{{ t("cancel") }}</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { useForm } from "@inertiajs/vue3";
import FormField from "./FormField.vue";
import { t } from "../i18n";
import type { Car } from "../types";

const fromCar = (car: Car | null) => ({
  brand: car?.brand ?? "",
  model: car?.model ?? "",
  // the input hands back text
  pricePerDay: (car?.pricePerDay ?? "") as number | string,
});

export default defineComponent({
  components: { FormField },
  props: {
    title: { type: String, required: true },
    car: { type: Object as PropType<Car | null>, default: null },
  },
  emits: ["saved", "close"],
  data() {
    return {
      form: useForm(fromCar(this.car)),
    };
  },
  computed: {
    /* an edit that matches the car has nothing to save */
    unchanged(): boolean {
      if (!this.car) return false;
      const saved = fromCar(this.car);
      // as text: a retyped price is a string, the car's is a number
      return (["brand", "model", "pricePerDay"] as const).every((key) => String(this.form[key]).trim() === String(saved[key]).trim());
    },
  },
  watch: {
    "car.id"() {
      this.form = useForm(fromCar(this.car));
    },
  },
  mounted() {
    (this.$refs.heading as HTMLElement).focus();
  },
  methods: {
    t,
    /* the server validates; its errors come back into the form */
    submit() {
      if (this.unchanged) return;
      const options = {
        preserveScroll: true,
        onSuccess: () => this.$emit("saved", `${this.form.brand} ${this.form.model}`),
        onError: () => this.$nextTick(() => (this.$el as HTMLElement).querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()),
      };
      if (this.car) this.form.put(`/admin/dashboard/cars/${this.car.id}`, options);
      else this.form.post("/admin/dashboard/cars", options);
    },
  },
});
</script>
