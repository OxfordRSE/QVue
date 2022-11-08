import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export enum SettingState {
  DISABLED = -1,
  OFF,
  ON,
}

type Headers = { [key: string]: string };
type FetchOptions = {
  url: string;
  headers?: Headers;
  extra_body_content?: object;
  display?: string;
  silent?: boolean;
  data_policy?: string;
};
type OutputOptions = {
  custom?: string;
  summary?: boolean;
  download?: boolean;
};
type BrandingOptions =
  | {
      banner_markdown: string;
    }
  | {
      banner_text: string;
      banner_href?: string;
    }
  | {
      banner_img_src: string;
      banner_href?: string;
      banner_img_alt?: string;
      banner_img_title?: string;
    };
type SettingsOptions = {
  keyboard_shortcuts: SettingState;
  auto_continue: SettingState;
  auto_continue_delay: Number;
};
export type URLOptions = {
  settings?: SettingsOptions;
  fetch?: FetchOptions;
  output?: OutputOptions;
  branding?: BrandingOptions;
};

export const useURLStore = defineStore("url-settings", () => {
  const fetch: Ref<FetchOptions | null> = ref(null);
  const output: Ref<OutputOptions | null> = ref(null);
  const branding: Ref<BrandingOptions | null> = ref(null);
  const settings: Ref<SettingsOptions | null> = ref(null);
  return { fetch, output, branding, settings };
});
