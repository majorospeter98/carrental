<template>
  <div
    class="container d-flex justify-content-center align-items-center vh-100"
  >
    <div class="card p-4 shadow" style="width: 350px">
      <h4 class="mb-4 text-center">Admin bejelentkezés</h4>
      <form @submit.prevent="adminForm">
        <div class="mb-3">
          <label for="felhasznalonev" class="form-label">Felhasználónév</label>
          <input
            type="text"
            class="form-control"
            id="felhasznalonev"
            v-model="felhasznalonev"
            required
          />
        </div>
        <div class="mb-3">
          <label for="jelszo" class="form-label">Jelszó</label>
          <input
            type="password"
            class="form-control"
            id="jelszo"
            v-model="jelszo"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">
          Bejelentkezés
        </button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      felhasznalonev: "",
      jelszo: "",
    };
  },
  methods: {
    adminForm() {
      if (this.felhasznalonev === "admin" && this.jelszo === "admin54321") {
        localStorage.setItem("isAdmin", true);
        this.$router.push("/admin/dashboard");
      } else {
        alert("Nem jók a jelszavak");
      }
    },
  },
};
</script>
