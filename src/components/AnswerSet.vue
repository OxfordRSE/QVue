<script setup lang="ts">
import AnswerInput from "@/components/AnswerInput.vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";
import { computed } from "vue";
import type { Answer } from "questionnaire-core";

const questionnaireStore = useQuestionnaireStore();
const { questionnaire } = storeToRefs(questionnaireStore);

export interface Props {
  base?: Answer | null;
}

const props = withDefaults(defineProps<Props>(), {
  base: null,
});

const answers = computed(() =>
  props.base ? props.base : questionnaire.value.current_item?.answers
);
</script>

<template>
  <div class="d-flex" :class="props.base === null ? 'flex-column' : ''">
    <div
      class="answer-set flex-grow-1 align-items-center"
      :class="props.base === null ? 'root' : ''"
      v-for="a in answers"
      :key="a.id"
    >
      <AnswerInput :id="a.id" :base="props.base" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.answer-set.root:not(:last-child) {
  padding-bottom: 1em;
}
</style>
