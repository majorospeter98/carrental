<template>
  <div class="notice" role="group" aria-labelledby="confirm-question">
    <p id="confirm-question" class="mb-3 font-semibold">{{ question }}</p>
    <div class="flex flex-wrap gap-3">
      <button type="button" class="btn" :disabled="busy" @click="$emit('yes')">{{ t("clearYes") }}</button>
      <button ref="keep" type="button" class="btn btn-quiet" @click="$emit('no')">{{ t("cancel") }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { t } from "../i18n";

/* The inline "are you sure?" before the admin's data is deleted. One is open at a time. */
export default defineComponent({
  props: {
    question: { type: String, required: true },
    busy: { type: Boolean, default: false },
  },
  emits: ["yes", "no"],
  // the safe answer has the focus
  mounted() {
    (this.$refs.keep as HTMLElement).focus();
  },
  methods: { t },
});
</script>
