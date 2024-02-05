<script setup lang="ts">
import { computed, markRaw, ref, type Ref, toRaw } from "vue";
import { useURLStore } from "@/stores/url_settings";
import { useQuestionnaireStore } from "@/stores/questionnaire";
import { storeToRefs } from "pinia";
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
const specification = useURLStore();
const questionnaireStore = useQuestionnaireStore();
const { questionnaire } = storeToRefs(questionnaireStore);

const content = computed(() => questionnaire.value.data);
const data = computed(() => toRaw(questionnaire.value).data);

let uploadComplete: Ref<boolean> = ref(false);
let uploadStatus: Ref<number | undefined> = ref();
let uploadReply: Ref<string | undefined> = ref();

if (typeof specification?.fetch?.url === "string" && content) {
  if (
    confirm(
      `${
        specification.fetch.display ? `${specification.fetch.display}:\n\n` : ""
      }Your data will now be sent to ${specification.fetch.url.replace(
        /.+:\/\/([^/]+)\/?.*/,
        "$1"
      )}`
    )
  ) {
    let body = data.value;
    if (specification?.fetch?.extra_body_content)
      body = { ...specification.fetch.extra_body_content, data: data.value };
    fetch(specification?.fetch?.url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...specification?.fetch?.headers,
      },
      body: JSON.stringify(body),
    })
      .then((r) => {
        uploadComplete.value = true;
        uploadStatus.value = r.status;
        return r.json();
      })
      .then((r) => (uploadReply.value = r.error_message || r.message))
      .catch((e) => {
        console.error(e);
        uploadComplete.value = true;
      });
  } else {
    uploadComplete.value = true;
    uploadStatus.value = -1;
  }
}

let data_url: string = "";
if (specification?.output?.download) {
  const blob_part = JSON.stringify(data.value, null, 2);
  const blob = new Blob([blob_part], { type: "application/json" });
  data_url = window.URL.createObjectURL(blob);
}

const md_instance = md();
md_instance.use(attrs, { allowedAttributes: ["class"] });

const markdown = computed(() => {
  //@ts-ignore
  if (!specification.output.custom) return "";
  try {
    //@ts-ignore
    return md_instance.render(specification.output.custom);
  } catch (e) {
    console.error(e);
    return "";
  }
});
</script>

<template>
  <div
    v-if="specification?.fetch?.url && !specification?.fetch?.silent"
    class="sticky-top text-center"
  >
    <p v-if="!uploadComplete" class="text-bg-info">
      Uploading to
      {{ specification.fetch.display || specification.fetch.url }}...
    </p>
    <p v-else-if="uploadStatus === -1" class="text-bg-warning">
      You refused permission to upload data to
      {{ specification.fetch.display || specification.fetch.url }}.
    </p>
    <p v-else-if="uploadStatus !== 200" class="text-bg-danger">
      Error uploading results to
      {{ specification.fetch.display || specification.fetch.url }}.
      <span v-if="uploadReply" class="server-reply"
        ><br />{{ uploadReply }}</span
      >
      <span v-if="specification.content?.download"
        ><br />You may wish to try downloading your results and sending them
        yourself.</span
      >
    </p>
    <p v-else class="text-bg-success">Upload complete!</p>
  </div>
  <div
    v-if="
      specification?.output === null ||
      specification?.output?.thank_you ||
      typeof specification?.output !== 'object' ||
      Object.keys(specification.output).length === 0
    "
    class="blank mb-2"
  >
    <p>Thank you for completing the {{ questionnaire.name }}.</p>
  </div>
  <div
    v-if="specification?.output?.custom"
    class="custom mb-2"
    v-html="markdown"
  />
  <div
    v-if="specification?.output?.summary"
    class="summary mb-2"
    v-html="content.summary"
  />
  <a
    v-if="specification?.output?.download"
    class="download"
    download="questionnaire-data.json"
    :href="data_url"
    ><button class="btn btn-primary mb-2">Download data</button></a
  >
</template>

<style scoped lang="scss"></style>
