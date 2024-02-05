<script setup lang="ts">
// @ts-ignore
import CogIcon from "vue-material-design-icons/Cog.vue";
import { useURLStore } from "@/stores/url_settings";
import md from "markdown-it";
import attrs from "markdown-it-attrs";
// Code below goes in any file that needs to use the i18n library
import queryString from "query-string";
import { I18n } from "i18n-js";
import translations from "../i18n.json"; // adapt as necessary for src/i18n.json

const i18n = new I18n(translations);
const parsed = queryString.parse(location.search);
if (parsed?.locale) i18n.locale = String(parsed.locale).toLowerCase();
// End of i18n setup

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
      <h2>{{ i18n.t("general_about_tool") }}:</h2>
      <p>
        {{ i18n.t("qvue_base-welcome1") }} <CogIcon title="settings" />
        {{ i18n.t("qvue_base-welcome2") }}
      </p>
      <h2>
        {{ i18n.t("qvue_base-about") }} {{ questionnaire_name }}:</h2>
      <div v-html="questionnaire_intro"></div>
      <h2>
        {{ i18n.t("qvue_base-data-collection-title") }}</h2>
      <p>
        {{ i18n.t("qvue_base-data-collection-content") }}
      </p>
      <details v-if="url_settings.fetch?.url">
        <summary><h3>{{ i18n.t("qvue_base-data-data") }}</h3></summary>
        <p>
          {{ i18n.t("qvue_base-data-data-content1") }}
          <mark>{{
            url_settings.fetch?.url?.replace(/.+:\/\/([^/]+)\/?.*/, "$1")
          }}</mark
          >{{ i18n.t("qvue_base-data-data-content2") }}
        </p>
        <div v-if="url_settings.fetch?.data_policy">
          <p>
            {{ i18n.t("qvue_base-data-data-content3") }}
            {{ url_settings.fetch?.url?.replace(/.+:\/\/([^/]+)\/?.*/, "$1") }}
            {{ i18n.t("qvue_base-data-data-content4") }}
          </p>
          <div
            class="border-info border-1 card px-1 pt-2"
            v-html="markdown"
          ></div>
        </div>
        <p v-else>
          {{ i18n.t("qvue_base-data-data-content3") }}
          {{ url_settings.fetch?.url?.replace(/.+:\/\/([^/]+)\/?.*/, "$1") }}
          {{ i18n.t("qvue_base-data-data-content5") }}
        </p>
        <p>
          <strong
            >{{ i18n.t("qvue_base-data-data-content6") }}</strong
          >
        </p>
      </details>
      <details v-if="url_settings.content?.download">
        <summary><h3>{{ i18n.t("qvue_base-data-saveable-data") }}</h3></summary>
        <p>
          {{ i18n.t("qvue_base-data-saveable-data-content") }}
        </p>
      </details>
      <details>
        <summary><h3>{{ i18n.t("qvue_base-data-temporary-data") }}</h3></summary>
        <p>
          {{ i18n.t("qvue_base-data-temporary-data-content") }}
        </p>
      </details>
      <h2>{{ i18n.t("qvue_base-data-note") }}</h2>
      <p>
        {{ i18n.t("qvue_base-data-note-content") }}
      </p>
      <p>
        <strong
          >{{ i18n.t("qvue_base-generic-end") }}</strong
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
        <kbd>{{ i18n.t("qvue_base-begin1") }}</kbd>{{ i18n.t("qvue_base-begin2") }}
      </button>
      <button
        v-if="show_continue"
        class="btn btn-primary"
        data-click-on-key="r"
        @click="$emit('resume')"
      >
        <kbd>{{ i18n.t("qvue_base-resume1") }}</kbd>{{ i18n.t("qvue_base-resume2") }}
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
