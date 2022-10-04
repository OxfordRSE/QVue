<script setup lang="ts">
import { getCurrentInstance, ref, type Ref } from "vue";

export interface Props {
  content: Object;
}

const props = withDefaults(defineProps<Props>(), {});

// Parse a URL with d, t, a query params (base64 encoded)
// e.g. http://localhost:5173/CIS-R/?c=c3VtbWFyeSxkb3dubG9hZA==&d=VGVzdCBFbmRwb2ludA==&t=aHR0cHM6Ly9sb2NhbGhvc3Qvc2VudHJ5X2VuZHBvaW50Lw==&a=eyJ0b2tlbiI6IlBUTi0xMDIiLCJhdXRob3JpemF0aW9uIjoiYmVhcmVyIHRtcF90a25fMDAwMDEifQ==
const content_64 = getCurrentInstance()?.proxy?.$route.query.c || {};
const destination_64 = getCurrentInstance()?.proxy?.$route.query.d || null;
const target_64 = getCurrentInstance()?.proxy?.$route.query.t || null;
const auth_64 = getCurrentInstance()?.proxy?.$route.query.h || {};

const content = typeof content_64 === "string" ? atob(content_64) : null;
const destination =
  typeof destination_64 === "string" ? atob(destination_64) : null;
const target = typeof target_64 === "string" ? atob(target_64) : null;
const auth_str = typeof auth_64 === "string" ? atob(auth_64) : null;
let auth = null;
try {
  if (auth_str) auth = JSON.parse(auth_str);
} catch (e) {
  console.error(e);
}

let uploadComplete: Ref<boolean> = ref(false);
let uploadStatus: Ref<number | undefined> = ref();

if (typeof target === "string" && props.content) {
  fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
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

const content_list: string[] = [];
if (content) {
  content.split(",").forEach((s) => content_list.push(s));
}
</script>

<template>
  <div v-if="target" class="sticky-top text-center">
    <p v-if="!uploadComplete" class="text-bg-info">
      Uploading to {{ destination || target }}...
    </p>
    <p v-else-if="uploadStatus !== 200" class="text-bg-danger">
      Error uploading results to {{ destination || target }}.<br />
      You may wish to try downloading your results and sending them yourself.
    </p>
    <p v-else class="text-bg-success">Upload complete!</p>
  </div>
  <div
    v-if="content_list.includes('summary')"
    class="summary"
    v-html="props.content.summary"
  />
  <div
    v-if="content_list.includes('download')"
    class="download"
  >Download link...</div>
</template>

<style scoped lang="scss"></style>
