<script setup lang="ts">
import SettingsMenu from "@/components/SettingsMenu.vue";
import AnswerSet from "@/components/AnswerSet.vue";
import { watch, computed, type Ref } from "vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireStore } from "@/stores/questionnaire";

const questionnaireStore = useQuestionnaireStore();
const { questionnaire } = storeToRefs(questionnaireStore);

export interface Props {
  next_button_label?: string;
  next_button_key?: string;
  disable_back_button?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disable_back_button: false,
  next_button_label: "<kbd>N</kbd>ext",
  next_button_key: "n",
});

const item = computed(() => questionnaire.value.current_item);

watch(
  () => item,
  (new_id) => {
    console.log(`New item: ${new_id}`);
  }
);

const next = () => questionnaire.value.next_q();
const back = () => questionnaire.value.last_q();
</script>

<template>
  <div class="radio-form">
    <div class="question lead">
      <aside class="float-end">
        <SettingsMenu />
      </aside>
      {{ item.question }}
    </div>
    <div class="answers flex-grow-1 my-4" v-if="item.answers.length">
      <AnswerSet />
    </div>
    <div class="buttons">
      <button
        class="btn btn-outline-secondary"
        @click="back"
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
        :disabled="item.find_issues() !== false"
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
