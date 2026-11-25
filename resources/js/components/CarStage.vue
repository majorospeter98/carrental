<template>
  <!-- without a photo the drawing takes its own space above the name, so long names cannot run over it -->
  <section class="relative isolate flex min-h-96 overflow-hidden" :class="car.image ? 'items-end' : 'flex-col justify-end'">
    <CarPhoto
      :key="car.id"
      :car="car"
      :sizes="sizes"
      fetchpriority="high"
      class="arrive -z-20 w-full"
      :class="car.image ? 'absolute inset-0 h-full object-[center_35%] brightness-[.82] contrast-[1.08]' : 'min-h-40 flex-1'"
    />
    <div class="absolute inset-0 -z-10 bg-linear-to-t from-night from-5% via-night/60 via-40% to-dusk/30"></div>
    <div class="flex w-full flex-wrap items-end justify-between gap-6 px-4 py-8 sm:px-12">
      <h1 class="max-w-full min-w-0 text-6xl wrap-anywhere [text-shadow:0_4px_24px_rgb(0_0_0/.55)] lg:text-8xl">
        <span v-if="task" class="sr-only">{{ task }}: </span>{{ car.brand }}<br />{{ car.model }}
      </h1>
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
    /* the photo is cropped to fill, so what counts is its height times about 2, not the stage width */
    sizes: { type: String, default: "(max-width: 639px) 750px, max(100vw, 120vh)" },
    /* for screen readers: what this page does with the car */
    task: { type: String, default: "" },
  },
});
</script>
