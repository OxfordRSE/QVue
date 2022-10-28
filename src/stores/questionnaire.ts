import { defineStore } from "pinia";
import type { Questionnaire } from "questionnaire-core";

export const useQuestionnaireStore = defineStore("questionnaire", {
  state: () => ({
    questionnaire: <Questionnaire>{},
    inputs_dirty: false,
  }),
});
