import { IGrouping } from './common';

export class QueryPart {

    constructor(private _type: string, private _args: any[] = [], private _scopes: any[] = []) {
        if (!_type) throw new Error('Type of QueryPart cannot be null or empty.');
    }

    get type() {
        return this._type;
    }

    get args() {
        return this._args;
    }

    get scopes() {
        return this._scopes;
    }

    static create(type: string, args?: any[], scopes?: any[]) {
        return new QueryPart(type, args, scopes);
    }

    static where<T>(predicate: (i: T) => boolean | string, scopes: any[]) {
        return this.create(QueryFunc.where, [predicate], scopes);
    }

    static ofType<TResult>(type: new (...args) => TResult) {
        return this.create(QueryFunc.ofType, [type]);
    }

    static cast<TResult>(type: new (...args) => TResult) {
        return this.create(QueryFunc.cast, [type]);
    }

    static select<T, TResult = any>(selector: (i: T) => TResult | string, scopes: any[]) {
        return this.create(QueryFunc.cast, [selector], scopes);
    }

    static selectMany<T, TResult = any>(selector: (i: T) => Array<TResult> | string, scopes: any[]) {
        return this.create(QueryFunc.selectMany, [selector], scopes);
    }

    static join<T, TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: TOther) => TResult | string, scopes: any[]) {
        return this.create(QueryFunc.join, [other, thisKey, otherKey, selector], scopes);
    }

    static groupJoin<T, TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: Array<TOther>) => TResult | string, scopes: any[]) {
        return this.create(QueryFunc.groupJoin, [other, thisKey, otherKey, selector], scopes);
    }

    static orderBy<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryFunc.orderBy, [keySelector], scopes);
    }

    static orderByDescending<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryFunc.orderBy, [keySelector], scopes);
    }

    static thenBy<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryFunc.thenBy, [keySelector], scopes);
    }

    static thenByDescending<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryFunc.thenByDescending, [keySelector], scopes);
    }

    static take(count: number) {
        return this.create(QueryFunc.take, [count]);
    }

    static takeWhile<T>(predicate: (i: T) => boolean | string, scopes: any[]) {
        return this.create(QueryFunc.takeWhile, [predicate], scopes)
    }

    static skip(count: number) {
        return this.create(QueryFunc.skip, [count]);
    }

    static skipWhile<T>(predicate: (i: T) => boolean | string, scopes: any[]) {
        return this.create(QueryFunc.skipWhile, [predicate], scopes)
    }

    static groupBy<T, TResult = any, TKey = any>(keySelector: (item: T) => TKey | string, valueSelector: (group: IGrouping<T, TKey>) => TResult | string, scopes: any[]) {
        return this.create(QueryFunc.groupBy, [keySelector, valueSelector], scopes);
    }

    static distinct(comparer?: (x, y) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.distinct, comparer ? [comparer] : null, scopes);
    }

    static concat<T>(other: Array<T> | string, scopes: any[]) {
        return this.create(QueryFunc.concat, [other], scopes);
    }

    static zip<T, TOther, TResult = any>(other: Array<TOther>, selector: (item: T, other: TOther) => TResult | string, scopes: any[]) {
        return this.create(QueryFunc.zip, [other, selector], scopes);
    }

    static union<T>(other: Array<T> | string, scopes: any[]) {
        return this.create(QueryFunc.union, [other], scopes);
    }

    static intersect<T>(other: Array<T> | string, scopes: any[]) {
        return this.create(QueryFunc.intersect, [other], scopes);
    }

    static except<T>(other: Array<T> | string, scopes: any[]) {
        return this.create(QueryFunc.except, [other], scopes);
    }

    static defaultIfEmpty() {
        return this.create(QueryFunc.defaultIfEmpty);
    }

    static reverse() {
        return this.create(QueryFunc.reverse);
    }

    static first<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.first, predicate ? [predicate] : null, scopes);
    }

    static firstOrDefault<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.firstOrDefault, [predicate], scopes);
    }

    static last<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.last, predicate ? [predicate] : null, scopes);
    }

    static lastOrDefault<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.lastOrDefault, predicate ? [predicate] : null, scopes);
    }

    static single<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.single, predicate ? [predicate] : null, scopes);
    }

    static singleOrDefault<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.singleOrDefault, predicate ? [predicate] : null, scopes);
    }

    static elementAt(index: number) {
        return this.create(QueryFunc.elementAt, [index]);
    }

    static elementAtOrDefault(index: number) {
        return this.create(QueryFunc.elementAtOrDefault, [index]);
    }

    static contains<T>(item: T) {
        return this.create(QueryFunc.contains, [item]);
    }

    static sequenceEqual<T>(other: Array<T> | string, scopes: any[]) {
        return this.create(QueryFunc.sequenceEqual, [other], scopes);
    }

    static any<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.any, predicate ? [predicate] : null, scopes);
    }

    static all<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.all, predicate ? [predicate] : null, scopes);
    }

    static count<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.count, predicate ? [predicate] : null, scopes);
    }

    static min<T>(selector?: (i: T) => T | string, scopes?: any[]) {
        return this.create(QueryFunc.min, selector ? [selector] : null, scopes);
    }

    static max<T>(selector?: (i: T) => T | string, scopes?: any[]) {
        return this.create(QueryFunc.max, selector ? [selector] : null, scopes);
    }

    static sum<T>(selector?: (i: T) => number | string, scopes?: any[]) {
        return this.create(QueryFunc.sum, selector ? [selector] : null, scopes);
    }

    static average<T>(selector?: (i: T) => number | string, scopes?: any[]) {
        return this.create(QueryFunc.average, selector ? [selector] : null, scopes);
    }

    static aggregate<T, TAccumulate = any, TResult = TAccumulate>(func: (aggregate: TAccumulate, item: T) => TAccumulate | string, seed?: TAccumulate,
        selector?: (acc: TAccumulate) => TResult, scopes?: any[]) {
        return this.create(QueryFunc.aggregate, selector ? [func, seed, selector] : null, scopes);
    }
}

export const QueryFunc = {
    where: 'where',
    ofType: 'ofType',
    cast: 'cast',
    select: 'select',
    selectMany: 'selectMany',
    join: 'join',
    groupJoin: 'groupJoin',
    orderBy: 'orderBy',
    orderByDescending: 'orderByDescending',
    thenBy: 'thenBy',
    thenByDescending: 'thenByDescending',
    take: 'take',
    takeWhile: 'takeWhile',
    skip: 'skip',
    skipWhile: 'skipWhile',
    groupBy: 'groupBy',
    distinct: 'distinct',
    concat: 'concat',
    zip: 'zip',
    union: 'union',
    intersect: 'intersect',
    except: 'except',
    first: 'first',
    firstOrDefault: 'firstOrDefault',
    last: 'last',
    lastOrDefault: 'lastOrDefault',
    single: 'single',
    singleOrDefault: 'singleOrDefault',
    elementAt: 'elementAt',
    elementAtOrDefault: 'elementAtOrDefault',
    defaultIfEmpty: 'defaultIfEmpty',
    contains: 'contains',
    reverse: 'reverse',
    sequenceEqual: 'sequenceEqual',
    any: 'any',
    all: 'all',
    count: 'count',
    min: 'min',
    max: 'max',
    sum: 'sum',
    average: 'average',
    aggregate: 'aggregate'
};
