<template>
  <div class="container">
   <nav class="navbar navbar-light  px-3">
    <router-link to="/admin/dashboard/cars" class="text-white">Autók</router-link>
    <button @click="logOutAdmin" class="btn btn-light">Kijelentkezés</button>
  </nav>

    <h1 class="mb-5 mt-5 text-center">Foglalások:</h1>
    <ul class="list-group">
      <li
        v-for="(foglalas, index) in foglalasok"
        :key="index"
        class="list-group-item py-3 px-4"
      >
        <div class="d-flex justify-content-between flex-column flex-md-row">
                   <div class="mb-2 mb-md-0">
            <h5 class="mb-1">Név: {{ foglalas.name }}</h5>
            <div>Email: {{ foglalas.email }}</div>
            <div>Telefon: {{ foglalas.phone }}</div>
            <div class="mt-2">
              <span class="fw-semibold">Cím: </span> {{ foglalas.address }}
            </div>
            <div class="mt-1">
              <span class="fw-semibold">Napok száma:</span> {{ foglalas.days }}
            </div>
             <div class="mt-1">
              <span class="fw-semibold">Összeg:</span> {{ foglalas.price }} Ft 
            </div>
          </div>
        
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { useFoglalStore } from "../stores/rents";
export default {
  computed: {
    foglalasok() {
      return useFoglalStore().rents;
    },
  },
  created() {
    const store = useFoglalStore();
    console.log(store);
  },
  methods:{
logOutAdmin(){
  localStorage.removeItem("isAdmin");
  this.$router.push("/admin")
}
  },

  beforeRouteEnter(_to, _from, next) {
    if (!localStorage.getItem("isAdmin")) {  
       // Ha nincs iylen localstorage token nem léphet ide be //
            setTimeout(() => {
        alert("Nincs jogosultságod")
              next("/admin");
       
      },2000);
    } else {
      next();
    }
  },
};
</script>
