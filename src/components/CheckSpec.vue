<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import { SettingState, type URLOptions, useURLStore } from "@/stores/url_settings";
import { parseQuery } from "vue-router";
import { storeToRefs } from "pinia";

const store = useURLStore();
const settings = storeToRefs(useSettingsStore());

let spec_error = false;
try {
  const query = parseQuery(window.location.search);
  const spec_64 = query?.spec;
  if (typeof spec_64 === "string") {
    const spec = atob(spec_64);
    const safe = decodeURI(spec);
    const json: URLOptions = JSON.parse(safe);
    console.log(json);
    store.branding = json.branding || store.branding;
    store.output = json.output || store.output;
    store.fetch = json.fetch || store.fetch;
    // Settings
    if (json.settings) {
      if (json.settings.keyboard_shortcuts in SettingState)
        settings.keyboard_shortcuts.value = json.settings.keyboard_shortcuts;
      // if (json.settings.auto_continue in SettingState)
      //   settings.auto_continue.value = json.settings.auto_continue;
      // if (typeof json.settings.auto_continue_delay === "number")
      //   settings.auto_continue_delay.value = json.settings.auto_continue_delay;
    }
  }
} catch (e) {
  console.error(e);
  spec_error = true;
}
</script>

<template>
  <div v-if="spec_error" class="text-bg-warning p-2">
    There was an error interpreting the specification used to customise this
    website.<br />
    Please contact whoever provided you with the link to this website and inform
    them of this.
  </div>
  <div v-if="false" class="d-flex flex-column">
    <div>
      <input
        type="text"
        class="w-100"
        :value="
          JSON.stringify({
            display: store.display,
            fetch: store.fetch,
            content: store.content,
          })
        "
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
