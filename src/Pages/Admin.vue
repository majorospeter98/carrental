<template>
  <div
    class="container d-flex justify-content-center align-items-center vh-100"
  >
    <div class="card p-4 shadow" style="width: 350px">
      <h4 class="mb-4 text-center">Admin bejelentkezés</h4>
      <form @submit.prevent="adminForm">
        <div class="mb-3">
          <label for="username" class="form-label">Felhasználónév</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="username"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Jelszó</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
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
      username: "",
      password: "",
    };
  },
  methods: {
    adminForm() {
      if (this.username === "admin" && this.password === "admin54321") {
        localStorage.setItem("isAdmin", true);
        this.$router.push("/admin/dashboard");
      } else {
        alert("Nem jók a jelszavak");
      }
    },
  },
};
</script>
