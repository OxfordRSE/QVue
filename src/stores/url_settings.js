import { defineStore } from "pinia";
import { ref } from "vue";
export const useURLStore = defineStore("url-settings", () => {
    const fetch = ref(null);
    const content = ref({});
    const display = ref({ banner_html: "<h1>CIS-R</h1>" });
    return { fetch, content, display };
});
