<script setup lang="ts">
import * as Q from "questionnaire-core";
import ItemBlank from "@/components/ItemBlank.vue";
import ItemRadio from "@/components/ItemRadio.vue";
import ItemCheckbox from "@/components/ItemCheckbox.vue";
import ItemSelect from "@/components/ItemSelect.vue";
import ItemNumber from "@/components/ItemNumber.vue";
import ItemText from "@/components/ItemText.vue";
import ItemTextArea from "@/components/ItemTextArea.vue";
import ItemDate from "@/components/ItemDate.vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";
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
</script>

<template>
  <ItemBlank
    v-if="answer.type === Q.AnswerType.NONE"
    :id="answer.id"
    :base="props.base"
  />
  <ItemRadio
    v-if="answer.type === Q.AnswerType.RADIO"
    :id="answer.id"
    :base="props.base"
  />
  <ItemCheckbox
    v-if="answer.type === Q.AnswerType.CHECKBOX"
    :id="answer.id"
    :base="props.base"
  />
  <ItemSelect
    v-if="answer.type === Q.AnswerType.SELECT"
    :id="answer.id"
    :base="props.base"
  />
  <ItemNumber
    v-if="answer.type === Q.AnswerType.NUMBER"
    :id="answer.id"
    :base="props.base"
  />
  <ItemText
    v-if="answer.type === Q.AnswerType.TEXT"
    :id="answer.id"
    :base="props.base"
  />
  <ItemTextArea
    v-if="answer.type === Q.AnswerType.TEXTAREA"
    :id="answer.id"
    :base="props.base"
  />
  <ItemDate
    v-if="answer.type === Q.AnswerType.DATE"
    :id="answer.id"
    :base="props.base"
  />
</template>

<style scoped lang="scss">
.radio-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.buttons {
  display: flex;
}
</style>
