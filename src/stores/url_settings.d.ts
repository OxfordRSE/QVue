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
    banner_img_src: string;
    banner_href?: string;
    banner_img_alt?: string;
    banner_img_title?: string;
} | {
    banner_text: string;
    banner_href?: string;
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
    questionnaires: Ref<any>;
}, "fetch" | "content" | "display" | "questionnaires">>, Pick<{
    fetch: Ref<FetchOptions | null>;
    content: Ref<ContentOptions | null>;
    display: Ref<DisplayOptions | null>;
    questionnaires: Ref<any>;
}, never>, Pick<{
    fetch: Ref<FetchOptions | null>;
    content: Ref<ContentOptions | null>;
    display: Ref<DisplayOptions | null>;
    questionnaires: Ref<any>;
}, never>>;
export {};
