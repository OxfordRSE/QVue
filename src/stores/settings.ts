import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    auto_continue: true,
    auto_continue_delay: 0.5,
  }),
});
