import { Value, Result } from "./shared";

// jinqu can also be used as an Http request provider

export type QueryParameter = { key: string; value: string };

export const AjaxFuncs = {
    options: 'options',
    includeResponse: 'includeResponse'
};

export interface AjaxOptions {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: QueryParameter[];
    data?: any;
    timeout?: number;
    headers?: { [key: string]: string };
}

export interface AjaxResponse<TResponse> {
    response: TResponse;
}

export interface IAjaxProvider<TResponse = any> {
    ajax<T>(options: AjaxOptions): PromiseLike<Value<T> & AjaxResponse<TResponse>>;
}

export interface IRequestProvider<TOptions extends AjaxOptions> {
    request<TResult, TExtra = {}>(prms: QueryParameter[], options: TOptions[]): PromiseLike<Result<TResult, TExtra>>;
}

export function mergeAjaxOptions(o1: AjaxOptions, o2: AjaxOptions): AjaxOptions {
    if (o1 == null) return o2;
    if (o2 == null) return o1;
    
    return {
        url: o2.url || o1.url,
        method: o2.method || o1.method,
        params: (o1.params || []).concat(o2.params || []),
        data: o1.data ? (o2.data ? Object.assign({}, o1.data, o2.data) : o1.data) : o2.data,
        timeout: o2.timeout || o1.timeout,
        headers: o1.headers ? Object.assign({}, o1.headers, o2.headers) : o2.headers
    };
}
