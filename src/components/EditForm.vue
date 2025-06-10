<template>
  <div>
    <div
      class="modal fade show d-block text-black"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Autó szerkesztése</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="editCars" class="needs-validation">
              <div class="mb-3">
                <label for="brand" class="form-label">Márka</label>
                <input
                  v-model="formCar.brand"
                  type="text"
                  id="brand"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="model" class="form-label">Modell</label>
                <input
                  v-model="formCar.model"
                  type="text"
                  id="model"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="pricePerDay" class="form-label">Napi ár (Ft)</label>
                <input
                  v-model.number="formCar.pricePerDay"
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
  </div>
</template>

<script>
export default {
  props: ["car"],
  data() {
    return {
      formCar: { ...this.car },
      today: new Date().toISOString().split("T")[0],
    };
  },
  watch: {
    car(newVal) {
      this.formCar = { ...newVal };
    },
  },
  methods: {
    editCars() {
      this.$emit("edit", this.formCar);
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
