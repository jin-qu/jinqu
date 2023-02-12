import { Value } from "./shared";

// jinqu can also be used as an Http request provider

export interface QueryParameter { key: string; value: string; }

export const AjaxFuncs = {
    includeResponse: "includeResponse",
    options: "options",
};

export interface AjaxOptions {
    url?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    params?: QueryParameter[];
    data?: unknown;
    timeout?: number;
    headers?: { [key: string]: string };
}

export interface AjaxResponse<TResponse> {
    response: TResponse;
}

export interface IAjaxProvider<TResponse, TOptions extends AjaxOptions = AjaxOptions> {
    ajax<T>(options: TOptions): PromiseLike<Value<T> & AjaxResponse<TResponse>>;
}

export function mergeAjaxOptions(o1?: AjaxOptions | null, o2?: AjaxOptions | null): AjaxOptions {
    if (o1 == null) return o2;
    if (o2 == null) return o1;

    return {
        data: Object.assign({}, o1.data, o2.data),
        headers: Object.assign({}, o1.headers, o2.headers),
        method: o2.method || o1.method,
        params: (o1.params || []).concat(o2.params || []),
        timeout: o2.timeout || o1.timeout,
        url: o2.url || o1.url,
    };
}
