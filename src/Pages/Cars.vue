<template>
  <div>
    <ul class="list-group">
      <li v-for="car in cars" :key="car.id" class="list-group-item mt-2 mb-2">
        <h1>{{ car.brand }}</h1>
        <h2>{{car.model}}</h2>
        <img v-if="car.image"
          :src="car.image"
          alt="autó kép"
          class="img-fluid mb-2"
          style=""
        />
        <h2>{{car.pricePerDay}} Ft</h2>
        <ul class="list-group mt-2">
          <li
            v-for="(booking, index) in car.bookings"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
          
            <div>
              <strong>Foglalás:</strong> {{ booking.from }} – {{ booking.to }}
            </div>
           <button class="btn btn-light btn-sm" @click="editCar(car)">
  Szerkesztés
</button>
          </li>
        </ul>
      </li>
      <li class="list-group-item text-center">
        <button class="btn btn-sm btn-light" @click="openForm">
          + Autó hozzáadása
        </button>
      </li>
    </ul>
    <new-form
      class="mt-6 mb-5"
      v-if="addFormIsActive"
      @save="addNewCar"
    ></new-form>
    <edit-form
      v-if="editFromIsActive"
      :car="selectedCar"
      @edit="editForm"
      @close="this.editFromIsActive=false"
    ></edit-form>
  </div>
</template>

<script>
import { useCarStore } from "../stores/cars";
import NewForm from "../components/NewForm.vue";
import EditForm from "../components/EditForm.vue";
export default {
  components: {
    NewForm: NewForm,
    EditForm: EditForm
  },
  data() {
    return {
      selectedCar: [],
      cars: [],
      addFormIsActive: false,
      editFromIsActive: false,
    };
  },
  created() {
    const store = useCarStore();
    this.cars = store.cars;
  },
  methods: {
    addNewCar(cars) {
      console.log(cars);
      this.cars.push(cars);
      this.addFormIsActive = false;
    },
    openForm() {
      this.addFormIsActive = true;
    },
    editCar(car) {
      this.selectedCar = { ...car };
      this.editFromIsActive = true;
      console.log(this.selectedCar);
    },
    editForm(car) {
      const store = useCarStore();
      console.log(car.id);
      const selectedCarId = this.cars.findIndex((c) => c.id === car.id);
      console.log(selectedCarId);
      store.cars[selectedCarId] = car;
     this.editFromIsActive=false;
    },
  },
  beforeRouteEnter(_to, _from, next) {
    if (!localStorage.getItem("isAdmin")) {
      setTimeout(() => {
        // Ha nincs iylen localstorage token nem léphet ide be //
        alert("Nincs jogosultságod");
        next("/admin");
      }, 2000);
    } else {
      next();
    }
  },
};
</script>
