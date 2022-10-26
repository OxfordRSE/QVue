<script setup lang="ts">
import AnswerSet from "@/components/AnswerSet.vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";
import { computed } from "vue";
import type { Answer } from "questionnaire-core";

const questionnaireStore = useQuestionnaireStore();
const { questionnaire } = storeToRefs(questionnaireStore);

export interface Props {
  id: string;
  base: Answer | null;
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
const selected = computed(() => {
  try { return answer.value.options[answer.value.content] }
  catch (e) { return null }
})
</script>

<template>
  <div class="d-flex justify-content-between align-items-center">
    <label v-if="answer.label"
           :for="answer.id"
    >{{ answer.label }}</label>
    <select v-model="answer.content" :id="answer.id" class="form-select">
      <option
        v-for="(o, i) in answer.options"
        :key="o.content"
        :value="i"
        :id="`${answer.id}_${i}`"
      >
        {{ o.label }}
      </option>
    </select>
  </div>
  <AnswerSet
    v-if="selected && selected.extra_answers && selected.extra_answers.length"
    :base="selected.extra_answers"
  />
  <AnswerSet
    v-if="answer.extra_answers && answer.extra_answers.length"
    :base="answer.extra_answers"
  />
</template>

<style scoped lang="scss">
.answer-option {
  align-items: center;
  border: 2px solid transparent;
  input,
  label {
    cursor: pointer;
  }
  label {
    max-width: calc(100% - 3em);
  }
}
@media (hover: hover) {
  .answer-option:has(*:hover) {
    border-color: var(--bs-primary);
  }
}
</style>
