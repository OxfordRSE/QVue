import { type Ref } from "vue";
export declare enum SettingState {
    DISABLED = -1,
    OFF = 0,
    ON = 1
}
declare type Headers = {
    [key: string]: string;
};
declare type FetchOptions = {
    url: string;
    headers?: Headers;
    display?: string;
    silent?: boolean;
    data_policy?: string;
};
declare type OutputOptions = {
    custom?: string;
    summary?: boolean;
    download?: boolean;
};
declare type BrandingOptions = {
    banner_markdown: string;
} | {
    banner_text: string;
    banner_href?: string;
} | {
    banner_img_src: string;
    banner_href?: string;
    banner_img_alt?: string;
    banner_img_title?: string;
};
declare type SettingsOptions = {
    keyboard_shortcuts: SettingState;
    auto_continue: SettingState;
    auto_continue_delay: Number;
};
export declare type URLOptions = {
    settings?: SettingsOptions;
    fetch?: FetchOptions;
    output?: OutputOptions;
    branding?: BrandingOptions;
};
export declare const useURLStore: import("pinia").StoreDefinition<"url-settings", import("pinia")._UnwrapAll<Pick<{
    fetch: Ref<FetchOptions | null>;
    output: Ref<OutputOptions | null>;
    branding: Ref<BrandingOptions | null>;
    settings: Ref<SettingsOptions | null>;
}, "fetch" | "output" | "branding" | "settings">>, Pick<{
    fetch: Ref<FetchOptions | null>;
    output: Ref<OutputOptions | null>;
    branding: Ref<BrandingOptions | null>;
    settings: Ref<SettingsOptions | null>;
}, never>, Pick<{
    fetch: Ref<FetchOptions | null>;
    output: Ref<OutputOptions | null>;
    branding: Ref<BrandingOptions | null>;
    settings: Ref<SettingsOptions | null>;
}, never>>;
export {};
