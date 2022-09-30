<script setup lang="ts">
import { ref } from "vue";
import type { Answer } from "@/cis-r";

let value = ref();
defineEmits<{
  (e: "answer", ans: Answer): void;
}>();
defineProps<{}>();
</script>

<template>
  <input
    class="answer-option form-control"
    type="number"
    aria-label="Please type your answer"
    v-model="value"
    @change="$emit('answer', { value, text: '' })"
  />
</template>

<style scoped lang="scss"></style>
