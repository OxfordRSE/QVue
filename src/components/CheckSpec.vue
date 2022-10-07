<script setup lang="ts">
import {useURLStore, type URLOptions} from "@/stores/url_settings";
import {parseQuery} from "vue-router";

const store = useURLStore();

let spec_error = false;
try {
  const query = parseQuery(window.location.search);
  const spec_64 = query?.spec;
  if (typeof spec_64 === "string") {
    const spec = atob(spec_64);
    const json: URLOptions = JSON.parse(spec);
    store.display = json.display || store.display;
    store.content = json.content || store.content;
    store.fetch = json.fetch || store.fetch;
  }
} catch (e) {
  console.error(e);
  spec_error = true;
}
</script>

<template>
  <div v-if="spec_error" class="text-bg-warning p-2">
    There was an error interpreting the specification used to customise this website.<br />
    Please contact whoever provided you with the link to this website and inform them of this.
  </div>
</template>

<style scoped lang="scss"></style>
