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
</script>

<template>
  <div class="answer-wrapper d-flex flex-grow-1" :class="answer.class_wrapper">
    <ItemLabel :id="props.id" :base="props.base" />
    <input
      class="form-control flex-grow-1"
      :id="props.id"
      name="answer"
      type="text"
      :placeholder="answer.placeholder"
      aria-label="Please type your answer"
      v-model="answer.content"
      autofocus
    />
  </div>
</template>

<style scoped lang="scss">
input.form-control {
  height: unset;
  align-self: end;
}
</style>
