<script setup lang="ts">
import AnswerInput from "@/components/AnswerInput.vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";
import { computed } from "vue";
import type { Answer } from "questionnaire-core";

const questionnaireStore = useQuestionnaireStore();
const { questionnaire } = storeToRefs(questionnaireStore);

export interface Props {
  base: Answer | null;
}

const props = withDefaults(defineProps<Props>(), {
  base: null,
});

const answers = computed(() =>
  props.base ? props.base : questionnaire.value.current_item?.answers
);
</script>

<template>
  <div
    class="answer-set"
    :class="props.base === null ? 'root' : ''"
    v-for="a in answers"
    :key="a.id"
  >
    <AnswerInput :id="a.id" :base="props.base" />
  </div>
</template>

<style lang="scss" scoped>
.answer-set.root:not(:last-child) {
  padding-bottom: 1em;
}
</style>
