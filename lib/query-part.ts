import { Expression, tokenize, evaluate } from 'jokenizer';
import { IGrouping, IPartArgument, IQueryPart } from './types';

export class PartArgument implements IPartArgument {

    constructor(identifier: Function | string, literal?) {
        if (typeof identifier === 'string') {
            this._func = null;
            this._expStr = identifier;
        }
        else {
            this._func = identifier;
            this._expStr = null;
        }
        this._literal = literal;
    }

    private _func: Function;
    get func() {
        if (this._func != null) return this._func;

        return this.exp ? (this._func = (scopes: []) => evaluate(this.exp, scopes)) : null;
    }

    private _expStr;
    get expStr() {
        if (this._expStr != null) return this._expStr;

        return this.func ? (this._expStr = this.func.toString()) : null;
    }

    private _exp: Expression;
    get exp() {
        if (this._exp != null) return this._exp;

        return this.expStr ? (this._exp = tokenize(this.expStr)) : null;
    }

    private _literal;
    get literal() {
        return this._literal;
    }

    static identifier(value: Function | string) {
        return new PartArgument(value);
    }

    static literal(value) {
        return new PartArgument(null, value);
    }
}

function identifier(value: Function | string) {
    return PartArgument.identifier(value);
}

function literal(value) {
    return PartArgument.literal(value);
}


export class QueryPart implements IQueryPart {

    constructor(type: string, args: IPartArgument[] = [], scopes: any[] = []) {
        if (!type) throw new Error('Type of QueryPart cannot be null or empty.');

        this._type = type;
        this._args = args;
        this._type = type;
        this._scopes = scopes;
    }

    private readonly _type: string;
    get type() {
        return this._type;
    }

    private readonly _args: IPartArgument[];
    get args() {
        return this._args;
    }

    private readonly _scopes: any[];
    get scopes() {
        return this._scopes;
    }

    static create(type: string, args?: PartArgument[], scopes?: any[]) {
        return new QueryPart(type, args, scopes);
    }

    static where<T>(predicate: (i: T) => boolean | string, scopes: any[]) {
        return this.create(QueryFunc.where, [identifier(predicate)], scopes);
    }

    static ofType<TResult>(type: new (...args) => TResult) {
        return this.create(QueryFunc.ofType, [literal(type)]);
    }

    static cast<TResult>(type: new (...args) => TResult) {
        return this.create(QueryFunc.cast, [literal(type)]);
    }

    static select<T, TResult = any>(selector: (i: T) => TResult | string, scopes: any[]) {
        return this.create(QueryFunc.cast, [identifier(selector)], scopes);
    }

    static selectMany<T, TResult = any>(selector: (i: T) => Array<TResult> | string, scopes: any[]) {
        return this.create(QueryFunc.selectMany, [identifier(selector)], scopes);
    }

    static joinWith<T, TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: TOther) => TResult | string, scopes: any[]) {
        return this.create(QueryFunc.joinWith, [literal(other), identifier(thisKey), identifier(otherKey), identifier(selector)], scopes);
    }

    static groupJoin<T, TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: Array<TOther>) => TResult | string, scopes: any[]) {
        return this.create(QueryFunc.groupJoin, [literal(other), identifier(thisKey), identifier(otherKey), identifier(selector)], scopes);
    }

    static orderBy<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryFunc.orderBy, [identifier(keySelector)], scopes);
    }

    static orderByDescending<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryFunc.orderBy, [identifier(keySelector)], scopes);
    }

    static thenBy<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryFunc.thenBy, [identifier(keySelector)], scopes);
    }

    static thenByDescending<T>(keySelector: (item: T) => any, scopes: any[]) {
        return this.create(QueryFunc.thenByDescending, [identifier(keySelector)], scopes);
    }

    static take(count: number) {
        return this.create(QueryFunc.take, [literal(count)]);
    }

    static takeWhile<T>(predicate: (i: T) => boolean | string, scopes: any[]) {
        return this.create(QueryFunc.takeWhile, [identifier(predicate)], scopes)
    }

    static skip(count: number) {
        return this.create(QueryFunc.skip, [literal(count)]);
    }

    static skipWhile<T>(predicate: (i: T) => boolean | string, scopes: any[]) {
        return this.create(QueryFunc.skipWhile, [identifier(predicate)], scopes)
    }

    static groupBy<T, TResult = any, TKey = any>(keySelector: (item: T) => TKey | string, valueSelector: (group: IGrouping<T, TKey>) => TResult | string, scopes: any[]) {
        return this.create(QueryFunc.groupBy, [identifier(keySelector), identifier(valueSelector)], scopes);
    }

    static distinct(comparer?: (x, y) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.distinct, [identifier(comparer)], scopes);
    }

    static concatWith<T>(other: Array<T> | string, scopes: any[]) {
        return this.create(QueryFunc.concatWith, [literal(other)], scopes);
    }

    static zip<T, TOther, TResult = any>(other: Array<TOther>, selector: (item: T, other: TOther) => TResult | string, scopes: any[]) {
        return this.create(QueryFunc.zip, [literal(other), identifier(selector)], scopes);
    }

    static union<T>(other: Array<T> | string, scopes: any[]) {
        return this.create(QueryFunc.union, [literal(other)], scopes);
    }

    static intersect<T>(other: Array<T> | string, scopes: any[]) {
        return this.create(QueryFunc.intersect, [literal(other)], scopes);
    }

    static except<T>(other: Array<T> | string, scopes: any[]) {
        return this.create(QueryFunc.except, [literal(other)], scopes);
    }

    static defaultIfEmpty() {
        return this.create(QueryFunc.defaultIfEmpty);
    }

    static reverse() {
        return this.create(QueryFunc.reverse);
    }

    static first<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.first, [identifier(predicate)], scopes);
    }

    static firstOrDefault<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.firstOrDefault, [identifier(predicate)], scopes);
    }

    static last<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.last, [identifier(predicate)], scopes);
    }

    static lastOrDefault<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.lastOrDefault, [identifier(predicate)], scopes);
    }

    static single<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.single, [identifier(predicate)], scopes);
    }

    static singleOrDefault<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.singleOrDefault, [identifier(predicate)], scopes);
    }

    static elementAt(index: number) {
        return this.create(QueryFunc.elementAt, [literal(index)]);
    }

    static elementAtOrDefault(index: number) {
        return this.create(QueryFunc.elementAtOrDefault, [literal(index)]);
    }

    static contains<T>(item: T) {
        return this.create(QueryFunc.contains, [literal(item)]);
    }

    static sequenceEqual<T>(other: Array<T> | string, scopes: any[]) {
        return this.create(QueryFunc.sequenceEqual, [literal(other)], scopes);
    }

    static any<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.any, [identifier(predicate)], scopes);
    }

    static all<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.all, [identifier(predicate)], scopes);
    }

    static count<T>(predicate?: (i: T) => boolean | string, scopes?: any[]) {
        return this.create(QueryFunc.count, [identifier(predicate)], scopes);
    }

    static min<T, TResult = T>(selector?: (i: T) => TResult | string, scopes?: any[]) {
        return this.create(QueryFunc.min, [identifier(selector)], scopes);
    }

    static max<T, TResult = T>(selector?: (i: T) => TResult | string, scopes?: any[]) {
        return this.create(QueryFunc.max, [identifier(selector)], scopes);
    }

    static sum<T>(selector?: (i: T) => number | string, scopes?: any[]) {
        return this.create(QueryFunc.sum, [identifier(selector)], scopes);
    }

    static average<T>(selector?: (i: T) => number | string, scopes?: any[]) {
        return this.create(QueryFunc.average, [identifier(selector)], scopes);
    }

    static aggregate<T, TAccumulate = any, TResult = TAccumulate>(func: (aggregate: TAccumulate, item: T) => TAccumulate | string, seed?: TAccumulate,
        selector?: (acc: TAccumulate) => TResult, scopes?: any[]) {
        return this.create(QueryFunc.aggregate, [identifier(func), literal(seed), identifier(selector)], scopes);
    }
}

export const QueryFunc = {
    where: 'where',
    ofType: 'ofType',
    cast: 'cast',
    select: 'select',
    selectMany: 'selectMany',
    joinWith: 'joinWith',
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
    concatWith: 'concatWith',
    zip: 'zip',
    union: 'union',
    intersect: 'intersect',
    except: 'except',
    defaultIfEmpty: 'defaultIfEmpty',
    reverse: 'reverse',
    
    first: 'first',
    firstOrDefault: 'firstOrDefault',
    last: 'last',
    lastOrDefault: 'lastOrDefault',
    single: 'single',
    singleOrDefault: 'singleOrDefault',
    elementAt: 'elementAt',
    elementAtOrDefault: 'elementAtOrDefault',
    contains: 'contains',
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
