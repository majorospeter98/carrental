<template>
  <div class="page">
    <AdminNav />

    <NewForm v-if="adding" @saved="closeForm" @close="closeForm" />
    <EditForm v-else-if="selectedCar" :car="selectedCar" @saved="closeForm" @close="closeForm" />

    <template v-else>
      <h1 class="page-title">{{ t("cars") }}</h1>
      <ul>
        <li
          v-for="car in cars"
          :key="car.id"
          class="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-6 gap-y-2 border-t border-line py-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto_auto]"
        >
          <CarPhoto :car="car" decorative sizes="(min-width: 640px) 144px, 96px" class="aspect-16/10 w-full rounded-xs" />
          <b class="text-lg break-words">{{ car.brand }} {{ car.model }}</b>
          <span class="col-start-2 sm:col-start-auto">{{ money(car.pricePerDay) }} {{ t("perDay") }}</span>
          <button type="button" class="btn btn-quiet col-start-2 justify-self-start sm:col-start-auto" :data-return="car.id" @click="selectedCar = car">
            {{ t("edit") }}
          </button>
        </li>
      </ul>
      <button type="button" class="btn mt-4" data-return="add" @click="adding = true">{{ t("addCar") }}</button>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AdminNav from "../components/AdminNav.vue";
import CarPhoto from "../components/CarPhoto.vue";
import EditForm from "../components/EditForm.vue";
import NewForm from "../components/NewForm.vue";
import { money, t } from "../i18n";
import type { Car } from "../types";

export default defineComponent({
  components: { AdminNav, CarPhoto, EditForm, NewForm },
  props: {
    cars: { type: Array as PropType<Car[]>, required: true },
  },
  data() {
    return {
      adding: false,
      selectedCar: null as Car | null,
    };
  },
  methods: {
    t,
    money,
    /* back to the list, with focus on the button that opened the form */
    closeForm() {
      const key = this.adding ? "add" : this.selectedCar?.id;
      this.adding = false;
      this.selectedCar = null;
      this.$nextTick(() => (this.$el as HTMLElement).querySelector<HTMLElement>(`[data-return="${key}"]`)?.focus());
    },
  },
});
</script>
