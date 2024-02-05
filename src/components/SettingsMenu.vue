<script setup lang="ts">
import {SettingState} from "@/stores/url_settings";
import { useSettingsStore } from "@/stores/settings";
// @ts-ignore
import CogIcon from "vue-material-design-icons/Cog.vue";
import {
  computed
} from "vue";
const settings = useSettingsStore();
// Code below goes in any file that needs to use the i18n library
import queryString from "query-string";
import { I18n } from "i18n-js";
import translations from "../i18n.json"; // adapt as necessary for src/i18n.json

const i18n = new I18n(translations);
const parsed = queryString.parse(location.search);
if (parsed?.locale) i18n.locale = String(parsed.locale).toLowerCase();
// End of i18n setup

const enabled = computed(() => {
  return settings.keyboard_shortcuts !== SettingState.DISABLED ||
    settings.auto_continue !== SettingState.DISABLED
})
</script>

<template>
  <div class="dropstart ps-2 pb-2" :class="enabled ? '' : 'd-none'">
    <button
      class="btn btn-light"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      aria-controls="dropdown-menu"
    >
      <CogIcon title="Settings" />
    </button>
    <ul class="dropdown-menu menu">
      <li v-if="settings.keyboard_shortcuts !== SettingState.DISABLED">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="keyboard-shortcuts"
            v-model="settings.keyboard_shortcuts"
          />
          <label class="form-check-label" for="keyboard-shortcuts"
            >Keyboard shortcuts</label
          >
        </div>
      </li>
      <li v-if="settings.auto_continue !== SettingState.DISABLED">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="auto-continue"
            v-model="settings.auto_continue"
          />
          <label class="form-check-label" for="auto-continue"
            >Auto-continue</label
          >
        </div>
      </li>
      <li v-if="settings.auto_continue === SettingState.ON || settings.auto_continue === true">
        <div class="d-flex align-content-center">
          Wait
          <input
            type="range"
            class="form-range px-2"
            min="0"
            max="5"
            step="0.25"
            id="auto-continue-range"
            v-model="settings.auto_continue_delay"
            :disabled="!settings.auto_continue"
          />
          <label for="auto-continue-range" class="form-label my-0" style="width: 5em"
            >{{ settings.auto_continue_delay }}s</label>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.dropstart {
  z-index: 10;
}
.menu {
  min-width: 200px;
  padding: 1em;
  li:not(:last-child) {
    margin-bottom: 1em;
  }
}
</style>
