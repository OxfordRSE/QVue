<script setup lang="ts">
import { ValidationIssueLevel } from "questionnaire-core";
import SettingsMenu from "@/components/SettingsMenu.vue";
import AnswerSet from "@/components/AnswerSet.vue";
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";

const questionnaireStore = useQuestionnaireStore();
const { questionnaire } = storeToRefs(questionnaireStore);

export interface Props {
  next_button_label?: string;
  next_button_key?: string;
  disable_back_button?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disable_back_button: false,
  next_button_label: "Next <kbd>&rarr;</kbd>",
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
//
// onMounted(() => {
//   setInterval(() => {
//     // @ts-ignore
//     console.log(`Check item ${item.value.id}`)
//     // @ts-ignore
//     item.value.check_validation(questionnaire.value);
//   }, 5000);
// });

</script>

<template>
  <div class="radio-form">
    <div class="question lead">
      <aside class="float-end">
        <SettingsMenu />
      </aside>
      <div v-html="item.question"></div>
    </div>
    <div class="answers flex-grow-1 my-4" v-if="item.answers.length">
      <AnswerSet />
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
        <kbd>&larr;</kbd> Back
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
