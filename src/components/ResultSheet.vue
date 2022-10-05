<script setup lang="ts">
import VueMarkdown from "vue-markdown-render"
import { getCurrentInstance, ref, type Ref } from "vue";

export interface Props {
  content: Object;
}

const props = withDefaults(defineProps<Props>(), {});

// Parse a URL with d, t, a query params (base64 encoded)
// e.g. http://localhost:5173/CIS-R/?c=c3VtbWFyeSxkb3dubG9hZA==&d=VGVzdCBFbmRwb2ludA==&t=aHR0cHM6Ly9sb2NhbGhvc3Qvc2VudHJ5X2VuZHBvaW50Lw==&a=eyJ0b2tlbiI6IlBUTi0xMDIiLCJhdXRob3JpemF0aW9uIjoiYmVhcmVyIHRtcF90a25fMDAwMDEifQ==
const spec_64 = getCurrentInstance()?.proxy?.$route.query.spec || null;

const spec = typeof spec_64 === "string" ? atob(spec_64) : "{}";
let specification = null;
try {
  if (spec) specification = JSON.parse(spec);
} catch (e) {
  console.error(e);
}

let uploadComplete: Ref<boolean> = ref(false);
let uploadStatus: Ref<number | undefined> = ref();

if (typeof specification?.fetch?.url === "string" && props.content) {
  fetch(specification?.fetch.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...specification?.fetch?.headers },
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
}
</script>

<template>
  <div v-if="specification.fetch.url" class="sticky-top text-center">
    <p v-if="!uploadComplete" class="text-bg-info">
      Uploading to {{ specification.fetch.display || specification.fetch.url }}...
    </p>
    <p v-else-if="uploadStatus !== 200" class="text-bg-danger">
      Error uploading results to {{ specification.fetch.display || specification.fetch.url }}.<br />
      <span v-if="specification.content?.download">You may wish to try downloading your results and sending them yourself.</span>
    </p>
    <p v-else class="text-bg-success">Upload complete!</p>
  </div>
  <VueMarkdown
    v-if="specification.content?.custom"
    class="custom"
    :source="specification.content?.custom"
  />
  <div
    v-if="specification.content?.summary"
    class="summary"
    v-html="props.content.summary"
  />
  <div
    v-if="specification.content?.download"
    class="download"
  >Download link...</div>
</template>

<style scoped lang="scss"></style>
