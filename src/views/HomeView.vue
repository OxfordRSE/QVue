<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import * as cis from "@/cis-r";
import CIS_Item from "@/components/CIS_Item.vue";
import ResultSheet from "@/components/ResultSheet.vue";
import WelcomeMessage from "@/components/WelcomeMessage.vue";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import SettingsMenu from "@/components/SettingsMenu.vue";
import { useURLStore } from "@/stores/url_settings";

const store = useURLStore();
const settings = useSettingsStore();
const { auto_continue, auto_continue_delay } = storeToRefs(settings);

const local_storage_key: string = "answers";

const ready: Ref<boolean> = ref(false);
let state = ref(cis.CIS());
let past_answers: any;
try {
  const state_str = localStorage.getItem(local_storage_key) || "";
  past_answers = JSON.parse(state_str);
  if (!(past_answers instanceof Array)) {
    console.error("Not an array:", past_answers);
    throw "Local storage not an array";
  }
} catch (e) {
  past_answers = [];
}

const load_state = () => {
  try {
    while (past_answers.length) {
      const op = past_answers.shift();
      if (state.value.current_item?.id === op.id) {
        state.value.next_q(op.answer);
      } else {
        throw `Mismatched ids for Q(${state.value.current_item?.id}) and Op(${op.id})`;
      }
    }
  } catch (e) {
    state.value = cis.CIS();
    console.error(`Error restoring questionnaire from local data.`);
    console.error(e);
  } finally {
    ready.value = true;
  }
};

let progress_width: Ref<number> = ref(0);
let answerTimeout: Ref<number | undefined> = ref();
let tickTimeout: Ref<number | undefined> = ref();
let answerDelay = computed(() => auto_continue_delay.value * 1000);
let tickDelay = computed(() => Math.max(answerDelay.value / 100, 50));
let progress_increment = computed(
  () => 120 / (answerDelay.value / tickDelay.value)
);
const updateProgress = () => {
  progress_width.value = progress_width.value + progress_increment.value;
  if (progress_width.value < 100)
    tickTimeout.value = setTimeout(updateProgress, tickDelay.value);
};
const clearProgress = () => {
  clearTimeout(answerTimeout.value);
  answerTimeout.value = undefined;
  clearTimeout(tickTimeout.value);
  tickTimeout.value = undefined;
  progress_width.value = 0;
};
const answer = (ans: any) => {
  if (auto_continue) {
    clearProgress();
    answerTimeout.value = setTimeout(() => {
      next(ans);
    }, answerDelay.value);
    tickTimeout.value = setTimeout(updateProgress, tickDelay.value);
  }
};

const next = (ans: any) => {
  clearProgress();
  // console.log(`${state.value.current_item?.id} <- ${ans?.value}`)
  state.value.next_q(ans);
  // console.log(state.value.items.filter((_, i) => i < 10).map(i => `${i.id}: ${i.answer?.value}`))
  if (state.value.current_item)
    localStorage.setItem(
      local_storage_key,
      JSON.stringify(
        state.value.item_history.map((i) => ({ id: i.id, answer: i.answer }))
      )
    );
  else localStorage.removeItem(local_storage_key);
};

const last = () => {
  state.value.last_q();
  // console.log(state.value.items.filter((_, i) => i < 10).map(i => `${i.id}: ${i.answer?.value}`));
};
</script>

<template>
  <div v-if="!ready" class="h-100">
    <WelcomeMessage
      @okay="ready = true"
      @resume="load_state"
      :show_continue="past_answers.length > 0"
    />
  </div>
  <div v-else class="h-100">
    <header>
      <div
        v-if="store.display?.banner_html"
        class="navbar"
        v-html="store.display.banner_html"
      />
      <SettingsMenu />
    </header>
    <main class="container-sm">
      <div v-if="state.current_item" class="h-100">
        <CIS_Item
          :item="state.current_item"
          @answer="(ans) => answer(ans)"
          @next="(ans) => next(ans)"
          @back="last"
          :disable_back_button="state.current_item === state.items[0]"
        />
        <div v-if="answerTimeout" class="progress mt-2" style="height: 1px">
          <div
            class="progress-bar"
            role="progressbar"
            aria-label="Basic example"
            :aria-valuenow="progress_width"
            :aria-valuemin="0"
            :aria-valuemax="100"
            :style="`width: ${progress_width}%`"
          ></div>
        </div>
      </div>
      <ResultSheet v-else :content="state.data" />
    </main>
  </div>
</template>
<style lang="scss" scoped>
header {
  min-height: 3em;
}
</style>
