<script setup lang="ts">
import { ValidationIssueLevel } from "questionnaire-core";
import SettingsMenu from "@/components/SettingsMenu.vue";
import AnswerSet from "@/components/AnswerSet.vue";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";
// Code below goes in any file that needs to use the i18n library
import queryString from "query-string";
import { I18n } from "i18n-js";
import translations from "../i18n.json"; // adapt as necessary for src/i18n.json

const i18n = new I18n(translations);
const parsed = queryString.parse(location.search);
if (parsed?.locale) i18n.locale = String(parsed.locale).toLowerCase();
// End of i18n setup

const questionnaireStore = useQuestionnaireStore();
const { questionnaire } = storeToRefs(questionnaireStore);

export interface Props {
  next_button_label?: string;
  next_button_key?: string;
  disable_back_button?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disable_back_button: false,
  next_button_label: i18n.t("qvue_base-next"),
  next_button_key: "arrowright",
});

const item = computed(() => questionnaire.value.current_item);

const scroll = () => {
  const invalid = document?.querySelector(".is-invalid");
  if (invalid) invalid.scrollIntoView();
  else document?.querySelector("hr")?.scrollIntoView();
};

const next = () => {
  questionnaire.value.next_q();
  scroll();
};
const back = () => {
  questionnaire.value.last_q();
  scroll();
};

const answerChanged = () => {
  // @ts-ignore
  item.value?.check_validation(questionnaire.value, false);
};

</script>

<template>
  <div class="radio-form">
    <div class="question lead">
      <aside class="float-end">
        <SettingsMenu />
      </aside>
      <div v-html="item.question"></div>
    </div>
    <div v-if="item.own_validation_issues.length > 0" class="item-validation-issues">
      <div v-for="(issue, i) in item.own_validation_issues" :key="i">
        <p v-if="issue.level === ValidationIssueLevel.INFO" class="p-2 text-bg-info">{{issue.issue}}</p>
        <p v-if="issue.level === ValidationIssueLevel.WARNING" class="p-2 text-bg-warning">{{issue.issue}}</p>
        <p v-if="issue.level === ValidationIssueLevel.ERROR" class="p-2 text-bg-danger">{{issue.issue}}</p>
      </div>
    </div>
    <div class="answers flex-grow-1 my-4" v-if="item.answers.length">
      <AnswerSet @change="answerChanged"/>
    </div>
    <div class="buttons">
      <button
        class="btn btn-outline-secondary"
        @click="back"
        @keydown="
          (evt) => {
            if (evt.key === 'Enter' || evt.key === 'Space') back();
          }
        "
        :disabled="props.disable_back_button"
        data-click-on-key="arrowleft"
        data-nav-direction="back"
      >
        <kbd>&larr;</kbd>
        {{ i18n.t("qvue_base-back") }}
      </button>
      <button
        class="btn btn-primary flex-grow-1 ms-2"
        @click="next"
        @keydown="
          (evt) => {
            if (evt.key === 'Enter' || evt.key === 'Space') next();
          }
        "
        :disabled="
          item.validation_issues.filter(
            (e) => e.level === ValidationIssueLevel.ERROR
          ).length > 0
        "
        :data-click-on-key="props.next_button_key"
        data-nav-direction="next"
        v-html="props.next_button_label"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.radio-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.buttons {
  display: flex;
}
</style>
