<script setup lang="ts">
import { type Answer, type Item, ItemType } from "questionnaire-core/dist";
import SettingsMenu from "@/components/SettingsMenu.vue";
import CIS_AnswerRadio from "@/components/CIS_AnswerRadio.vue";
import CIS_AnswerNumber from "@/components/CIS_AnswerNumber.vue";
import { watch, ref, type Ref } from "vue";

export interface Props {
  item: Item;
  next_button_label?: string;
  next_button_key?: string;
  disable_back_button?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disable_back_button: false,
  next_button_label: "<kbd>N</kbd>ext",
  next_button_key: "n",
});

const emit = defineEmits<{
  (e: "answer", ans: Answer | undefined): void;
  (e: "back"): void;
  (e: "next", ans: Answer | undefined): void;
}>();

let answer: Ref<Answer | undefined> = ref();
watch(
  () => props.item,
  (new_item) => {
    console.log(`New item: ${new_item.id}, answer=${new_item.answer?.value}`)
    answer.value = new_item.answer;
  }
);
const record_answer = (ans: Answer | undefined) => {
  answer.value = ans;
  emit("answer", ans);
};

const next = () => {
  if (typeof answer.value !== "undefined" || props.item.type === ItemType.NONE)
    emit("next", answer.value);
};
</script>

<template>
  <div class="radio-form">
    <div class="question lead">
      <aside class="float-end">
        <SettingsMenu />
      </aside>
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
        :answer="item.answer"
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
        data-click-on-key="g"
      >
        <kbd>G</kbd>o back
      </button>
      <button
        class="btn btn-primary flex-grow-1 ms-2"
        @click="next"
        @keydown="
          (evt) => {
            if (evt.key === 'Enter' || evt.key === 'Space') next();
          }
        "
        :disabled="
          typeof answer === 'undefined' && props.item.type !== ItemType.NONE
        "
        :data-click-on-key="props.next_button_key"
        v-html="props.next_button_label"
      />
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
