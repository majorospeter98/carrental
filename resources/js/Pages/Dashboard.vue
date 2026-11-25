<template>
  <div class="page">
    <AdminNav />
    <h1 ref="title" class="page-title" tabindex="-1">{{ t("bookings") }}</h1>

    <template v-if="rents.length">
      <ul>
        <li v-for="rent in rents" :key="rent.id" class="grid gap-x-6 gap-y-3 border-t border-line py-5 sm:grid-cols-[10rem_1fr_1fr_auto]">
          <span class="font-display text-2xl leading-tight font-semibold text-cobalt uppercase">
            {{ fullDate(rent.from) }} –<br />{{ fullDate(rent.to) }}
          </span>
          <div class="min-w-0 break-words text-soft">
            <b class="block text-ink">{{ rent.name }}</b>
            <p>{{ rent.email }}</p>
            <p>{{ rent.phone }}</p>
            <p>{{ rent.address }}</p>
          </div>
          <div class="text-soft">
            <b class="block break-words text-ink">{{ rent.car }}</b>
            <p>{{ dayLabel(rent.days) }}</p>
            <p v-if="rent.demo" class="text-sm">{{ t("demoTag") }}</p>
          </div>
          <strong class="text-xl sm:text-right">{{ money(rent.price) }}</strong>
        </li>
      </ul>
      <button v-if="!confirming" ref="clear" type="button" class="btn btn-quiet mt-4" @click="ask">{{ t("clear") }}</button>
      <div v-else class="notice mt-4" role="group" aria-labelledby="clear-question">
        <p id="clear-question" class="mb-3 font-semibold">{{ t("clearConfirm") }}</p>
        <div class="flex flex-wrap gap-3">
          <button type="button" class="btn" @click="clear">{{ t("clearYes") }}</button>
          <button ref="keep" type="button" class="btn btn-quiet" @click="keep">{{ t("cancel") }}</button>
        </div>
      </div>
    </template>
    <p v-else class="notice text-lg">{{ t("noBookings") }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { router } from "@inertiajs/vue3";
import AdminNav from "../components/AdminNav.vue";
import { dayLabel, fullDate, money, t } from "../i18n";
import type { Rent } from "../types";

export default defineComponent({
  components: { AdminNav },
  props: {
    rents: { type: Array as PropType<Rent[]>, required: true },
  },
  data() {
    return { confirming: false };
  },
  methods: {
    t,
    money,
    fullDate,
    dayLabel,
    ask() {
      this.confirming = true;
      this.$nextTick(() => (this.$refs.keep as HTMLElement).focus());
    },
    keep() {
      this.confirming = false;
      this.$nextTick(() => (this.$refs.clear as HTMLElement).focus());
    },
    clear() {
      router.delete("/admin/dashboard/bookings", {
        onSuccess: () => {
          this.confirming = false;
          this.$nextTick(() => (this.$refs.title as HTMLElement).focus());
        },
      });
    },
  },
});
</script>
