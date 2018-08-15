import { tokenize, Expression, evaluate } from 'jokenizer';

export class QueryPart {

    constructor(private _type: string, private _args?: any[], private _scopes: any[] = []) {
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

    static create(type: string, args: any[], scopes?: any[]) {
        return new QueryPart(type, args, scopes);
    }

    static where<T>(predicate: (i: T) => boolean | string, scopes: any[]) {
        return this.create(QueryPartType.where, [predicate], scopes);
    }

    static ofType<TResult>(type: new (...args) => TResult) {
        return this.create(QueryPartType.ofType, [type]);
    }

    static cast<TResult>(type: new (...args) => TResult) {
        return this.create(QueryPartType.cast, [type]);
    }

    static select<T, TResult = any>(selector: (i: T) => TResult | string, scopes: any[]) {
        return this.create(QueryPartType.cast, [selector], scopes);
    }

    static selectMany<T, TResult = any>(selector: (i: T) => Array<TResult> | string, scopes: any[]) {
        return this.create(QueryPartType.selectMany, [selector], scopes);
    }

    static join<T, TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: TOther) => TResult | string, scopes: any[]) {
        return this.create(QueryPartType.join, [other, thisKey, otherKey, selector], scopes);
    }

    static groupJoin<T, TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: Array<TOther>) => TResult | string, ...scopes) {
        return this.create(QueryPartType.groupJoin, [other, thisKey, otherKey, selector], scopes);
    }

    static orderBy<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryPartType.orderBy, [keySelector], scopes);
    }

    static orderByDescending<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryPartType.orderBy, [keySelector], scopes);
    }

    static thenBy<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryPartType.thenBy, [keySelector], scopes);
    }

    static thenByDescending<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryPartType.thenByDescending, [keySelector], scopes);
    }
}

export const QueryPartType = {
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
