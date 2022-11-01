<script setup lang="ts">
// @ts-ignore
import CogIcon from "vue-material-design-icons/Cog.vue";
import { useURLStore } from "@/stores/url_settings";
import md from "markdown-it";
import attrs from "markdown-it-attrs";

import { computed } from "vue";
const md_instance = md();
md_instance.use(attrs, { allowedAttributes: ["class"] });

const markdown = computed(() => {
  if (!url_settings.fetch?.data_policy) return "";
  try {
    return md_instance.render(url_settings.fetch?.data_policy);
  } catch (e) {
    console.error(e);
    return "";
  }
});

defineProps<{
  show_continue: boolean;
  questionnaire_name: string;
  questionnaire_intro: string;
}>();

defineEmits<{
  (e: "okay"): void;
  (e: "resume"): void;
}>();

const url_settings = useURLStore();
</script>

<template>
  <main class="container-sm">
    <header class="card-header text-center">
      <h1>{{ questionnaire_name }}</h1>
    </header>
    <hr />
    <div class="card-body">
      <h2>About the tool:</h2>
      <p>
        This tool will guide you through completing a questionnaire. You can
        customise how the tool behaves at any time during the questionnaire
        using the <CogIcon title="settings" /> icon.
      </p>
      <h2>About the {{ questionnaire_name }}:</h2>
      <div v-html="questionnaire_intro"></div>
      <h2>Data collection:</h2>
      <p>
        The tool will not collect any data itself, but it will create some data
        you need to know about:
      </p>
      <details v-if="url_settings.fetch?.url">
        <summary><h3>Sending Data</h3></summary>
        <p>
          When you have completed the questionnaire the data will be sent to
          <mark>{{
            url_settings.fetch?.url?.replace(/.+:\/\/([^/]+)\/?.*/, "$1")
          }}</mark
          >. This address should look similar to the email address or website
          address that you got this link from. It should also make sense with
          the banner you see at the top of the page while doing the
          questionnaire.
        </p>
        <div v-if="url_settings.fetch?.data_policy">
          <p>
            The data controller for
            {{ url_settings.fetch?.url?.replace(/.+:\/\/([^/]+)\/?.*/, "$1") }}
            provided the following data policy statement:
          </p>
          <div
            class="border-info border-1 card px-1 pt-2"
            v-html="markdown"
          ></div>
        </div>
        <p v-else>
          The data controller for
          {{ url_settings.fetch?.url?.replace(/.+:\/\/([^/]+)\/?.*/, "$1") }}
          did not provide any information on their data handling policy.
        </p>
        <p>
          <strong
            >If you do not trust the source of the link that brought you to this
            site, do not continue.</strong
          >
        </p>
      </details>
      <details v-if="url_settings.content?.download">
        <summary><h3>Saveable Data</h3></summary>
        <p>
          When you have completed the questionnaire, you will be able to
          download and save a copy of the data it generates.
        </p>
      </details>
      <details>
        <summary><h3>Temporary Data</h3></summary>
        <p>
          This site stores a small amount of information on your computer to
          track your progress through the questionnaire. When you complete the
          questionnaire this information is removed.
        </p>
      </details>
      <h2>Note:</h2>
      <p>
        Once you pass this page, your user experience will be customised by
        whoever provided the link to this website.
      </p>
      <p>
        <strong
          >If you do not trust the source of the link that brought you to this
          site, do not continue.</strong
        >
      </p>
    </div>
    <footer class="card-footer d-flex justify-content-around pb-2">
      <button
        class="btn"
        :class="show_continue ? 'btn-outline-primary' : 'btn-primary'"
        data-click-on-key="b"
        @click="$emit('okay')"
      >
        <kbd>B</kbd>egin
      </button>
      <button
        v-if="show_continue"
        class="btn btn-primary"
        data-click-on-key="r"
        @click="$emit('resume')"
      >
        <kbd>R</kbd>esume
      </button>
    </footer>
  </main>
</template>

<style scoped lang="scss">
h3 {
  display: inline-block;
  font-size: calc(0.9rem + 0.6vw);
}
.policy {
  border: 1px solid black;
}
</style>
