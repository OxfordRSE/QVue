<script setup lang="ts">
import Datepicker from "@vuepic/vue-datepicker";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";
import { computed } from "vue";
import type { Answer } from "questionnaire-core";
import ItemLabel from "@/components/ItemLabel.vue";

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
  <div class="answer-wrapper d-flex" :class="answer.class_wrapper">
    <ItemLabel :id="props.id" :base="props.base" />
    <Datepicker
      :id="props.id"
      format="MM/dd/yyyy"
      inlineWithInput
      v-model="answer.content"
    />
  </div>
</template>

<style scoped lang="scss">
input.form-control {
  width: 4em;
  height: unset;
  align-self: end;
}
</style>
