import find = require('array.prototype.find');
find.shim();

import 'es6-object-assign/auto';
import 'es6-promise/auto';
import 'es6-symbol/implement';
import ArrayIterator = require('es6-iterator/array');
if (![][Symbol.iterator]) {
    Array.prototype[Symbol.iterator] = function() {
        return new ArrayIterator(this);
    }
}
import arrayFrom = require('array-from');
if (!Array.from) {
    Array.from = arrayFrom;
}

import { IQuery, Ctor } from './lib/shared';
import { ArrayQueryProvider } from './lib/array-query-provider';
import './lib/array-extensions';

export * from './lib/ajax';
export * from './lib/array-extensions';
export * from './lib/array-query-provider';
export * from './lib/query-part';
export * from './lib/query';
export * from './lib/shared';

declare global {
    interface Array<T> {
        asQueryable(ctor?: Ctor<T>): IQuery<T>;
    }
}

Array.prototype.asQueryable = function (ctor: Ctor<any>) {
    const query = new ArrayQueryProvider(this).createQuery();
    return ctor ? query.cast(ctor) : query;
}
