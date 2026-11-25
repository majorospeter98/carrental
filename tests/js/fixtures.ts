import type { Car, Rent } from "../../resources/js/types";
import { addDays, today } from "../../resources/js/utils/booking";

const booked = (a: number, z: number) => ({ from: addDays(today(), a), to: addDays(today(), z) });

export const cars = (): Car[] => [
  { id: 1, brand: "Volkswagen", model: "Golf", pricePerDay: 12000, image: "/images/golf.jpg", bookings: [booked(10, 13)] },
  { id: 2, brand: "Toyota", model: "Corolla", pricePerDay: 11000, image: "/images/toyota.jpg", bookings: [booked(2, 5), booked(11, 16)] },
  { id: 3, brand: "BMW", model: "3 Series", pricePerDay: 20000, image: "/images/bmw.jpg", bookings: [booked(12, 18)] },
];

export const rents = (): Rent[] => [
  { id: 1, name: "Minta Anna", email: "demo@example.com", phone: "36301234567", address: "Minta utca 1.", car: "Toyota Corolla", ...booked(2, 5), days: 4, price: 44000, demo: true },
];
