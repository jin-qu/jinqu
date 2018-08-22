import { IQuery } from "./types";
import { QueryFunc } from './query-part';
import { ArrayQueryProvider } from "./array-query-provider";

declare global {
    interface Array<T> extends IQuery<T> {
        q(): IQuery<T>;
    }
}

Array.prototype.q = function() {
    return new ArrayQueryProvider(this).createQuery();
};

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
        range(start: number, count: number): IterableIterator<number>;
        range(count: number): IterableIterator<number>;
        repeat<T = any>(item: T, count: number): IterableIterator<T>;
    }
}

if (!Array.hasOwnProperty("range")) {
    Array.range = function*(start?: number, count?: number) {
        if (count == null) {
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
        if (count < 0)
            throw new Error('Specified argument was out of the range of valid values');

        for (var i = 0; i < count; i++)
            yield item;
    };
}
