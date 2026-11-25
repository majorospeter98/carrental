<template>
  <section class="relative isolate flex min-h-96 items-end overflow-hidden">
    <CarPhoto
      :key="car.id"
      :car="car"
      :sizes="sizes"
      class="arrive absolute inset-0 -z-20 h-full w-full object-[center_35%]"
      :class="{ 'brightness-[.82] contrast-[1.08]': car.image }"
    />
    <div class="absolute inset-0 -z-10 bg-linear-to-t from-night from-5% via-night/60 via-40% to-dusk/30"></div>
    <div class="flex w-full flex-wrap items-end justify-between gap-6 px-4 py-8 sm:px-12">
      <h1 class="max-w-full min-w-0 text-6xl wrap-anywhere [text-shadow:0_4px_24px_rgb(0_0_0/.55)] lg:text-8xl">{{ car.brand }}<br />{{ car.model }}</h1>
      <slot />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import CarPhoto from "./CarPhoto.vue";
import type { Car } from "../types";

export default defineComponent({
  components: { CarPhoto },
  props: {
    car: { type: Object as PropType<Car>, required: true },
    sizes: { type: String, default: "100vw" },
  },
});
</script>
