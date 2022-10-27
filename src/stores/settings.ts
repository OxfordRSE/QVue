import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    auto_continue: false,
    auto_continue_delay: 0.0,
  }),
});
