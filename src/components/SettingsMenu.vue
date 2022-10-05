<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
const settings = useSettingsStore();
</script>

<template>
  <button
    class="btn btn-outline-light border-0"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#collapseMenu"
    aria-expanded="false"
    aria-controls="collapseMenu"
  >
    &#9881;
  </button>
  <div class="collapse w-100 justify-content-end" id="collapseMenu">
    <div class="card card-body flex-grow-0 justify-content-end">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="auto-continue"
          v-model="settings.auto_continue"
        />
        <label class="form-check-label" for="auto-continue">Auto-continue</label>
      </div>
      <div v-if="settings.auto_continue" class="d-flex">
        <input type="range" class="form-range" min="0" max="5" step="0.25" id="auto-continue-range" v-model="settings.auto_continue_delay">
        <label for="auto-continue-range" class="form-label" style="width: 5em;">{{settings.auto_continue_delay}}s</label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.collapse.show, .collapsing {
  display: flex;
}
</style>
