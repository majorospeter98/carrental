import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css'; 

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(Toast);
app.use(pinia);
app.use(router);
app.mount("#app");
