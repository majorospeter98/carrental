import { defineStore } from "pinia";
const baseUrl = import.meta.env.BASE_URL;

export const useCarStore = defineStore("cars", {
  state: () => ({
    cars: [
      {
        id: 1,
        brand: "Volkswagen",
        model: "Golf",
        pricePerDay: 12000,
        image: baseUrl + "images/golf.jpg",

        bookings: [{ from: "2025-06-13", to: "2025-06-16" }],
      },
      {
        id: 2,
        brand: "Toyota",
        model: "Corolla",
        pricePerDay: 11000,
        image: baseUrl + "images/toyota.jpg",

        bookings: [{ from: "2025-06-18", to: "2025-06-23" }],
      },
      {
        id: 3,
        brand: "BMW",
        model: "3 Series",
        pricePerDay: 20000,
        image: baseUrl + "images/bmw.jpg",

        bookings: [{ from: "2025-06-22", to: "2025-06-27" }],
      },
    ],
    startDate: null,
    endDate: null,
  }),
  persist: true,
});
