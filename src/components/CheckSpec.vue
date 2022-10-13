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
    console.log(json);
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
  <div v-if="false" class="d-flex flex-column">
    <div class="form-text d-flex">
      <input
        class="form-check-input flex-grow-1"
        type="text"
        id="banner_html"
        v-model="store.display.banner_html"
      />
      <label class="form-text-label" for="banner_html"
      >Banner HTML</label
      >
    </div>
    <div>
      <input type="text" class="w-100" :value="JSON.stringify({display: store.display, fetch: store.fetch, content: store.content})"/>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
