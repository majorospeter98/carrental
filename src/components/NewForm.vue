<template>
  <form
    @submit.prevent="addNewCars"
    class="p-4 border rounded shadow-sm "
  >
    <h4 class="mb-3">Autó hozzáadása</h4>

    <div class="mb-3">
      <label for="brand" class="form-label">Márka</label>
      <input
        v-model="newBrand"
        type="text"
        id="brand"
        class="form-control"
        required
      />
    </div>

    <div class="mb-3">
      <label for="model" class="form-label">Modell</label>
      <input
        v-model="newModell"
        type="text"
        id="model"
        class="form-control"
        required
      />
    </div>

    <div class="mb-3">
      <label for="pricePerDay" class="form-label">Napi ár (Ft)</label>
      <input
        v-model.number="newPricePerDay"
        type="number"
        id="pricePerDay"
        class="form-control"
        required
        min="0"
      />
    </div>

 

    <h5 class="mt-4">Első foglalás (opcionális)</h5>

    <div class="row mb-3">
      <div class="col">
        <label class="form-label">Foglalás -tól</label>
        <input
          v-model="newBookingFrom"
          type="date"
          class="form-control"
          :min="today"
          required
        />
      </div>
      <div class="col">
        <label class="form-label">Foglalás -ig</label>
        <input
          v-model="newBookingTo"
          type="date"
          class="form-control" :min="newBookingFrom"
          required
        />
      </div>
    </div>

   <div class="d-flex justify-content-center mt-4">
  <button type="submit" class="btn btn-light">Mentés</button>
</div>
  </form>
</template>
<script>
export default {
  data() {
    return {
      newBrand: "",
      newModell: "",
      newPricePerDay: "",
          newBookingFrom:new Date().toISOString().substr(0, 10), 
            today: new Date().toISOString().split("T")[0],
      newBookingTo: null,
    };
  },
  methods: {
    addNewCars() {
      console.log("xd");
      const newCar = {
        id: Date.now(),
        brand: this.newBrand,
        model: this.newModell,
        pricePerDay: parseInt(this.newPricePerDay),
            bookings: [
          {
            from: this.newBookingFrom,
            to: this.newBookingTo,
          },
        ],
      };
      console.log(newCar);
      this.$emit("save", newCar);
    },
  },
};
</script>
