import { IQuery } from "./types";
import { QueryFunc } from './query-part';
import { Query } from "./queryable";
import { ArrayQueryProvider } from "./array-query-provider";

declare global {
    interface Array<T> extends IQuery<T> {
        asQueryable(): IQuery<T>;
        q(): IQuery<T>;
    }
}

Array.prototype.asQueryable = function() {
    return new Query(new ArrayQueryProvider());
}
Array.prototype.q = Array.prototype.asQueryable;

function extendArray(func: string) {
    Array.prototype.where = function () {
        return this.asQueryable()[func].apply(this, arguments);
    }
}

Object.getOwnPropertyNames(QueryFunc).forEach(extendArray);
