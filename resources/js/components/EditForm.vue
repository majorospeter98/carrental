<template>
  <CarForm :title="t('editCar')" :car="car" @saved="$emit('saved', $event)" @close="$emit('close')" />
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import CarForm from "./CarForm.vue";
import { t } from "../i18n";
import type { Car } from "../types";

export default defineComponent({
  components: { CarForm },
  props: {
    car: { type: Object as PropType<Car | null>, default: null },
  },
  emits: ["saved", "close"],
  methods: { t },
});
</script>
