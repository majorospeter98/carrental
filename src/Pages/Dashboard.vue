<template>
  <div class="container">
    <nav class="navbar navbar-light px-3">
      <router-link to="/admin/dashboard/cars" class="text-white"
        >Autók</router-link
      >
      <button @click="logOutAdmin" class="btn btn-light">Kijelentkezés</button>
    </nav>
    <h1 class="mb-5 mt-5 text-center">Foglalások:</h1>
    <div v-if="rents.length > 0">
      <ul class="list-unstyled container mb-5">
        <li
          v-for="(rents, index) in rents"
          :key="index"
          class="card mb-4 shadow-sm"
        >
          <div class="card-body">
            <h5 class="card-title">Név: {{ rents.name }}</h5>
            <p class="card-text mb-1">
              <strong>Email:</strong> {{ rents.email }}
            </p>
            <p class="card-text mb-1">
              <strong>Telefon:</strong> {{ rents.phone }}
            </p>
            <p class="card-text mb-1">
              <strong>Cím:</strong> {{ rents.address }}
            </p>
            <p class="card-text mb-1">
              <strong>Napok száma:</strong> {{ rents.days }}
            </p>
            <p class="card-text mb-0">
              <strong>Összeg:</strong> {{ rents.price }} Ft
            </p>
          </div>
        </li>
      </ul>
    </div>
    <h1 class="text-center" v-else>Nincsenek foglalások.</h1>
  </div>
</template>

<script>
import { useRentsStore } from "../stores/rents";
export default {
  computed: {
    rents() {
      return useRentsStore().rents;
    },
  },

  methods: {
    logOutAdmin() {
      localStorage.removeItem("isAdmin");
      this.$router.push("/admin");
    },
  },

  beforeRouteEnter(_to, _from, next) {
    if (!localStorage.getItem("isAdmin")) {
      // if no token redicrect
      setTimeout(() => {
        alert("Nincs jogosultságod");
        next("/admin");
      }, 2000);
    } else {
      next();
    }
  },
};
</script>
