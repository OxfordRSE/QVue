import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ToolView from "../views/ToolView.vue";
const router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHistory(import.meta.env.VITE_APP_BASE_PATH),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/tool",
            name: "tool",
            component: ToolView,
        },
        {
            path: "/report",
            name: "report",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/ReportPreView.vue"),
        },
    ],
});
export default router;
