<template>
  <div class="page">
    <AdminNav />

    <!-- always there, so a message added to it is announced. Sticky: focus goes back to
         the button that opened the form, which may be far down the list -->
    <div class="sticky top-2 z-10" role="status">
      <p v-if="savedName" class="notice mb-6 wrap-anywhere">{{ t("saved") }}: {{ savedName }}</p>
      <p v-if="deletedName" class="notice mb-6 wrap-anywhere">{{ t("deleted") }}: {{ deletedName }}</p>
    </div>

    <NewForm v-if="adding" @saved="onSaved" @close="closeForm" />
    <EditForm v-else-if="selectedCar" :car="selectedCar" @saved="onSaved" @close="closeForm" />

    <template v-else>
      <h1 ref="title" class="page-title" tabindex="-1">{{ t("cars") }}</h1>
      <ul>
        <li
          v-for="car in cars"
          :key="car.id"
          class="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-6 gap-y-2 border-t border-line py-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto_auto]"
        >
          <CarPhoto :car="car" decorative loading="lazy" sizes="(min-width: 640px) 144px, 96px" class="aspect-16/10 w-full rounded-xs" />
          <b class="text-lg break-words">{{ car.brand }} {{ car.model }}</b>
          <span class="col-start-2 sm:col-start-auto">{{ money(car.pricePerDay) }} {{ t("perDay") }}</span>
          <div class="col-start-2 flex flex-wrap gap-3 sm:col-start-auto">
            <button type="button" class="btn btn-quiet" :data-return="car.id" :aria-label="`${t('edit')}: ${car.brand} ${car.model}`" @click="open(car)">
              {{ t("edit") }}
            </button>
            <button v-if="car.deletable" type="button" class="btn btn-quiet" :data-delete="car.id" :aria-label="`${t('delete')}: ${car.brand} ${car.model}`" @click="ask(car)">
              {{ t("delete") }}
            </button>
          </div>
          <ConfirmBox v-if="confirmingId === car.id" class="col-span-full" :question="t('deleteCarConfirm')" :busy="deleting" @yes="remove(car)" @no="keep" />
        </li>
      </ul>
      <button type="button" class="btn mt-4" data-return="add" @click="open(null)">{{ t("addCar") }}</button>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { router } from "@inertiajs/vue3";
import AdminNav from "../components/AdminNav.vue";
import CarPhoto from "../components/CarPhoto.vue";
import ConfirmBox from "../components/ConfirmBox.vue";
import EditForm from "../components/EditForm.vue";
import NewForm from "../components/NewForm.vue";
import { money, t } from "../i18n";
import type { Car } from "../types";

export default defineComponent({
  components: { AdminNav, CarPhoto, ConfirmBox, EditForm, NewForm },
  props: {
    cars: { type: Array as PropType<Car[]>, required: true },
  },
  data() {
    return {
      adding: false,
      selectedCar: null as Car | null,
      savedName: "",
      deletedName: "",
      confirmingId: null as number | null,
      deleting: false,
    };
  },
  methods: {
    t,
    money,
    /* null opens the empty form */
    open(car: Car | null) {
      this.savedName = "";
      this.deletedName = "";
      this.confirmingId = null;
      this.selectedCar = car;
      this.adding = !car;
    },
    ask(car: Car) {
      this.savedName = "";
      this.deletedName = "";
      this.confirmingId = car.id;
    },
    keep() {
      const id = this.confirmingId;
      this.confirmingId = null;
      this.$nextTick(() => (this.$el as HTMLElement).querySelector<HTMLElement>(`[data-delete="${id}"]`)?.focus());
    },
    remove(car: Car) {
      const name = `${car.brand} ${car.model}`;
      this.deleting = true;
      router.delete(`/admin/dashboard/cars/${car.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          this.confirmingId = null;
          this.deletedName = name;
          this.$nextTick(() => (this.$refs.title as HTMLElement).focus());
        },
        onFinish: () => (this.deleting = false),
      });
    },
    onSaved(name: string) {
      this.savedName = name;
      this.closeForm();
    },
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
