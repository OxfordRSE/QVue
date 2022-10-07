<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";
import { getCurrentInstance, ref, type Ref } from "vue";
import { useURLStore } from "@/stores/url_settings";

const specification = useURLStore();

export interface Props {
  content: Object;
}

const props = withDefaults(defineProps<Props>(), {});

let uploadComplete: Ref<boolean> = ref(false);
let uploadStatus: Ref<number | undefined> = ref();

if (typeof specification?.fetch?.url === "string" && props.content) {
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
    fetch(specification?.fetch?.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...specification?.fetch?.headers,
      },
      body: JSON.stringify(props.content),
    })
      .then((r) => {
        uploadComplete.value = true;
        uploadStatus.value = r.status;
      })
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
if (specification?.content?.download) {
  const blob_part = JSON.stringify(props.content, null, 2);
  const blob = new Blob([blob_part], { type: "application/json" });
  data_url = window.URL.createObjectURL(blob);
}
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
      {{ specification.fetch.display || specification.fetch.url }}.<br />
      <span v-if="specification.content?.download"
        >You may wish to try downloading your results and sending them
        yourself.</span
      >
    </p>
    <p v-else class="text-bg-success">Upload complete!</p>
  </div>
  <div
    v-if="
      specification?.content?.thank_you ||
      typeof specification?.content !== 'object' ||
      Object.keys(specification.content).length === 0
    "
    class="blank mb-2"
  >
    <p>Thank you for answering those questions.</p>
    <p>This is the end of the computerised interview.</p>
    <p>Please tell the researcher or clinician you have finished.</p>
  </div>
  <VueMarkdown
    v-if="specification?.content?.custom"
    class="custom mb-2"
    :source="specification?.content?.custom"
  />
  <div
    v-if="specification?.content?.summary"
    class="summary mb-2"
    v-html="props.content.summary"
  />
  <a
    v-if="specification?.content?.download"
    class="download"
    download="CIS-R.json"
    :href="data_url"
    ><button class="btn btn-primary mb-2">Download data</button></a
  >
</template>

<style scoped lang="scss"></style>
