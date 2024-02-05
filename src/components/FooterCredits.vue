<script setup lang="ts">
import md from "markdown-it";
import attrs from "markdown-it-attrs";
import { computed } from "vue";
// Code below goes in any file that needs to use the i18n library
import queryString from "query-string";
import { I18n } from "i18n-js";
import translations from "../i18n.json"; // adapt as necessary for src/i18n.json

const i18n = new I18n(translations);
const parsed = queryString.parse(location.search);
if (parsed?.locale) i18n.locale = String(parsed.locale).toLowerCase();
// End of i18n setup

const props = defineProps<{
  questionnaire_name: string;
  questionnaire_citation: string;
}>();

const md_instance = md();
md_instance.use(attrs, { allowedAttributes: ["class"] });

const markdown = computed(() => {
  //@ts-ignore
  if (!props.questionnaire_citation) return "";
  try {
    //@ts-ignore
    return md_instance.render(props.questionnaire_citation);
  } catch (e) {
    console.error(e);
    return "";
  }
});
</script>

<template>
  <footer class="credits d-flex flex-column pb-2">
    <div v-if="questionnaire_citation" class="citation">
      <div class="p-2">{{ questionnaire_name }}:</div>
      <div class="px-4" v-html="markdown" />
    </div>
    <div class="p-2">Web application developed by:</div>
    <div
      class="d-flex mb-2 justify-content-evenly align-content-center text-center"
    >
      <a href="https://www.rse.ox.ac.uk/about/">
        <img
          src="/oxrse_logo.svg"
          alt="Oxford Research Software Engineering"
          title="Oxford Research Software Engineering"
        />
      </a>
      <a href="https://oxfordhealthbrc.nihr.ac.uk/our-work/oxppl/">
        <img
          src="/ppl_logo.svg"
          alt="Precision Psychiatry Lab logo"
          title="Precision Psychiatry Lab"
        />
      </a>
    </div>
  </footer>
</template>

<style lang="scss">
footer.credits {
  font-size: small;
  .citation a {
    color: inherit;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  img {
    height: 6em;
    min-height: 25px;
    min-width: 25px;
  }
}
</style>
