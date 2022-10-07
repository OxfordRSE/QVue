import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";
import router from "./router";
import * as bootstrap from 'bootstrap'

import "./assets/scss/main.css";
import "./assets/scss/styles.scss";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
