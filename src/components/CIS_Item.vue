<script setup lang="ts">
import type { Item, Answer } from "@/cis-r";
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

defineEmits<{
  (e: "answer", ans: Answer): void;
  (e: "back"): void;
  (e: "next"): void;
}>();
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
        @answer="(a) => $emit('answer', a)"
      />
      <CIS_AnswerNumber
        v-if="item.type === ItemType.NUMBER"
        :answer="item.answer?.value"
        @answer="(a) => $emit('answer', a)"
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
        @click="$emit('next')"
        @keydown="
          (evt) => {
            if (evt.key === 'Enter' || evt.key === 'Space') $emit('next');
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
