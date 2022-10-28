<script setup lang="ts">
import AnswerSet from "@/components/AnswerSet.vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";
import { computed, type Ref, ref } from "vue";
import type { Answer } from "questionnaire-core";
import ItemLabel from "@/components/ItemLabel.vue";

const questionnaireStore = useQuestionnaireStore();
const { questionnaire, inputs_dirty } = storeToRefs(questionnaireStore);

export interface Props {
  id: string;
  base?: Answer | null;
}

const props = withDefaults(defineProps<Props>(), {
  base: null,
});

const inputRefs: Ref<HTMLInputElement[]> = ref([]);

const answer = computed(() => {
  const base = props.base || questionnaire.value.current_item?.answers;
  if (typeof base === "undefined")
    throw `Cannot locate answer ${props.id} in undefined base.`;
  return base.find((a: Answer) => a.id === props.id);
});
const id = computed(() => props.id.replace(/\./, "_"));
const answer_content = computed(() => answer.value.content || []);

const updateAnswer: (index: number) => void = (i) => {
  if (answer.value.content instanceof Array)
    answer.value.content = answer.value.content.filter((n: number) => n !== i);
  else answer.value.content = [];

  const e = inputRefs.value[i].querySelector(`#${id.value}_${i}`);
  if (e instanceof HTMLInputElement && e.checked) answer.value.content.push(i);

  answer.value.check_validation(
    questionnaire.value.current_item,
    questionnaire.value,
    false
  );
};

answer.value.check_validation(
  questionnaire.value.current_item,
  questionnaire.value,
  false
);
</script>

<template>
  <div class="answer-wrapper d-flex flex-column" :class="answer.class_wrapper">
    <ItemLabel :id="props.id" :base="props.base" />
    <div
      class="answer-option d-flex p-1 my-2"
      v-for="(o, i) in answer.options"
      :key="o.content"
      ref="inputRefs"
    >
      <kbd v-if="/^\d$/.test(o.content.toString())" class="me-2">{{
        o.content
      }}</kbd>
      <input
        class="form-check-input me-1"
        type="checkbox"
        name="answer"
        :id="`${id}_${i}`"
        :value="i"
        @change="updateAnswer(i)"
        :checked="answer_content.includes(i)"
        :data-click-on-key="o.content"
      />
      <label class="flex-grow-1" :for="`${id}_${i}`">
        {{ o.label }}
        <AnswerSet v-if="o.extra_answers.length" :base="o.extra_answers" />
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
