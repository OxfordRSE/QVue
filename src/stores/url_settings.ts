import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
type Header = { [key: string]: string };
type FetchOptions = {
  url: string;
  headers?: Header;
  display?: string;
  silent?: boolean;
} | null;
type ContentOptions = {
  custom?: string;
  summary?: boolean;
  download?: boolean;
};
type DisplayOptions = {
  banner_html?: string;
};
export type URLOptions = {
  fetch?: FetchOptions;
  content?: ContentOptions;
  display?: DisplayOptions;
};

export const useURLStore = defineStore("url-settings", () => {
  const fetch: Ref<FetchOptions> = ref(null);
  const content: Ref<ContentOptions> = ref({});
  const display: Ref<DisplayOptions> = ref({ banner_html: "<h1>CIS-R</h1>"});
  return { fetch, content, display };
});