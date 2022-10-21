<script setup lang="ts">
import { watch } from "vue";
import type { Answer } from "@/questionnaire";

export interface Props {
  answers: Answer[];
  answer: Answer | undefined;
}

const props = withDefaults(defineProps<Props>(), {});

defineEmits<{
  (e: "answer", ans: Answer): void;
}>();

watch(
  () => props.answers,
  () => {
    // Do something with the updated value.
    window.document
      .querySelectorAll('div.answer-option > input[type="radio"]')
      .forEach((e: any) => {
        e.checked = false;
      });
    // @ts-ignore
    window.document.activeElement?.blur();
  }
);
</script>

<template>
  <div
    class="answer-option d-flex p-1 my-2"
    v-for="a in props.answers"
    :key="a.value"
    ref="inputs"
  >
    <kbd v-if="/^\d$/.test(a.value.toString())" class="me-2">{{ a.value }}</kbd>
    <input
      class="form-check-input me-1"
      type="radio"
      name="answer"
      :id="`answer_${a.value}`"
      @change="$emit('answer', a)"
      :checked="a.value === props.answer?.value"
      :data-click-on-key="a.value"
    />
    <label class="flex-grow-1" :for="`answer_${a.value}`">{{ a.text }}</label>
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
