import { IQuery } from "./types";
import { QueryFunc } from './query-part';
import { ArrayQueryProvider } from "./array-query-provider";

declare global {
    interface Array<T> extends IQuery<T> {
        asQueryable(): IQuery<T>;
        q(): IQuery<T>;
    }
}

Array.prototype.asQueryable = function() {
    return new ArrayQueryProvider(this).createQuery();
}
Array.prototype.q = Array.prototype.asQueryable;

function extendArray(func: string) {
    Array.prototype[func] = function () {
        const q = this.asQueryable();
        return q[func].apply(q, arguments);
    }
}

Object.getOwnPropertyNames(QueryFunc).forEach(extendArray);
