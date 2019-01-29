import { Expression } from "jokenizer";

export type Ctor<T> = new (...args) => T;

export type Func1<T1, T2 = any> = ((p1: T1) => T2) | string;
export type Func2<T1, T2, T3 = any> = ((p1: T1, p2: T2) => T3) | string;
export type Predicate<T> = Func1<T, boolean>;
export type TypePredicate<T> = (t: any) => t is T

export interface IGrouping<T, TKey> extends Array<T> {
    key: TKey;
}

export interface IQueryProvider {
    createQuery(parts?: IQueryPart[]): IQueryBase;
    execute<TResult = any[]>(parts: IQueryPart[]): TResult;
    executeAsync<TResult = any[]>(parts: IQueryPart[]): PromiseLike<TResult>;
}

export interface IPartArgument {
    readonly func: Function;
    readonly exp: Expression;
    readonly literal: any;
    readonly scopes: any[];
}

export interface IQueryPart {
    readonly type: string;
    readonly args: IPartArgument[];
    readonly scopes: any[];
}

export interface IQueryBase {
    readonly provider: IQueryProvider;
    readonly parts: IQueryPart[];
}

export interface InlineCountInfo {
    $inlineCount?: number;
}

interface IQueryDuplicates<T> {
    concat(other: Array<T>): IQuery<T>;
    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult>;
    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult>;
    reverse(): IQuery<T>;
}

export interface IArrayQuery {
    ofGuardedType<TResult>(checker: TypePredicate<TResult>): IQuery<TResult>;
}

export interface IQuerySafe<T> extends IQueryBase, Iterable<T> {
    aggregate<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate, ...scopes): TAccumulate;
    aggregateAsync<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate, ...scopes): PromiseLike<TAccumulate>;
    all(predicate: Predicate<T>, ...scopes): boolean;
    allAsync(predicate: Predicate<T>, ...scopes): PromiseLike<boolean>;
    any(predicate?: Predicate<T>, ...scopes): boolean;
    anyAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<boolean>;
    average(selector?: Func1<T, number>, ...scopes): number;
    averageAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<number>;
    cast<TResult>(type: Ctor<TResult>): IQuery<TResult>;
    contains(item: T, comparer?: Func2<T, T, boolean>, ...scopes): boolean;
    containsAsync(item: T, comparer?: Func2<T, T, boolean>, ...scopes): PromiseLike<boolean>;
    count(predicate?: Predicate<T>, ...scopes): number;
    countAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<number>;
    defaultIfEmpty(defaultValue?: T): IQuery<T>;
    distinct(comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T>;
    elementAt(index: number): T;
    elementAtAsync(index: number): PromiseLike<T>;
    elementAtOrDefault(index: number): T;
    elementAtOrDefaultAsync(index: number): PromiseLike<T>;
    except(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T>;
    first(predicate?: Predicate<T>, ...scopes): T;
    firstAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    firstOrDefault(predicate?: Predicate<T>, ...scopes): T;
    firstOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    groupBy<TResult = IGrouping<TKey, T>, TKey = any>(keySelector: Func1<T, TKey>,
        elementSelector?: Func2<TKey, Array<T>, TResult>, ...scopes): IQuery<TResult>;
    groupBy<TResult = IGrouping<TKey, T>, TKey = any>(keySelector: Func1<T, TKey>,
        elementSelector?: Func2<TKey, Array<T>, TResult>, ctor?: Ctor<TResult>, ...scopes): IQuery<TResult>;
    groupJoin<TOther, TKey = any, TResult = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, Array<TOther>, TResult>, ...scopes): IQuery<TResult>;
    groupJoin<TOther, TKey = any, TResult = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, Array<TOther>, TResult>, ctor?: Ctor<TResult>, ...scopes): IQuery<TResult>;
    inlineCount(value?: boolean): IQuery<T>;
    intersect(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T>;
    last(predicate?: Predicate<T>, ...scopes): T;
    lastAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    lastOrDefault(predicate?: Predicate<T>, ...scopes): T;
    lastOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    max<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult;
    maxAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<TResult>;
    min<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult;
    minAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<TResult>;
    ofType<TResult extends T>(type: Ctor<TResult> | TResult): IQuery<TResult>;
    orderBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T>;
    orderByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T>;
    select<TResult = any>(selector: Func1<T, TResult>, ...scopes): IQuery<TResult>;
    select<TResult = any>(selector: Func1<T, TResult>, ctor: Ctor<T>, ...scopes): IQuery<TResult>;
    selectMany<TResult>(selector: Func1<T, Array<TResult>>, ...scopes): IQuery<TResult>;
    selectMany<TResult>(selector: Func1<T, Array<TResult>>, ctor: Ctor<T>, ...scopes): IQuery<TResult>;
    sequenceEqual(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): boolean;
    sequenceEqualAsync(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): PromiseLike<boolean>;
    single(predicate?: Predicate<T>, ...scopes): T;
    singleAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    singleOrDefault(predicate?: Predicate<T>, ...scopes): T;
    singleOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    skip(count: number): IQuery<T>;
    skipWhile(predicate: Predicate<T>, ...scopes): IQuery<T>;
    sum(selector?: Func1<T, number>, ...scopes): number;
    sumAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<number>;
    take(count: number): IQuery<T>;
    takeWhile(predicate: Predicate<T>, ...scopes): IQuery<T>;
    union(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T>;
    where(predicate: Predicate<T>, ...scopes): IQuery<T>;
    zip<TOther, TResult = any>(other: Array<TOther>, selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult>;
    zip<TOther, TResult = any>(other: Array<TOther>, selector: Func2<T, TOther, TResult>, ctor: Ctor<T>, ...scopes): IQuery<TResult>;

    toArray(ctor?: Ctor<T>): Array<T> & InlineCountInfo;
    toArrayAsync(ctor?: Ctor<T>): PromiseLike<Array<T> & InlineCountInfo>;
}

export type IQuery<T> = IQuerySafe<T> & IQueryDuplicates<T>;

export interface IOrderedQuery<T> extends IQuery<T> {
    thenBy(selector: Func1<T>, ...scopes): IOrderedQuery<T>;
    thenByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T>;
}
