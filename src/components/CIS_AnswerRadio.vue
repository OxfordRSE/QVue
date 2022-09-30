<script setup lang="ts">
import type { Answer } from "@/cis-r/types";

export interface Props {
  answers: Answer[];
}

const props = withDefaults(defineProps<Props>(), {});

defineEmits<{
  (e: "answer", ans: Answer): void;
}>();
</script>

<template>
  <div class="answer-option" v-for="a in props.answers" :key="a.value">
    <input
      class="form-check-input"
      type="radio"
      name="answer"
      :id="`answer_${a.value}`"
      @change="$emit('answer', a)"
    />
    <label :for="`answer_${a.value}`">{{ a.text }}</label>
  </div>
</template>

<style scoped lang="scss">
.answer-option {
  display: flex;
  align-items: center;
}
input {
  margin-right: 0.5em;
}
label {
  max-width: calc(100% - 1.5em);
}
</style>
