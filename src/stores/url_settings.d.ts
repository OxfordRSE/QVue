import { type Ref } from "vue";
declare type Header = {
    [key: string]: string;
};
declare type FetchOptions = {
    url: string;
    headers?: Header;
    display?: string;
    silent?: boolean;
};
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
    fetch: Ref<FetchOptions | null>;
    content: Ref<ContentOptions | null>;
    display: Ref<DisplayOptions | null>;
}, "fetch" | "content" | "display">>, Pick<{
    fetch: Ref<FetchOptions | null>;
    content: Ref<ContentOptions | null>;
    display: Ref<DisplayOptions | null>;
}, never>, Pick<{
    fetch: Ref<FetchOptions | null>;
    content: Ref<ContentOptions | null>;
    display: Ref<DisplayOptions | null>;
}, never>>;
export {};
