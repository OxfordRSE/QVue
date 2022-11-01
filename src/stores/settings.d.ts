import { SettingState } from "@/stores/url_settings";
export declare const useSettingsStore: import("pinia").StoreDefinition<"settings", {
    keyboard_shortcuts: SettingState;
    auto_continue: SettingState;
    auto_continue_delay: number;
}, {}, {}>;
