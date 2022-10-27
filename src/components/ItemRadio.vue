<script setup lang="ts">
import AnswerSet from "@/components/AnswerSet.vue";
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
  <div class="answer-wrapper d-flex flex-column" :class="answer.class_wrapper">
    <ItemLabel :id="props.id" :base="props.base" />
    <div
      class="answer-option d-flex p-1 my-2"
      v-for="(o, i) in answer.options"
      :key="o.content"
      ref="inputs"
    >
      <kbd v-if="/^\d$/.test(o.content.toString())" class="me-2">{{
          o.content
        }}</kbd>
      <input
        class="form-check-input me-1"
        type="radio"
        name="answer"
        :id="`${answer.id}_${i}`"
        :value="i"
        @change="answer.content = i"
        :checked="answer?.content === i"
        :data-click-on-key="o.content"
      />
      <label class="flex-grow-1" :for="`${answer.id}_${i}`">
        {{ o.label || o.content }}
        <AnswerSet
          v-if="o.extra_answers && o.extra_answers.length"
          :base="o.extra_answers"
        />
      </label>
    </div>
  </div>
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
