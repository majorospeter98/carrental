<template>
  <CarForm :title="t('addCar')" @saved="$emit('saved')" @close="$emit('close')" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CarForm from "./CarForm.vue";
import { t } from "../i18n";

export default defineComponent({
  components: { CarForm },
  emits: ["saved", "close"],
  methods: { t },
});
</script>
