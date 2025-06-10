<template>
  <div>
    <div class="p-3 text-center">
      <router-link to="/admin/dashboard" class="btn btn-light"
        >Vissza</router-link
      >
    </div>
    <h1 class="mb-5 mt-5 text-center">Autók:</h1>
    <ul
      class="list-group bg-white text-center mx-auto mt-5 mb-5"
      style="max-width: 600px"
    >
      <li
        v-for="car in cars"
        :key="car.id"
        class="list-group-item text-black mt-3 mb-3 d-flex flex-column align-items-center my-4 border-0"
      >
        <h1>{{ car.brand }}</h1>
        <h2>{{ car.model }}</h2>
        <img
          v-if="car.image"
          :src="car.image"
          alt="autó kép"
          class="img-fluid mb-3"
          style="max-width: 250px; border-radius: 8px"
        />
        <h3>{{ car.pricePerDay }} Ft / nap</h3>

        <button class="btn btn-sm btn-outline-primary" @click="editCar(car)">
          Szerkesztés
        </button>
      </li>

      <li class="list-group-item text-center">
        <button class="btn btn-sm btn-primary" @click="openForm">
          + Autó hozzáadása
        </button>
      </li>
    </ul>

    <edit-form
      v-if="editFromIsActive"
      :car="selectedCar"
      @edit="editForm"
      @close="editFromIsActive = false"
    ></edit-form>
    <new-form
      v-if="addFormIsActive"
      @save="addNewCar"
      @close="addFormIsActive = false"
    ></new-form>
  </div>
</template>

<script>
import { useCarStore } from "../stores/cars";
import NewForm from "../components/NewForm.vue";
import EditForm from "../components/EditForm.vue";
export default {
  components: {
    NewForm: NewForm,
    EditForm: EditForm,
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
      this.cars.push(cars);
      this.addFormIsActive = false;
    },
    openForm() {
      this.addFormIsActive = true;
    },
    editCar(car) {
      this.selectedCar = { ...car };
      this.editFromIsActive = true;
    },
    editForm(car) {
      const store = useCarStore();
      const selectedCarId = this.cars.findIndex((c) => c.id === car.id);
      store.cars[selectedCarId] = car;
      this.editFromIsActive = false;
    },
  },
  beforeRouteEnter(_to, _from, next) {
    if (!localStorage.getItem("isAdmin")) {
      setTimeout(() => {
        // If nok token redirect for admin login //
        alert("Nincs jogosultságod");
        next("/admin");
      }, 2000);
    } else {
      next();
    }
  },
};
</script>
