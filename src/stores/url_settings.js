import { defineStore } from "pinia";
import { ref } from "vue";
export const useURLStore = defineStore("url-settings", () => {
    const fetch = ref(null);
    const content = ref(null);
    const display = ref(null);
    const questionnaires = ref(["cis-r"]);
    return { fetch, content, display, questionnaires };
});
