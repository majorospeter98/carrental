<template>
  <div class="page-narrow">
    <!-- smaller than page-title: "Bejelentkezés" must fit the narrow column on one line -->
    <h1 class="mb-6 text-5xl wrap-anywhere">{{ t("loginTitle") }}</h1>
    <form class="grid gap-4" novalidate @submit.prevent="adminForm">
      <FormField v-model="form.username" name="username" required :label="t('username')" autocomplete="username" />
      <FormField v-model="form.password" name="password" type="password" required :label="t('password')" autocomplete="current-password" />
      <p v-if="loginError" class="text-sm font-semibold text-alert" role="alert">{{ t(loginError) }}</p>
      <button type="submit" class="btn" :disabled="form.processing">{{ t("login") }}</button>
      <p class="text-sm text-soft">{{ t("demoHint") }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useForm } from "@inertiajs/vue3";
import FormField from "../components/FormField.vue";
import { t } from "../i18n";
import type { FieldErrors } from "../types";

export default defineComponent({
  components: { FormField },
  data() {
    return {
      form: useForm({ username: "", password: "" }),
    };
  },
  computed: {
    // "login" is an error from the server, not a field of the form
    loginError() {
      return (this.form.errors as FieldErrors).login;
    },
  },
  methods: {
    t,
    adminForm() {
      this.form.post("/admin");
    },
  },
});
</script>
