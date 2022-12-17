<script setup lang="ts">
import ItemLabel from "@/components/ItemLabel.vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";
import { computed } from "vue";
import type { Answer } from "questionnaire-core";

const questionnaireStore = useQuestionnaireStore();
const { questionnaire } = storeToRefs(questionnaireStore);

export interface Props {
  id: string;
  base?: Answer | null;
}

const props = withDefaults(defineProps<Props>(), {
  base: null,
});

const answer = computed(() => {
  const base = props.base || questionnaire.value.current_item?.answers;
  if (typeof base === "undefined")
    throw `Cannot locate answer ${props.id} in undefined base.`;
  return base.find((a: Answer) => a.id === props.id);
});

// answer.value.check_validation(
//   questionnaire.value.current_item,
//   questionnaire.value,
//   false
// );
</script>

<template>
  <div class="answer-wrapper d-flex flex-grow-1" :class="answer.class_wrapper">
    <ItemLabel :id="props.id" :base="props.base" />
    <div>
      <input
        class="form-control flex-grow-1"
        :class="answer.own_validation_issues.length ? 'is-invalid' : ''"
        :id="props.id"
        :name="`${props.id}_answer`"
        type="text"
        :placeholder="answer.placeholder"
        aria-label="Please type your answer"
        v-model="answer.content"
        v-debounce:50ms="
          () => {
            if (questionnaire)
              answer.check_validation(
                questionnaire.current_item,
                questionnaire,
                false
              );
          }
        "
        debounce-events="keydown"
        @change="
          answer.check_validation(
            questionnaire.current_item,
            questionnaire,
            false
          )
        "
        autofocus
      />
      <div
        class="invalid-feedback"
        :class="
          issue.level === 0
            ? 'txt-info'
            : issue.level === 1
            ? 'txt-warning'
            : ''
        "
        v-for="(issue, index) in answer.own_validation_issues"
        :key="index"
        v-html="issue.issue"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
input.form-control {
  height: unset;
  align-self: end;
}
</style>
