<template>
  <div class="grid min-w-0 content-start gap-1">
    <label :for="id" class="text-sm font-semibold text-soft">{{ label }}</label>
    <input
      :id="id"
      :name="name"
      :value="modelValue"
      class="input"
      :class="{ 'border-alert!': error }"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? id + '-error' : undefined"
      v-bind="$attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" :id="id + '-error'" class="text-sm font-semibold text-alert">{{ t(error) }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { t, type MessageKey } from "../i18n";

export default defineComponent({
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: [String, Number], default: "" },
    error: { type: String as PropType<MessageKey | "">, default: "" },
  },
  emits: ["update:modelValue"],
  computed: {
    id() {
      return "field-" + this.name;
    },
  },
  methods: { t },
});
</script>
