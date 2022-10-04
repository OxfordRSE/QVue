<script setup lang="ts">
import type { Answer } from "@/cis-r";

defineEmits<{
  (e: "answer", ans: Answer): void;
}>();
defineProps<{
  answer: Answer | undefined;
}>();
</script>

<template>
  <input
    class="answer-option form-control"
    name="answer"
    type="number"
    aria-label="Please type your answer"
    :value="answer?.value"
    @change="x => $emit('answer', { x, text: '' })"
  />
</template>

<style scoped lang="scss"></style>
