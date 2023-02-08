import { ArrayQueryProvider } from "./lib/array-query-provider";
import { Ctor, IQuery } from "./lib/shared";

declare global {
    interface Array<T> {
        asQueryable(ctor?: Ctor<T>): IQuery<T>;
    }
}

Array.prototype.asQueryable = function(ctor: Ctor<unknown>) {
    const query = new ArrayQueryProvider(this).createQuery();
    return ctor ? query.cast(ctor) : query;
};

export * from "./lib/ajax";
export * from "./lib/array-query-provider";
export * from "./lib/query-part";
export * from "./lib/query";
export * from "./lib/shared";
