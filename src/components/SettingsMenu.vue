<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
// @ts-ignore
import CogIcon from "vue-material-design-icons/Cog.vue";
const settings = useSettingsStore();
</script>

<template>
  <div class="dropstart p-2">
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
      <li>
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
      <li>
        <div v-if="settings.auto_continue" class="d-flex align-content-center">
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
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}
.menu {
  min-width: 200px;
  padding: 1em;
  li:not(:last-child) {
    margin-bottom: 1em;
  }
}
</style>
