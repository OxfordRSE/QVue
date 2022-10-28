<script setup lang="ts">
import ItemLabel from "@/components/ItemLabel.vue";
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

answer.value.check_validation(
  questionnaire.value.current_item,
  questionnaire.value,
  false
);
</script>

<template>
  <div class="answer-wrapper d-flex" :class="answer.class_wrapper">
    <ItemLabel :id="props.id" :base="props.base" />
    <div class="input-group">
      <span
        v-if="answer.label_left"
        v-html="answer.label_left"
        class="input-group-text"
      />
      <input
        class="form-control flex-shrink-1"
        :id="props.id"
        name="answer"
        type="number"
        aria-label="Please type your answer"
        v-model="answer.content"
        v-debounce:50ms="
          () => {
            if (questionnaire)
              answer.check_validation(
                questionnaire.current_item,
                questionnaire,
                false
              );
          }
        "
        debounce-events="keydown"
        @change="
          answer.check_validation(
            questionnaire.current_item,
            questionnaire,
            false
          )
        "
        autofocus
      />
      <span
        v-if="answer.label_right"
        v-html="answer.label_right"
        class="input-group-text"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
input.form-control,
span.input-group-text {
  height: unset;
  align-self: end;
}
</style>
