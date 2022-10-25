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
  <div v-for="a in answers" :key="a.id">
    <AnswerInput :id="a.id" :base="props.base" />
  </div>
</template>

<style lang="scss" scoped>
div:not(:last-child) {
  padding-bottom: 0.5em;
}
</style>
