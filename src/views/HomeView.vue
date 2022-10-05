<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import * as cis from "@/cis-r";
import CIS_Item from "@/components/CIS_Item.vue";
import ResultSheet from "@/components/ResultSheet.vue";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";

const settings = useSettingsStore();
const { auto_continue, auto_continue_delay } = storeToRefs(settings);

const state = ref(cis.CIS());

let progress_width: Ref<number> = ref(0);
let answerTimeout: Ref<number | undefined> = ref();
let tickTimeout: Ref<number | undefined> = ref();
let answerDelay = computed(() => (auto_continue_delay.value * 1000));
let tickDelay = computed(() => Math.max(answerDelay.value / 100, 50));
let progress_increment = computed(() => 120 / (answerDelay.value / tickDelay.value));
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
      clearProgress();
      state.value.next_q(ans);
    }, answerDelay.value);
    tickTimeout.value = setTimeout(updateProgress, tickDelay.value);
  }
};

const next = (ans: any) => {
  clearProgress();
  state.value.next_q(ans);
};
</script>

<template>
  <main class="container-sm">
    <div v-if="state.current_item" class="h-100">
      <CIS_Item
        :item="state.current_item"
        @answer="(ans) => answer(ans)"
        @next="(ans) => next(ans)"
        @back="() => state.last_q()"
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
</template>
