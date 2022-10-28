<script setup lang="ts">
import AnswerSet from "@/components/AnswerSet.vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";
import { computed } from "vue";
import type { Answer } from "questionnaire-core";

const questionnaireStore = useQuestionnaireStore();
const { questionnaire, inputs_dirty } = storeToRefs(questionnaireStore);

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
</script>

<template>
  <label
    v-if="answer.label || answer.extra_answers.length"
    :for="props.id"
    class="flex-grow-1 w-100 pe-2"
  >
    <div v-if="answer.label" v-html="answer.label"></div>
    <AnswerSet
      v-if="answer.extra_answers.length"
      :base="answer.extra_answers"
    />
  </label>
</template>

<style scoped lang="scss">
input.form-control {
  height: unset;
  align-self: end;
}
</style>
