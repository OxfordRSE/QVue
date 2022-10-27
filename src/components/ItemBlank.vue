<script setup lang="ts">
import type { Answer } from "questionnaire-core";
import ItemLabel from "@/components/ItemLabel.vue";

export interface Props {
  id: string;
  base?: Answer | null;
}

const props = withDefaults(defineProps<Props>(), {
  base: null,
});
</script>

<template>
  <div
    class="answer-wrapper d-flex flex-grow-1 justify-content-between align-items-center flex-column"
  >
    <ItemLabel :id="props.id" :base="props.base" />
  </div>
</template>

<style scoped lang="scss">
input,
select {
  margin-left: 0.5em;
}
</style>
