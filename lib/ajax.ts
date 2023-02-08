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

export interface IAjaxProvider<TResponse> {
    ajax<T>(options: AjaxOptions): PromiseLike<Value<T> & AjaxResponse<TResponse>>;
}

export interface IRequestProvider<TOptions extends AjaxOptions> {
    request<TResult>(prms: QueryParameter[], options: TOptions[]): PromiseLike<TResult>;
}

export function mergeAjaxOptions(o1?: AjaxOptions | null, o2?: AjaxOptions | null): AjaxOptions {
    if (o1 == null) return o2;
    if (o2 == null) return o1;

    return {
        data: o1.data ? (o2.data ? Object.assign({}, o1.data, o2.data) : o1.data) : o2.data,
        headers: o1.headers ? Object.assign({}, o1.headers, o2.headers) : o2.headers,
        method: o2.method || o1.method,
        params: (o1.params || []).concat(o2.params || []),
        timeout: o2.timeout || o1.timeout,
        url: o2.url || o1.url,
    };
}
