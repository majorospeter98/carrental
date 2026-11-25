<template>
  <img
    v-if="car.image"
    :sizes="srcset ? sizes : undefined"
    :srcset="srcset"
    :src="car.image"
    :alt="decorative ? '' : car.brand + ' ' + car.model"
    decoding="async"
    class="object-cover"
  />
  <!-- cars added by the admin have no photo: a designed stand-in instead of a blank -->
  <div
    v-else
    class="grid place-items-center overflow-hidden bg-deep text-edge"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : t('noPhoto')"
  >
    <svg viewBox="0 0 120 48" class="w-3/5 max-w-sm" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M8 36H5v-9l9-4 18-3 14-11h34l17 12 16 4 3 5v6h-9" />
      <path d="M32 36h52M40 20h62M62 9v11" />
      <circle cx="22" cy="36" r="8" />
      <circle cx="96" cy="36" r="8" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { t } from "../i18n";
import type { Car } from "../types";

export default defineComponent({
  props: {
    car: { type: Object as PropType<Car>, required: true },
    sizes: { type: String, default: "100vw" },
    /* true where the car's name is written next to the picture */
    decorative: { type: Boolean, default: false },
  },
  computed: {
    // the shipped photos also come as WebP in these widths
    srcset(): string | undefined {
      const name = /^\/images\/(golf|toyota|bmw)\.jpg$/.exec(this.car.image)?.[1];
      return name ? [320, 800, 1280, 1920].map((w) => `/images/${name}-${w}.webp ${w}w`).join(", ") : undefined;
    },
  },
  methods: { t },
});
</script>
