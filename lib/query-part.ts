import { evaluate, Expression, ExpressionType, tokenize } from "jokenizer";
import { Ctor, Func1, Func2, IPartArgument, IQueryPart, Predicate } from "./shared";

export class PartArgument implements IPartArgument {

    public static identifier(value: ((...args: any[]) => any) | string, scopes?: unknown[]) {
        return new PartArgument(value, null, scopes);
    }

    public static literal(value: unknown) {
        return new PartArgument(null, value, null);
    }

    private _func: (...args: any[]) => any;
    get func() {
        if (this._func)
            return this._func;
        if (!this._expStr)
            return null;

        if (this.exp.type === ExpressionType.Func) {
            const f = evaluate(this.exp, ...this._scopes);
            return this._func = (...args: any[]) => f(...args);
        }

        return this._func = (...args: any[]) => evaluate(this.exp, ...args.concat(this._scopes));
    }

    private _expStr: any;
    get expStr() {
        if (this._expStr)
            return this._expStr;
        if (!this._func)
            return null;

        return this._expStr = this._func.toString();
    }

    private _exp: Expression;
    get exp() {
        if (this._exp)
            return this._exp;

        const s = this.expStr;
        if (!s)
            return null;

        return this._exp = tokenize(s);
    }

    private readonly _literal: any;
    get literal() {
        return this._literal;
    }

    private readonly _scopes: unknown[];
    get scopes() {
        return this._scopes;
    }

    constructor($identifier?: ((...args: any[]) => any) | string | null, $literal?: unknown, scopes?: unknown[]) {
        if (typeof $identifier === "string") {
            this._expStr = $identifier;
        } else {
            this._func = $identifier;
        }
        this._literal = $literal;
        this._scopes = scopes;
    }
}

function identifier(value: ((...args: any[]) => any) | string, scopes?: unknown[]) {
    return PartArgument.identifier(value, scopes);
}

function literal(value: unknown) {
    return PartArgument.literal(value);
}

export class QueryPart implements IQueryPart {

    public static create(type: string, args?: PartArgument[], scopes?: unknown[]) {
        return new QueryPart(type, args, scopes);
    }

    public static aggregate<T, TAccumulate = unknown>(func: Func2<TAccumulate, T, TAccumulate>,
                                                seed?: TAccumulate, scopes?: unknown[]) {
        return this.create(QueryFunc.aggregate, [identifier(func, scopes), literal(seed)], scopes);
    }

    public static all<T>(predicate?: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.all, [identifier(predicate, scopes)], scopes);
    }

    public static any<T>(predicate?: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.any, [identifier(predicate, scopes)], scopes);
    }

    public static average<T>(selector?: Func1<T, number>, scopes?: unknown[]) {
        return this.create(QueryFunc.average, [identifier(selector, scopes)], scopes);
    }

    public static cast<TResult>(type: Ctor<TResult>) {
        return this.create(QueryFunc.cast, [literal(type)]);
    }

    public static concat<T>(other: T[]) {
        return this.create(QueryFunc.concat, [literal(other)]);
    }

    public static contains<T>(item: T, comparer?: Func2<T, T, boolean>, scopes?: unknown[]) {
        return this.create(QueryFunc.contains, [literal(item), identifier(comparer, scopes)]);
    }

    public static count<T>(predicate?: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.count, [identifier(predicate, scopes)], scopes);
    }

    public static defaultIfEmpty<T>(defaultValue?: T) {
        return this.create(QueryFunc.defaultIfEmpty, [literal(defaultValue)]);
    }

    public static distinct<T>(comparer?: Func2<T, T, boolean>, scopes?: unknown[]) {
        return this.create(QueryFunc.distinct, [identifier(comparer, scopes)], scopes);
    }

    public static elementAt(index: number) {
        return this.create(QueryFunc.elementAt, [literal(index)]);
    }

    public static elementAtOrDefault(index: number) {
        return this.create(QueryFunc.elementAtOrDefault, [literal(index)]);
    }

    public static except<T>(other: T[], comparer?: Func2<T, T, boolean>, scopes?: unknown[]) {
        return this.create(QueryFunc.except, [literal(other), identifier(comparer, scopes)], scopes);
    }

    public static first<T>(predicate?: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.first, [identifier(predicate, scopes)], scopes);
    }

    public static firstOrDefault<T>(predicate?: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.firstOrDefault, [identifier(predicate, scopes)], scopes);
    }

    public static groupBy<T, TResult = unknown, TKey = unknown>(keySelector: Func1<T, TKey>,
                                                        elementSelector: Func2<TKey, T[], TResult>, scopes?: unknown[]) {
        return this.create(
            QueryFunc.groupBy,
            [identifier(keySelector, scopes), identifier(elementSelector, scopes)],
            scopes,
        );
    }

    public static groupJoin<T, TOther, TResult = unknown, TKey = unknown>(
            other: TOther[], thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
            selector: Func2<T, TOther[], TResult>, scopes?: unknown[]) {
        return this.createJoin(QueryFunc.groupJoin, other, thisKey, otherKey, selector, scopes);
    }

    public static inlineCount() {
        return this.create(QueryFunc.inlineCount, [literal(true)]);
    }

    public static intersect<T>(other: T[], comparer?: Func2<T, T, boolean>, scopes?: unknown[]) {
        return this.create(QueryFunc.intersect, [literal(other), identifier(comparer, scopes)], scopes);
    }

    public static join<T, TOther, TResult = unknown, TKey = unknown>(
            other: TOther[], thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
            selector: Func2<T, TOther, TResult>, scopes?: unknown[]) {
        return this.createJoin(QueryFunc.join, other, thisKey, otherKey, selector, scopes);
    }

    public static last<T>(predicate?: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.last, [identifier(predicate, scopes)], scopes);
    }

    public static lastOrDefault<T>(predicate?: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.lastOrDefault, [identifier(predicate, scopes)], scopes);
    }

    public static max<T, TResult = T>(selector?: Func1<T, TResult>, scopes?: unknown[]) {
        return this.create(QueryFunc.max, [identifier(selector, scopes)], scopes);
    }

    public static min<T, TResult = T>(selector?: Func1<T, TResult>, scopes?: unknown[]) {
        return this.create(QueryFunc.min, [identifier(selector, scopes)], scopes);
    }

    public static ofGuardedType(typeGuard: (i: unknown) => boolean) {
        return this.create(QueryFunc.ofGuardedType, [literal(typeGuard)]);
    }

    public static ofType<TResult>(type: Ctor<TResult>) {
        return this.create(QueryFunc.ofType, [literal(type)]);
    }

    public static orderBy<T>(keySelector: Func1<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.orderBy, [identifier(keySelector, scopes)], scopes);
    }

    public static orderByDescending<T>(keySelector: Func1<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.orderByDescending, [identifier(keySelector, scopes)], scopes);
    }

    public static reverse() {
        return this.create(QueryFunc.reverse);
    }

    public static select<T, TResult = unknown>(selector: Func1<T, TResult>, scopes?: unknown[]) {
        return this.create(QueryFunc.select, [identifier(selector, scopes)], scopes);
    }

    public static selectMany<T, TCollection = unknown, TResult = TCollection>(
            selector: Func1<T, TResult[]>, scopes?: unknown[]) {
        return this.create(QueryFunc.selectMany, [identifier(selector, scopes)], scopes);
    }

    public static sequenceEqual<T>(other: T[], comparer?: Func2<T, T, boolean>, scopes?: unknown[]) {
        return this.create(QueryFunc.sequenceEqual, [literal(other), identifier(comparer, scopes)], scopes);
    }

    public static single<T>(predicate?: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.single, [identifier(predicate, scopes)], scopes);
    }

    public static singleOrDefault<T>(predicate?: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.singleOrDefault, [identifier(predicate, scopes)], scopes);
    }

    public static skip(count: number) {
        return this.create(QueryFunc.skip, [literal(count)]);
    }

    public static skipWhile<T>(predicate: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.skipWhile, [identifier(predicate, scopes)], scopes);
    }

    public static sum<T>(selector?: Func1<T, number>, scopes?: unknown[]) {
        return this.create(QueryFunc.sum, [identifier(selector, scopes)], scopes);
    }

    public static take(count: number) {
        return this.create(QueryFunc.take, [literal(count)]);
    }

    public static takeWhile<T>(predicate: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.takeWhile, [identifier(predicate, scopes)], scopes);
    }

    public static thenBy<T>(keySelector: Func1<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.thenBy, [identifier(keySelector, scopes)], scopes);
    }

    public static thenByDescending<T>(keySelector: Func1<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.thenByDescending, [identifier(keySelector, scopes)], scopes);
    }

    public static union<T>(other: T[], comparer?: Func2<T, T, boolean>, scopes?: unknown[]) {
        return this.create(QueryFunc.union, [literal(other), identifier(comparer, scopes)], scopes);
    }

    public static where<T>(predicate: Predicate<T>, scopes?: unknown[]) {
        return this.create(QueryFunc.where, [identifier(predicate, scopes)], scopes);
    }

    public static zip<T, TOther, TResult = unknown>(other: TOther[], selector: Func2<T, TOther, TResult>, scopes?: unknown[]) {
        return this.create(QueryFunc.zip, [literal(other), identifier(selector, scopes)], scopes);
    }

    public static toArray() {
        return this.create(QueryFunc.toArray);
    }

    private static createJoin(type: any, other: any, thisKey: any, otherKey: any, selector: any, scopes?: any[]) {
        return this.create(
            type,
            [
                literal(other),
                identifier(thisKey, scopes),
                identifier(otherKey, scopes),
                identifier(selector, scopes),
            ],
            scopes,
        );
    }

    private readonly _type: string;
    get type() {
        return this._type;
    }

    private readonly _args: IPartArgument[];
    get args() {
        return this._args;
    }

    private readonly _scopes: unknown[];
    get scopes() {
        return this._scopes;
    }

    constructor(type: string, args: IPartArgument[] = [], scopes = []) {
        if (!type)
            throw new Error("Type of QueryPart cannot be null or empty.");

        this._type = type;
        this._args = args;
        this._type = type;
        this._scopes = scopes;
    }
}

export const QueryFunc = {
    aggregate: "aggregate",
    all: "all",
    any: "any",
    average: "average",
    cast: "cast",
    concat: "concat",
    contains: "contains",
    count: "count",
    defaultIfEmpty: "defaultIfEmpty",
    distinct: "distinct",
    elementAt: "elementAt",
    elementAtOrDefault: "elementAtOrDefault",
    except: "except",
    first: "first",
    firstOrDefault: "firstOrDefault",
    groupBy: "groupBy",
    groupJoin: "groupJoin",
    inlineCount: "inlineCount",
    intersect: "intersect",
    join: "join",
    last: "last",
    lastOrDefault: "lastOrDefault",
    max: "max",
    min: "min",
    ofGuardedType: "ofGuardedType",
    ofType: "ofType",
    orderBy: "orderBy",
    orderByDescending: "orderByDescending",
    reverse: "reverse",
    select: "select",
    selectMany: "selectMany",
    sequenceEqual: "sequenceEqual",
    single: "single",
    singleOrDefault: "singleOrDefault",
    skip: "skip",
    skipWhile: "skipWhile",
    sum: "sum",
    take: "take",
    takeWhile: "takeWhile",
    thenBy: "thenBy",
    thenByDescending: "thenByDescending",
    toArray: "toArray",
    union: "union",
    where: "where",
    zip: "zip",
};
