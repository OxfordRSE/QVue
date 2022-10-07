import { type Ref } from "vue";
declare type Header = {
    [key: string]: string;
};
declare type FetchOptions = {
    url: string;
    headers?: Header;
    display?: string;
    silent?: boolean;
} | null;
declare type ContentOptions = {
    custom?: string;
    summary?: boolean;
    download?: boolean;
};
declare type DisplayOptions = {
    banner_html?: string;
};
export declare type URLOptions = {
    fetch?: FetchOptions;
    content?: ContentOptions;
    display?: DisplayOptions;
};
export declare const useURLStore: import("pinia").StoreDefinition<"url-settings", import("pinia")._UnwrapAll<Pick<{
    fetch: Ref<FetchOptions>;
    content: Ref<ContentOptions>;
    display: Ref<DisplayOptions>;
}, "fetch" | "content" | "display">>, Pick<{
    fetch: Ref<FetchOptions>;
    content: Ref<ContentOptions>;
    display: Ref<DisplayOptions>;
}, never>, Pick<{
    fetch: Ref<FetchOptions>;
    content: Ref<ContentOptions>;
    display: Ref<DisplayOptions>;
}, never>>;
export {};
