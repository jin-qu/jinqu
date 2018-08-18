import { IQuery } from "./types";
import { QueryFunc } from './query-part';
import { ArrayQueryProvider } from "./array-query-provider";

declare global {
    interface Array<T> extends IQuery<T> {
        asQueryable(): IQuery<T>;
        q(): IQuery<T>;
    }
}

Array.prototype.asQueryable = function () {
    return new ArrayQueryProvider(this).createQuery();
}
Array.prototype.q = Array.prototype.asQueryable;

function extendArray(func: string) {
    if (Array.prototype[func]) return;

    Array.prototype[func] = function () {
        const q = this.asQueryable();
        return q[func].apply(q, arguments);
    }
}

Object.getOwnPropertyNames(QueryFunc).forEach(extendArray);

declare global {
    interface ArrayConstructor {
        range(start: number, count: number);
        repeat(item: any, count: number);
    }
}

if (!Array.hasOwnProperty("range")) {
    Array.range = function*(start, count) {
        if (arguments.length == 0) return [];
        if (arguments.length == 1) {
            count = start;
            start = 0;
        }
        if (count < 0)
            throw new Error('Specified argument was out of the range of valid values');

        for (var i = 0; i < count; i++) 
            yield start + i;
    };
}

if (!Array.hasOwnProperty("repeat")) {
    Array.repeat = function*(item, count) {
        if (arguments.length == 0) return [];
        if (arguments.length == 1) {
            count = item;
            item = null;
        }
        if (count < 0)
            throw new Error('Specified argument was out of the range of valid values');

        for (var i = 0; i < count; i++)
            yield item;
    };
}
