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
  <div class="d-flex">
    <label v-if="answer.label" :for="props.id" class="flex-grow-1 w-100 pe-2">
      {{ answer.label }}
      <AnswerSet
        v-if="answer.extra_answers && answer.extra_answers.length"
        :base="answer.extra_answers"
      />
    </label>
    <input
      class="form-control flex-shrink-1"
      :id="props.id"
      name="answer"
      type="number"
      aria-label="Please type your answer"
      v-model="answer.content"
      autofocus
    />
  </div>
</template>

<style scoped lang="scss">
input.form-control {
  width: 4em;
  height: unset;
  align-self: end;
}
</style>
