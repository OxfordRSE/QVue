<script setup lang="ts">
import type { Answer } from "@/cis-r";
import { computed } from "vue";

export interface Props {
  answer: Answer | undefined;
}
const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: "answer", ans: Answer): void;
}>();

const _value = computed({
  get: () => props.answer?.value,
  // @ts-ignore
  set: (val) => emit("answer", { value: val }),
});
</script>

<template>
  <input
    class="answer-option form-control"
    name="answer"
    type="number"
    aria-label="Please type your answer"
    v-model="_value"
    autofocus
  />
</template>

<style scoped lang="scss"></style>
