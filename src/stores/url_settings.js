import { defineStore } from "pinia";
import { ref } from "vue";
export const useURLStore = defineStore("url-settings", () => {
    const fetch = ref(null);
    const content = ref({});
    const display = ref({});
    return { fetch, content, display };
});
