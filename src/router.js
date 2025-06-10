import { createRouter, createWebHistory } from "vue-router";
import MainPage from "./Pages/MainPage.vue";
import Rents from "./Pages/Rents.vue";
import Dashboard from "./Pages/Dashboard.vue";
import Admin from "./Pages/Admin.vue";
import Cars from "./Pages/Cars.vue";
import NotFound from "./Pages/NotFound.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "", redirect: "/main" },
    { path: "/main", component: MainPage },
    {
      path: "/rents/:id",
      component: Rents,
      props: true,
    },
    {
      path: "/admin",
      component: Admin,
    },
    {
      path: "/admin/dashboard/cars",
      component: Cars,
    },
    { path: "/admin/dashboard", component: Dashboard },
    {
      path: "/:NotFound(.*)",
      component: NotFound,
    },
  ],
});
export default router;
