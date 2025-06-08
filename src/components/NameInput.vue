<!-- NameInput.vue -->
<template>
  <div class="col-md-6">
    <label for="name" class="form-label">Név</label>
    <input
      type="text"
      id="name"
      class="form-control"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      required
      placeholder="Teljes név"
    />
  </div>
</template>

<script>
export default {
  props: ['modelValue'],
};
</script>