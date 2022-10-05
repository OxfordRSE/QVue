<script setup lang="ts">
import type { Answer, Item } from "@/cis-r";
import { ItemType } from "@/cis-r";
import CIS_AnswerRadio from "@/components/CIS_AnswerRadio.vue";
import CIS_AnswerNumber from "@/components/CIS_AnswerNumber.vue";

export interface Props {
  item: Item;
  next_button_label?: string;
  disable_back_button?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disable_back_button: false,
  next_button_label: "Next",
});

const emit = defineEmits<{
  (e: "answer", ans: Answer | undefined): void;
  (e: "back"): void;
  (e: "next", ans: Answer | undefined): void;
}>();

let answer: Answer | undefined;
const record_answer = (ans: Answer | undefined) => {
  answer = ans;
  emit("answer", ans);
};

const next = () => {
  emit("next", answer);
};
</script>

<template>
  <div class="radio-form">
    <div class="question lead">
      {{ item.question }}
    </div>
    <div class="answers flex-grow-1 my-4" v-if="item.type !== ItemType.NONE">
      <CIS_AnswerRadio
        v-if="item.type === ItemType.RADIO"
        :answers="item.answer_options"
        :answer="item.answer"
        @answer="(a) => record_answer(a)"
      />
      <CIS_AnswerNumber
        v-if="item.type === ItemType.NUMBER"
        :answer="item.answer?.value"
        @answer="(a) => record_answer(a)"
      />
    </div>
    <div class="buttons">
      <button
        class="btn btn-outline-secondary"
        @click="$emit('back')"
        @keydown="
          (evt) => {
            if (evt.key === 'Enter' || evt.key === 'Space') $emit('back');
          }
        "
        :disabled="props.disable_back_button"
      >
        Back
      </button>
      <button
        class="btn btn-primary flex-grow-1 ms-2"
        @click="next"
        @keydown="
          (evt) => {
            if (evt.key === 'Enter' || evt.key === 'Space') next();
            else console.debug(evt.key);
          }
        "
      >
        {{ props.next_button_label }}
      </button>
    </div>
  </div>
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
