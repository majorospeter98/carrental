import { defineStore } from "pinia";

export const useFoglalStore = defineStore('rents', {
    state: () => ({
        rents: []
       
    }),
    persist: true
})

