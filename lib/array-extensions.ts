import { IQuery, IQuerySafe, Func1, Func2 } from "./types";
import { QueryFunc } from './query-part';
import { ArrayQueryProvider } from "./array-query-provider";

declare global {
    interface Array<T> extends IQuerySafe<T> {
        q(): IQuery<T>;
        joinWith<TOther, TResult = any, TKey = any>(other: Array<TOther> | string, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
            selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult>;
        concatWith(other: Array<T> | string, ...scopes): IQuery<T>;
    }
}

Array.prototype.q = function () {
    return new ArrayQueryProvider(this).createQuery();
};

function extendArray(func: string) {
    const f = func === 'join' || func === 'concat' ? func + 'With' : func;
     
    if (Array.prototype[f]) return;

    Array.prototype[f] = function () {
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
    Array.range = function* (start?: number, count?: number) {
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
    Array.repeat = function* (item, count) {
        if (count < 0)
            throw new Error('Specified argument was out of the range of valid values');

        for (var i = 0; i < count; i++)
            yield item;
    };
}
