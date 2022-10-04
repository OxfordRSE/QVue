<script setup lang="ts">
import { getCurrentInstance, ref, type Ref } from "vue";

export interface Props {  content: Object; }

const props = withDefaults(defineProps<Props>(), {});

const destination =
  getCurrentInstance()?.proxy?.$route.query.destination || null;
const target = getCurrentInstance()?.proxy?.$route.query.target || null;
const auth = getCurrentInstance()?.proxy?.$route.query.auth || {};

let uploadComplete: Ref<boolean> = ref(false);
let uploadStatus: Ref<number | undefined> = ref();

if (typeof target === "string" && props.content) {
  fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
    body: JSON.stringify(props.content)
  })
    .then(r => {
      uploadComplete.value = true;
      uploadStatus.value = r.status;
    })
}
</script>

<template>
  <div v-if="target" class="toast text-center">
    <p v-if="!uploadComplete" class="text-info text-bg-info">
      Uploading to {{ destination || target }}...
    </p>
    <p v-else-if="uploadStatus !== 200" class="text-danger text-bg-danger">
      Error uploading results to {{ destination || target }}.<br />
      You may wish to try downloading your results and sending them yourself.
    </p>
    <p v-else class="text-success text-bg-success">Upload complete!</p>
  </div>
  <div class="summary" v-html="props.content.summary"></div>
</template>

<style scoped lang="scss">
</style>
