import { IQuery, Ctor } from './lib/types';
import { ArrayQueryProvider } from './lib/array-query-provider';
import './lib/array-extensions';

export * from './lib/ajax';
export * from './lib/array-extensions';
export * from './lib/array-query-provider';
export * from './lib/query-part';
export * from './lib/query';
export * from './lib/types';

declare global {
    interface Array<T> {
        asQueryable(ctor?: Ctor<T>): IQuery<T>;
    }
}

Array.prototype.asQueryable = function (ctor: Ctor<any>) {
    const query = new ArrayQueryProvider(this).createQuery();
    return ctor ? query.cast(ctor) : query;
}
