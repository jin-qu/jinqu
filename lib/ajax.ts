// jinqu can also be used as an Http request provider

export type QueryParameter = { key: string; value: string };

export const AjaxFuncs = {
    options: 'options'
};

export interface AjaxOptions {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: QueryParameter[];
    data?: any;
    timeout?: number;
    headers?: { [key: string]: string };
    includeResponse?: boolean;
}

export interface IRequestProvider<TOptions extends AjaxOptions, TAttachedInfo = {}> {
    request<TResult>(prms: QueryParameter[], options: TOptions[]): PromiseLike<TResult & TAttachedInfo>;
}

export interface IAjaxProvider<TAttachedInfo = {}> {
    ajax<TResult>(options: AjaxOptions): PromiseLike<TResult & TAttachedInfo>;
}

export function mergeAjaxOptions(o1: AjaxOptions, o2: AjaxOptions): AjaxOptions {
    if (o1 == null) return o2;
    if (o2 == null) return o1;
    
    return {
        data: o1.data ? (o2.data ? Object.assign({}, o1.data, o2.data) : o1.data) : o2.data,
        headers: o1.headers ? Object.assign({}, o1.headers, o2.headers) : o2.headers,
        method: o2.method || o1.method,
        params: (o1.params || []).concat(o2.params || []),
        timeout: o2.timeout || o1.timeout,
        url: o2.url || o1.url,
        includeResponse: o2.includeResponse != null ? o2.includeResponse : o1.includeResponse
    };
}
