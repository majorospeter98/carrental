<template>
  <div>
    <div class="container mt-4">
      <h2>Foglalási űrlap</h2>
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
          <input readonly
            type="number"
            id="days"
            class="form-control"
            v-model.number="maxDates"
            :min="maxDates"
                :max="maxDates"
            required
          />
        </div>

        <div class="col-md-3">
          <label for="totalPrice" class="form-label"
            >Foglalás teljes összege (Ft)</label
          >
          <input
            type="number"
            id="totalPrice"
            class="form-control"
            :value="sumPrice"
            disabled
          />
        </div>

        <div class="col-12 text-center mt-10">
          <button type="submit" class="btn btn-light">Foglalás</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useFoglalStore } from "../stores/rents";
import { useCarStore } from "../stores/cars";
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
  (1000 * 60 * 60 * 24)
) + 1;
    },
  },
  created() {
      const response = useCarStore();
        const cars = response.cars;
    this.selectedCar = cars.find((car) => car.id === parseInt(this.id));
  },
  methods: {
    submitForm() {
      const store = useFoglalStore();
      store.rents.push({
        name: this.name,
        email: this.email,
        address: this.address,
        phone: this.phone,
        days: this.maxDates,
        price: this.sumPrice,
      });
      (this.name = ""),
        (this.email = ""),
        (this.address = ""),
        (this.phone = ""),
             this.$router.replace("/main")
    },
  },
  beforeRouteEnter(to,_from,next){
  const response = useCarStore();
        const cars = response.cars;
   const car= cars.find((car) => car.id === parseInt(to.params.id));
   if(!car){
  alert("Nem létező autó ")
  next("/main")
   }
   else{
    next()
   }
}
  };
</script>
