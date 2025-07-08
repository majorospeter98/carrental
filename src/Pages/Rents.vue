<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container p-5 bg-light text-black rounded shadow-sm">
      <h2 class="mb-4 text-center">Foglalási űrlap</h2>
      <h2 class="mb-4 text-center">Választott: {{selectedCar.brand}} {{selectedCar.model}}</h2>
      <form @submit.prevent="submitForm" class="row g-3">
        <div class="col-md-6">
          <label for="name" class="form-label">Név</label>
          <input
            type="text"
            id="name"
            class="form-control"
            v-model="name"
            required
            placeholder="Teljes név"
          />
        </div>

        <div class="col-md-6">
          <label for="email" class="form-label">Email cím</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            required
            placeholder="email@random.hu"
          />
        </div>

        <div class="col-12">
          <label for="address" class="form-label">Cím</label>
          <input
            type="text"
            id="address"
            class="form-control"
            v-model="address"
            required
            placeholder="Lakcím"
          />
        </div>

        <div class="col-md-6">
          <label for="phone" class="form-label">Telefonszám</label>
          <input
            type="tel"
            pattern="[0-9]*"
            id="phone"
            class="form-control"
            v-model="phone"
            required
            placeholder="36 30 123 4567"
          />
        </div>

        <div class="col-md-3">
          <label for="days" class="form-label">Foglalandó napok száma</label>
          <input
            type="number"
            id="days"
            class="form-control"
            v-model.number="maxDates"
            disabled
          />
        </div>

        <div class="col-md-3">
          <label for="totalPrice" class="form-label">Teljes ár (Ft)</label>
          <input
            type="number"
            id="totalPrice"
            class="form-control"
            :value="sumPrice"
            disabled
          />
        </div>

        <div class="col-12 text-center mt-5">
          <button type="submit" class="btn btn-primary px-5">Foglalás</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { useRentsStore } from "../stores/rents";
import { useCarStore } from "../stores/cars";
 import { useToast } from "vue-toastification";
export default {
  props: ["id"],
  data() {
    return {
      selectedCar: null,
      name: "",
      email: "",
      address: "",
      phone: "",
    };
  },
  computed: {
    sumPrice() {
      return this.selectedCar.pricePerDay * this.maxDates;
    },
    maxDates() {
      return (
        (new Date(useCarStore().endDate) - new Date(useCarStore().startDate)) /
          (1000 * 60 * 60 * 24) +1
      );
    },
  },
  created() {
    const response = useCarStore();

   
    const cars = response.cars;
    this.selectedCar = cars.find((car) => car.id === parseInt(this.id));
   
  },
  methods: {
    submitForm() {
      const store = useRentsStore();
  const toast = useToast(); // itt példányosítod
    toast.success('Sikeres foglalás',{timeout:1200});
      store.rents.push({
        name: this.name,    //pushing into rents.js pinia
        email: this.email,
        address: this.address,
        phone: this.phone,
        days: this.maxDates,
        price: this.sumPrice,
      });
      const newBooking = {
        from: useCarStore().startDate,   // extract data from cars pinia store
        to: useCarStore().endDate,
      };
      const carIndex = useCarStore().cars.findIndex(
        (car) => car.id === this.selectedCar.id
      );

      (useCarStore().cars[carIndex].bookings ??= []).push(newBooking);

      (this.name = ""),
        (this.email = ""),
        (this.address = ""),
        (this.phone = ""),
        this.$router.replace("/main");
    },
  },
  beforeRouteEnter(to, _from, next) {
    const response = useCarStore();
    const cars = response.cars;
    const car = cars.find((car) => car.id === parseInt(to.params.id));  // id check, the page only open with existing id, if not redirect
    if (!car) {
      alert("Nem létező autó ");
      next("/main");
    } else {
      next();
    }
  },
};
</script>
