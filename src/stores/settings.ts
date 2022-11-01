import { defineStore } from "pinia";
import { SettingState} from "@/stores/url_settings";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    keyboard_shortcuts: SettingState.OFF,
    auto_continue: SettingState.OFF,
    auto_continue_delay: 0.5,
  }),
});
