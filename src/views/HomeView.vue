<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import type { Item } from "questionnaire-core";
import QuestionItem from "@/components/QuestionItem.vue";
import ResultSheet from "@/components/ResultSheet.vue";
import WelcomeMessage from "@/components/WelcomeMessage.vue";
import PetrushkaBanner from "@/components/PetrushkaBanner.vue";
import FooterCredits from "@/components/FooterCredits.vue";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { useURLStore } from "@/stores/url_settings";
import { useRoute } from "vue-router";
import { useQuestionnaireStore } from "@/stores/questionnaire";

const router = useRoute();
const store = useURLStore();
const settings = useSettingsStore();
const questionnaireStore = useQuestionnaireStore();
const { auto_continue, auto_continue_delay } = storeToRefs(settings);
const { questionnaire, inputs_dirty } = storeToRefs(questionnaireStore);

if (router.params.questionnaire) {
  // @ts-ignore
  // import(`../../node_modules/questionnaire-${router.params.questionnaire}/index.js`)
  import(`../dev/${router.params.questionnaire}.js`)
    .then((m) => {
      console.debug(`Loaded module questionnaire-${router.params.questionnaire}/index.js`)
      questionnaire.value = m.questionnaire();
    })
    .catch((e) => {
      console.error(
        `Unable to load module questionnaire-${router.params.questionnaire}`,
        e
      );
    });
} else {
  import('../dev/pecunia.js')
    .then(m => {
      console.log(m.questionnaire());
      return m;
    })
    .then(m => questionnaire.value = m.questionnaire())
    .then(() => console.log("loaded pecunia"))
}

const local_storage_key: string = "answers";

const ready: Ref<boolean> = ref(false);

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

const scroll = () => window.scrollTo(0, 0);
const load_state = () => {
  try {
    while (past_answers.length) {
      const op = past_answers.shift();
      if (questionnaire.value.current_item?.id === op.id) {
        questionnaire.value.next_q();
      } else {
        throw `Mismatched ids for Q(${questionnaire.value.current_item?.id}) and Op(${op.id})`;
      }
    }
  } catch (e) {
    // questionnaire.value = cis.CIS();
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
  // console.log(`${questionnaire.value.current_item?.id} <- ${ans?.value}`)
  questionnaire.value.next_q();
  // console.log(questionnaire.value.items.filter((_, i) => i < 10).map(i => `${i.id}: ${i.answer?.value}`))
  if (questionnaire.value.current_item)
    localStorage.setItem(
      local_storage_key,
      JSON.stringify(
        questionnaire.value.item_history.map((i: Item) => ({
          id: i.id,
          answer: i.answers,
        }))
      )
    );
  else localStorage.removeItem(local_storage_key);
};

const last = () => {
  questionnaire.value.last_q();
  // console.log(questionnaire.value.items.filter((_, i) => i < 10).map(i => `${i.id}: ${i.answer?.value}`));
};
</script>

<template>
  <div class="page" v-if="!ready">
    <WelcomeMessage
      @okay="
        ready = true;
        scroll();
      "
      @resume="
        load_state();
        scroll();
      "
      :show_continue="past_answers.length > 0"
    />
  </div>
  <div class="page d-flex flex-column h-100" v-else>
    <header>
      <div v-if="store.display?.banner_img_src" class="navbar">
        <a v-if="store.display.banner_href" :href="store.display.banner_href">
          <img
            :src="store.display.banner_img_src"
            :alt="store.display.banner_img_alt || ''"
            :title="
              store.display.banner_img_title ||
              store.display.banner_img_alt ||
              ''
            "
          />
        </a>
        <img
          v-else
          :src="store.display.banner_img_src"
          :alt="store.display.banner_img_alt || ''"
          :title="
            store.display.banner_img_title || store.display.banner_img_alt || ''
          "
        />
      </div>
      <div v-else-if="store.display?.banner_text" class="navbar">
        <a v-if="store.display.banner_href" :href="store.display.banner_href">
          {{ store.display.banner_text }}
        </a>
        <span v-else>{{ store.display.banner_text }}</span>
      </div>
      <PetrushkaBanner v-else />
    </header>
    <hr />
    <main class="container-sm d-flex flex-column h-100 flex-grow-1">
      <div
        v-if="questionnaire && questionnaire.current_item"
        class="item d-flex flex-column h-100 flex-grow-1"
      >
        <QuestionItem
          :disable_back_button="
            questionnaire.current_item === questionnaire.items[0]
          "
        />
        <div
          v-if="answerTimeout"
          class="progress mt-2 flex-grow-0"
          style="height: 1px"
        >
          <div
            class="progress-bar"
            role="progressbar"
            aria-label="Submitting answer in..."
            :aria-valuenow="progress_width"
            :aria-valuemin="0"
            :aria-valuemax="100"
            :style="`width: ${progress_width}%`"
          ></div>
        </div>
        <div
          v-else-if="settings.auto_continue"
          class="progress mt-2 flex-grow-0"
          style="height: 1px"
        >
          <div
            class="progress-bar"
            role="progressbar"
            aria-hidden="true"
            style="width: 0"
          ></div>
        </div>
      </div>
      <ResultSheet v-else />
    </main>
  </div>
  <FooterCredits />
</template>
<style lang="scss" scoped>
.page {
  min-height: 95vh;
}
.item > *:not(.progress-bar) {
  height: 100%;
  flex-grow: 1;
}
header {
  min-height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  .navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--bs-black);
    font-size: 2em;
    a {
      color: inherit;
      text-decoration: none;
    }
    img {
      max-width: 90vw;
    }
  }
}
</style>
