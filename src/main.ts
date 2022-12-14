import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Datepicker from "@vuepic/vue-datepicker";
import { vue3Debounce } from "vue-debounce";
import * as bootstrap from "bootstrap";

import "@vuepic/vue-datepicker/dist/main.css";
import "./assets/scss/main.css";
import "./assets/scss/styles.scss";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.component("DatePicker", Datepicker);
app.directive("debounce", vue3Debounce({ lock: false }));

app.mount("#app");
