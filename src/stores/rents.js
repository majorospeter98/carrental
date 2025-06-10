import { defineStore } from "pinia";

export const useRentsStore = defineStore("rents", {
  state: () => ({
    rents: [],
  }),
  persist: true,
});
