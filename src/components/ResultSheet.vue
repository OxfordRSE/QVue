<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";
import { getCurrentInstance, ref, type Ref } from "vue";

export interface Props {
  content: Object;
}

const props = withDefaults(defineProps<Props>(), {});

// Parse a URL with d, t, a query params (base64 encoded)
// e.g. http://localhost:5173/CIS-R/report?spec=eyJmZXRjaCI6eyJ1cmwiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbS9lbmRwb2ludC8iLCJoZWFkZXJzIjp7IlVzZXItVG9rZW4iOiJ1c2VyXzAwMDEiLCJBdXRob3JpemF0aW9uIjoiYmVhcmVyIHRrbl91c2VyXzAwMDFfYWJjZGVmMTIzIn0sImRpc3BsYXkiOiJFeGFtcGxlIEFQSSBVcGxvYWQifSwiY29udGVudCI6eyJjdXN0b20iOiIjIFRoYW5rIHlvdVxuXG5UaGFuayB5b3UgZm9yIGNvbXBsZXRpbmcgdGhlIENJUy1SLiBBIHN1bW1hcnkgb2YgeW91ciByZXN1bHRzIGlzIHNob3duIGJlbG93LiIsInN1bW1hcnkiOnRydWUsImRvd25sb2FkIjp0cnVlfX0=
const spec_64 = getCurrentInstance()?.proxy?.$route.query.spec || null;

let spec_error = false;
let spec = "{}";
try {
  if (typeof spec_64 === "string") spec = atob(spec_64);
} catch (e) {
  console.error(e);
  spec_error = true;
}
let specification: {
  fetch?: { url: string; headers: { [key: string]: string }; display: string };
  content?: {
    thank_you?: string;
    custom?: string;
    summary?: boolean;
    download?: boolean;
    silent_fetch?: boolean;
  };
} = {};
try {
  if (spec) specification = JSON.parse(spec);
} catch (e) {
  spec_error = true;
  console.error(e);
}

let uploadComplete: Ref<boolean> = ref(false);
let uploadStatus: Ref<number | undefined> = ref();

if (typeof specification?.fetch?.url === "string" && props.content) {
  fetch(specification?.fetch.url, {
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
}

let data_url: string = "";
if (specification?.content?.download) {
  const blob_part = JSON.stringify(props.content, null, 2);
  const blob = new Blob([blob_part], { type: "application/json" });
  data_url = window.URL.createObjectURL(blob);
}
</script>

<template>
  <div v-if="specification?.fetch?.url" class="sticky-top text-center">
    <p v-if="!uploadComplete" class="text-bg-info">
      Uploading to
      {{ specification.fetch.display || specification.fetch.url }}...
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
      !(typeof specification?.content === 'object') ||
      (typeof specification?.content === 'object' &&
        Object.keys(specification?.content) === ['silent_fetch'])
    "
    class="blank"
  >
    <p>Thank you for answering those questions.</p>
    <p>This is the end of the computerised interview.</p>
    <p>Please tell the researcher or clinician you have finished.</p>
  </div>
  <VueMarkdown
    v-if="specification?.content?.custom"
    class="custom"
    :source="specification?.content?.custom"
  />
  <div
    v-if="specification?.content?.summary"
    class="summary"
    v-html="props.content.summary"
  />
  <a
    v-if="specification?.content?.download"
    class="download"
    download="CIS-R.json"
    :href="data_url"
    ><button class="btn btn-primary">Download data</button></a
  >
</template>

<style scoped lang="scss"></style>
