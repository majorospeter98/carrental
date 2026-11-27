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
            <p v-if="rent.address">{{ rent.address }}</p>
          </div>
          <div class="text-soft">
            <b class="block break-words text-ink">{{ rent.car }}</b>
            <p>{{ dayLabel(rent.days) }}</p>
          </div>
          <strong class="text-xl sm:text-right">{{ money(rent.price) }}</strong>
          <ConfirmBox v-if="confirming === rent.id" class="sm:col-span-full" :question="t('deleteBookingConfirm')" :busy="deleting" @yes="remove(rent.id)" @no="keep" />
          <button
            v-else
            type="button"
            class="btn btn-quiet justify-self-start sm:col-span-full sm:justify-self-end"
            :data-return="rent.id"
            :aria-label="`${t('delete')}: ${rent.name}, ${rent.car}, ${fullDate(rent.from)}`"
            @click="ask(rent.id)"
          >
            {{ t("delete") }}
          </button>
        </li>
      </ul>
      <ConfirmBox v-if="confirming === 'all'" class="mt-4" :question="t('clearConfirm')" :busy="deleting" @yes="clear" @no="keep" />
      <button v-else type="button" class="btn btn-quiet mt-4" data-return="all" @click="ask('all')">{{ t("clear") }}</button>
    </template>
    <p v-else class="notice text-lg">{{ t("noBookings") }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { router } from "@inertiajs/vue3";
import AdminNav from "../components/AdminNav.vue";
import ConfirmBox from "../components/ConfirmBox.vue";
import { dayLabel, fullDate, money, t } from "../i18n";
import type { Rent } from "../types";

export default defineComponent({
  components: { AdminNav, ConfirmBox },
  props: {
    rents: { type: Array as PropType<Rent[]>, required: true },
  },
  data() {
    return {
      // the one question that is open: a booking's id, or all of them
      confirming: null as number | "all" | null,
      deleting: false,
    };
  },
  methods: {
    t,
    money,
    fullDate,
    dayLabel,
    ask(target: number | "all") {
      this.confirming = target;
    },
    /* focus goes back to the button that asked */
    keep() {
      const key = this.confirming;
      this.confirming = null;
      this.$nextTick(() => (this.$el as HTMLElement).querySelector<HTMLElement>(`[data-return="${key}"]`)?.focus());
    },
    remove(id: number) {
      this.destroy(`/admin/dashboard/bookings/${id}`);
    },
    clear() {
      this.destroy("/admin/dashboard/bookings");
    },
    destroy(url: string) {
      this.deleting = true;
      router.delete(url, {
        preserveScroll: true,
        onSuccess: () => {
          this.confirming = null;
          this.$nextTick(() => (this.$refs.title as HTMLElement).focus());
        },
        onFinish: () => (this.deleting = false),
      });
    },
  },
});
</script>
