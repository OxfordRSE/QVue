import { defineStore } from "pinia";
import { ref } from "vue";
export var SettingState;
(function (SettingState) {
    SettingState[SettingState["DISABLED"] = -1] = "DISABLED";
    SettingState[SettingState["OFF"] = 0] = "OFF";
    SettingState[SettingState["ON"] = 1] = "ON";
})(SettingState || (SettingState = {}));
export const useURLStore = defineStore("url-settings", () => {
    const fetch = ref(null);
    const output = ref(null);
    const branding = ref(null);
    const settings = ref(null);
    return { fetch, output, branding, settings };
});
