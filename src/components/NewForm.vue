 <template>
  <div
      class="modal fade show d-block text-black"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered vh-105">
        <div class="modal-content">
          <div class="modal-header">
          <h5 class="modal-title">Autó hozzáadása</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="addNewCars" class="needs-validation">
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
              <label for="modell" class="form-label">Modell</label>
              <input
                v-model="newModell"
                type="text"
                id="modell"
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
                min=1000
                max=50000
              />
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                Mégse
              </button>
              <button type="submit" class="btn btn-primary">Mentés</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


     
<script>
export default {
  data() {
    return {
      newBrand: "",
      newModell: "",
      newPricePerDay: "",
    };
  },
  methods: {
    addNewCars() {
            const newCar = {
        id: Date.now(),
        brand: this.newBrand,
        model: this.newModell,
        pricePerDay: parseInt(this.newPricePerDay),
        image: "/images/default.jpg",  // adding default image here for every new car
      };
      this.$emit("save", newCar);
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
