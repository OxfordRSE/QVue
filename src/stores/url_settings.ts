import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
type Header = { [key: string]: string };
type FetchOptions = {
  url: string;
  headers?: Header;
  display?: string;
  silent?: boolean;
};
type ContentOptions = {
  custom?: string;
  summary?: boolean;
  download?: boolean;
};
type DisplayOptions =
  | {
      banner_img_src: string;
      banner_href?: string;
      banner_img_alt?: string;
      banner_img_title?: string;
    }
  | {
      banner_text: string;
      banner_href?: string;
    };
export type URLOptions = {
  fetch?: FetchOptions;
  content?: ContentOptions;
  display?: DisplayOptions;
};

export const useURLStore = defineStore("url-settings", () => {
  const fetch: Ref<FetchOptions | null> = ref(null);
  const content: Ref<ContentOptions | null> = ref(null);
  const display: Ref<DisplayOptions | null> = ref(null);
  return { fetch, content, display };
});
