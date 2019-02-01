import { Expression, tokenize, evaluate, ExpressionType } from 'jokenizer';
import { Ctor, Func1, Func2, Predicate, IPartArgument, IQueryPart } from './types';

export class PartArgument implements IPartArgument {

    constructor(identifier: Function | string, literal, scopes: any[]) {
        if (typeof identifier === 'string') {
            this._expStr = identifier;
        }
        else {
            this._func = identifier;
        }
        this._literal = literal;
        this._scopes = scopes;
    }

    private _func: Function;
    get func() {
        if (this._func) return this._func;
        if (!this._expStr) return null;

        if (this.exp.type === ExpressionType.Func) {
            const f = evaluate(this.exp, ...this._scopes);
            return this._func = (...args) => f.apply(null, args);
        }

        return this._func = (...args) => evaluate(this.exp, ...args.concat(this._scopes));
    }

    private _expStr;
    get expStr() {
        if (this._expStr) return this._expStr;
        if (!this._func) return null;

        return this._expStr = this._func.toString();
    }

    private _exp: Expression;
    get exp() {
        if (this._exp) return this._exp;

        const s = this.expStr;
        if (!s) return null;

        return this._exp = tokenize(s);
    }

    private _literal;
    get literal() {
        return this._literal;
    }

    private _scopes: any[];
    get scopes() {
        return this._scopes;
    }


    static identifier(value: Function | string, scopes: any[]) {
        return new PartArgument(value, null, scopes);
    }

    static literal(value) {
        return new PartArgument(null, value, null);
    }
}

function identifier(value: Function | string, scopes: any[]) {
    return PartArgument.identifier(value, scopes);
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

    static aggregate<T, TAccumulate = any>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate, scopes?: any[]) {
        return this.create(QueryFunc.aggregate, [identifier(func, scopes), literal(seed)], scopes);
    }

    static all<T>(predicate?: Predicate<T>, scopes?: any[]) {
        return this.create(QueryFunc.all, [identifier(predicate, scopes)], scopes);
    }

    static any<T>(predicate?: Predicate<T>, scopes?: any[]) {
        return this.create(QueryFunc.any, [identifier(predicate, scopes)], scopes);
    }

    static average<T>(selector?: Func1<T, number>, scopes?: any[]) {
        return this.create(QueryFunc.average, [identifier(selector, scopes)], scopes);
    }

    static cast<TResult>(type: Ctor<TResult>) {
        return this.create(QueryFunc.cast, [literal(type)]);
    }

    static concat<T>(other: Array<T>) {
        return this.create(QueryFunc.concat, [literal(other)]);
    }

    static contains<T>(item: T, comparer?: Func2<T, T, boolean>, scopes?: any[]) {
        return this.create(QueryFunc.contains, [literal(item), identifier(comparer, scopes)]);
    }

    static count<T>(predicate?: Predicate<T>, scopes?: any[]) {
        return this.create(QueryFunc.count, [identifier(predicate, scopes)], scopes);
    }

    static defaultIfEmpty<T>(defaultValue?: T) {
        return this.create(QueryFunc.defaultIfEmpty, [literal(defaultValue)]);
    }

    static distinct<T>(comparer?: Func2<T, T, boolean>, scopes?: any[]) {
        return this.create(QueryFunc.distinct, [identifier(comparer, scopes)], scopes);
    }

    static elementAt(index: number) {
        return this.create(QueryFunc.elementAt, [literal(index)]);
    }

    static elementAtOrDefault(index: number) {
        return this.create(QueryFunc.elementAtOrDefault, [literal(index)]);
    }

    static except<T>(other: Array<T>, comparer?: Func2<T, T, boolean>, scopes?: any[]) {
        return this.create(QueryFunc.except, [literal(other), identifier(comparer, scopes)], scopes);
    }

    static first<T>(predicate?: Predicate<T>, scopes?: any[]) {
        return this.create(QueryFunc.first, [identifier(predicate, scopes)], scopes);
    }

    static firstOrDefault<T>(predicate?: Predicate<T>, scopes?: any[]) {
        return this.create(QueryFunc.firstOrDefault, [identifier(predicate, scopes)], scopes);
    }

    static groupBy<T, TResult = any, TKey = any>(keySelector: Func1<T, TKey>, elementSelector: Func2<TKey, Array<T>, TResult>, scopes: any[]) {
        return this.create(QueryFunc.groupBy, [identifier(keySelector, scopes), identifier(elementSelector, scopes)], scopes);
    }

    static groupJoin<T, TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, Array<TOther>, TResult>, scopes: any[]) {
        return this.createJoin(QueryFunc.groupJoin, other, thisKey, otherKey, selector, scopes);
    }

    static inlineCount() {
        return this.create(QueryFunc.inlineCount, [literal(true)]);
    }

    static intersect<T>(other: Array<T>, comparer?: Func2<T, T, boolean>, scopes?: any[]) {
        return this.create(QueryFunc.intersect, [literal(other), identifier(comparer, scopes)], scopes);
    }

    static join<T, TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, scopes: any[]) {
        return this.createJoin(QueryFunc.join, other, thisKey, otherKey, selector, scopes);
    }

    static last<T>(predicate?: Predicate<T>, scopes?: any[]) {
        return this.create(QueryFunc.last, [identifier(predicate, scopes)], scopes);
    }

    static lastOrDefault<T>(predicate?: Predicate<T>, scopes?: any[]) {
        return this.create(QueryFunc.lastOrDefault, [identifier(predicate, scopes)], scopes);
    }

    static max<T, TResult = T>(selector?: Func1<T, TResult>, scopes?: any[]) {
        return this.create(QueryFunc.max, [identifier(selector, scopes)], scopes);
    }

    static min<T, TResult = T>(selector?: Func1<T, TResult>, scopes?: any[]) {
        return this.create(QueryFunc.min, [identifier(selector, scopes)], scopes);
    }

    static ofGuardedType(typeGuard: (i) => boolean) {
        return this.create(QueryFunc.ofGuardedType, [literal(typeGuard)]);
    }

    static ofType<TResult>(type: Ctor<TResult>) {
        return this.create(QueryFunc.ofType, [literal(type)]);
    }

    static orderBy<T>(keySelector: Func1<T>, scopes: any[]) {
        return this.create(QueryFunc.orderBy, [identifier(keySelector, scopes)], scopes);
    }

    static orderByDescending<T>(keySelector: Func1<T>, scopes: any[]) {
        return this.create(QueryFunc.orderByDescending, [identifier(keySelector, scopes)], scopes);
    }

    static reverse() {
        return this.create(QueryFunc.reverse);
    }

    static select<T, TResult = any>(selector: Func1<T, TResult>, scopes: any[]) {
        return this.create(QueryFunc.select, [identifier(selector, scopes)], scopes);
    }

    static selectMany<T, TCollection = any, TResult = TCollection>(selector: Func1<T, Array<TResult>>, scopes?: any[]) {
        return this.create(QueryFunc.selectMany, [identifier(selector, scopes)], scopes);
    }

    static sequenceEqual<T>(other: Array<T>, comparer?: Func2<T, T, boolean>, scopes?: any[]) {
        return this.create(QueryFunc.sequenceEqual, [literal(other), identifier(comparer, scopes)], scopes);
    }

    static single<T>(predicate?: Predicate<T>, scopes?: any[]) {
        return this.create(QueryFunc.single, [identifier(predicate, scopes)], scopes);
    }

    static singleOrDefault<T>(predicate?: Predicate<T>, scopes?: any[]) {
        return this.create(QueryFunc.singleOrDefault, [identifier(predicate, scopes)], scopes);
    }

    static skip(count: number) {
        return this.create(QueryFunc.skip, [literal(count)]);
    }

    static skipWhile<T>(predicate: Predicate<T>, scopes: any[]) {
        return this.create(QueryFunc.skipWhile, [identifier(predicate, scopes)], scopes)
    }

    static sum<T>(selector?: Func1<T, number>, scopes?: any[]) {
        return this.create(QueryFunc.sum, [identifier(selector, scopes)], scopes);
    }

    static take(count: number) {
        return this.create(QueryFunc.take, [literal(count)]);
    }

    static takeWhile<T>(predicate: Predicate<T>, scopes: any[]) {
        return this.create(QueryFunc.takeWhile, [identifier(predicate, scopes)], scopes)
    }

    static thenBy<T>(keySelector: Func1<T>, scopes: any[]) {
        return this.create(QueryFunc.thenBy, [identifier(keySelector, scopes)], scopes);
    }

    static thenByDescending<T>(keySelector: Func1<T>, scopes: any[]) {
        return this.create(QueryFunc.thenByDescending, [identifier(keySelector, scopes)], scopes);
    }

    static union<T>(other: Array<T>, comparer?: Func2<T, T, boolean>, scopes?: any[]) {
        return this.create(QueryFunc.union, [literal(other), identifier(comparer, scopes)], scopes);
    }

    static where<T>(predicate: Predicate<T>, scopes: any[]) {
        return this.create(QueryFunc.where, [identifier(predicate, scopes)], scopes);
    }

    static zip<T, TOther, TResult = any>(other: Array<TOther>, selector: Func2<T, TOther, TResult>, scopes: any[]) {
        return this.create(QueryFunc.zip, [literal(other), identifier(selector, scopes)], scopes);
    }

    private static createJoin(type, other, thisKey, otherKey, selector, scopes: any[]) {
        return this.create(
            type,
            [
                literal(other),
                identifier(thisKey, scopes),
                identifier(otherKey, scopes),
                identifier(selector, scopes)
            ],
            scopes
        );
    }

    static toArray() {
        return this.create(QueryFunc.toArray);
    }
}

export const QueryFunc = {
    aggregate: 'aggregate',
    all: 'all',
    any: 'any',
    average: 'average',
    cast: 'cast',
    concat: 'concat',
    contains: 'contains',
    count: 'count',
    defaultIfEmpty: 'defaultIfEmpty',
    distinct: 'distinct',
    elementAt: 'elementAt',
    elementAtOrDefault: 'elementAtOrDefault',
    except: 'except',
    first: 'first',
    firstOrDefault: 'firstOrDefault',
    groupBy: 'groupBy',
    groupJoin: 'groupJoin',
    inlineCount: 'inlineCount',
    intersect: 'intersect',
    join: 'join',
    last: 'last',
    lastOrDefault: 'lastOrDefault',
    max: 'max',
    min: 'min',
    ofGuardedType: 'ofGuardedType',
    ofType: 'ofType',
    orderBy: 'orderBy',
    orderByDescending: 'orderByDescending',
    reverse: 'reverse',
    select: 'select',
    selectMany: 'selectMany',
    sequenceEqual: 'sequenceEqual',
    single: 'single',
    singleOrDefault: 'singleOrDefault',
    skip: 'skip',
    skipWhile: 'skipWhile',
    sum: 'sum',
    take: 'take',
    takeWhile: 'takeWhile',
    thenBy: 'thenBy',
    thenByDescending: 'thenByDescending',
    union: 'union',
    where: 'where',
    zip: 'zip',
    toArray: 'toArray'
};
