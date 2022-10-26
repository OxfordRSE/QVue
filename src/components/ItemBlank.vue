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
</script>

<template>
  <div class="d-flex flex-grow-1 justify-content-between align-items-center">
    <div class="pe-2">
      {{ answer.label }}
    </div>
    <div class="d-flex flex-wrap-sm align-items-center justify-content-end">
      <AnswerSet
        v-if="answer.extra_answers && answer.extra_answers.length"
        :base="answer.extra_answers"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
input, select {
  margin-left: 0.5em;
}
</style>
