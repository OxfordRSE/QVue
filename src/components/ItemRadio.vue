<script setup lang="ts">
import AnswerSet from "@/components/AnswerSet.vue";
import ItemLabel from "@/components/ItemLabel.vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";
import { useSettingsStore } from "@/stores/settings";
const settings = useSettingsStore();
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

// answer.value.check_validation(
//   questionnaire.value.current_item,
//   questionnaire.value,
//   false
// );
</script>

<template>
  <div class="answer-wrapper d-flex flex-column" :class="answer.class_wrapper">
    <ItemLabel :id="props.id" :base="props.base" />
    <div
      class="answer-option d-flex p-1 my-2"
      :class="answer.own_validation_issues.length ? 'is-invalid' : ''"
      v-for="(o, i) in answer.options"
      :key="o.content"
      ref="inputs"
    >
      <kbd
        v-if="/^\d$/.test(o.content.toString()) && settings.keyboard_shortcuts"
        class="me-2"
        >{{ o.content }}</kbd
      >
      <input
        class="form-check-input me-1"
        :class="answer.own_validation_issues.length ? 'is-invalid' : ''"
        type="radio"
        :name="`${answer.id}_answer`"
        :id="`${answer.id}_${i}`"
        :value="i"
        @change="
          answer.content = i;
          answer.check_validation(
            questionnaire.current_item,
            questionnaire,
            false
          );
        "
        :checked="answer?.content === i"
        :data-click-on-key="o.content"
      />
      <label class="flex-grow-1 form-check-label" :for="`${answer.id}_${i}`">
        {{ o.label || o.content }}
        <AnswerSet
          v-if="answer.selected_option === o && o.extra_answers.length"
          :base="o.extra_answers"
        />
      </label>
    </div>
    <div
      v-if="answer.own_validation_issues.length"
      class="invalid-feedback"
      :class="
        Math.max(...answer.own_validation_issues.map((i) => i.level)) === 0
          ? 'txt-info'
          : Math.max(...answer.own_validation_issues.map((i) => i.level)) === 1
          ? 'txt-warning'
          : ''
      "
      v-html="answer.own_validation_issues.map((i) => i.issue).join('<br/>')"
    ></div>
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
