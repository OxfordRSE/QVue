import { defineStore } from "pinia";
import type { Questionnaire } from "questionnaire-core";

export const useQuestionnaireStore = defineStore("questionnaire", {
  state: () => ({
    questionnaire: <Questionnaire>{
      name: "Loading...",
      introduction: "Please wait.",
    },
  }),
});
