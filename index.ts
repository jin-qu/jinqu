import { IQuery } from './lib/types';
import { ArrayQueryProvider } from './lib/array-query-provider';

export * from './lib/ajax';
export * from './lib/array-extensions';
export * from './lib/array-query-provider';
export * from './lib/query-part';
export * from './lib/queryable';
export * from './lib/types';

declare global {
    interface Array<T> {
        asQueryable(): IQuery<T>;
    }
}

Array.prototype.asQueryable = function () {
    return new ArrayQueryProvider(this).createQuery();
}
