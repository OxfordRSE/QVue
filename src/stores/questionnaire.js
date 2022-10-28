import { defineStore } from "pinia";
export const useQuestionnaireStore = defineStore("questionnaire", {
    state: () => ({
        questionnaire: {},
        inputs_dirty: false,
    }),
});
