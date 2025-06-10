<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Autóbérlés</h1>

    <form @submit.prevent="searchAvailableCars" class="row g-3 mb-5">
      <div class="col-md-6">
        <label class="form-label">Dátumtól:</label>
        <input
          type="date"
          id="form-label"
          class="form-control"
          v-model="startDate"
          :min="today"
          required
        />
      </div>

      <div class="col-md-6">
        <label class="form-label">Dátumig:</label>
        <input
          type="date"
          id="form-label"
          class="form-control"
          v-model="endDate"
          required
          :min="startDate"
        />
      </div>

      <div class="col-12 text-center">
        <button type="submit" class="btn btn-light">Keresés</button>
      </div>
    </form>

    <div class="row" v-if="filteredCars.length > 0 && searched">
      <div class="col-md-4 mb-4" v-for="car in filteredCars" :key="car.id">
        <div class="card h-100">
          <img
            @click="openImage(car.id)"
            :src="car.image"
            class="card-img-top"
            style="cursor: pointer"
            alt="Car image"
          />
          <div class="card-body">
            <h5 class="card-title">{{ car.brand }} - {{ car.model }}</h5>
            <p class="card-text">
              Ár naponta: <strong>{{ car.pricePerDay }} Ft</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="searched" class="text-center mt-3 fs-1">
      <p>Nincs találat</p>
    </div>
  </div>
</template>

<script>
import { useCarStore } from "../stores/cars";
export default {
  data() {
    return {
      startDate: new Date().toISOString().substr(0, 10),
      endDate: null,
      today: new Date().toISOString().split("T")[0],
      filteredCars: [],
      searched: false,
    };
  },
  methods: {
    async searchAvailableCars() {
      const response = useCarStore();
      const cars = response.cars;
      const from = new Date(this.startDate);
      const to = new Date(this.endDate);
      this.filteredCars = cars.filter((car) => {
        if (!car.bookings || car.bookings.length === 0) return true;
        return car.bookings.every((booking) => {
          const bookingFrom = new Date(booking.from);
          const bookingTo = new Date(booking.to);
          return to < bookingFrom || from > bookingTo;
        });
      });
      this.searched = true;
    },

    openImage(id) {
      this.$router.push("/rents/" + id);
      useCarStore().startDate = this.startDate; // Saving the start + enddate, so I can use at Rents.vue
      useCarStore().endDate = this.endDate;
    },
  },
};
</script>
