import { Expression } from "jokenizer";

export type Ctor<T> = new (...args) => T;

export type Func1<T1, T2 = any> = ((p1: T1) => T2) | string;
export type Func2<T1, T2, T3 = any> = ((p1: T1, p2: T2) => T3) | string;
export type Predicate<T> = Func1<T, boolean>;

export interface IGrouping<T, TKey> extends Array<T> {
    key: TKey;
}

export interface IQueryProvider {
    createQuery(parts?: IQueryPart[]): IQueryBase;
    execute<TResult = any[]>(parts: IQueryPart[]): TResult;
    executeAsync<TResult = any[]>(parts: IQueryPart[]): PromiseLike<TResult>;
    executeAsyncIterator<TResult = any>(parts: IQueryPart[]): AsyncIterator<TResult>;
}

export interface IPartArgument {
    readonly func: Function;
    readonly exp: Expression;
    readonly literal;
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

interface IQueryDuplicates<T> {
    join<TOther, TResult = any, TKey = any>(other: Array<TOther> | string, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult>;
    concat(other: Array<T> | string, ...scopes): IQuery<T>;
    reverse(): IQuery<T>;
}

export interface IQuerySafe<T> extends IQueryBase, Iterable<T>, AsyncIterable<T> {
    inlineCount(value?: boolean): IQuery<T>;
    where(predicate: Predicate<T>, ...scopes): IQuery<T>;
    ofType<TResult extends T>(type: Ctor<TResult>): IQuery<TResult>;
    cast<TResult>(type: Ctor<TResult>): IQuery<TResult>;
    select<TResult = any>(selector: Func1<T, TResult>, ...scopes): IQuery<TResult>;
    selectMany<TResult = any>(selector: Func1<T, Array<TResult>>, ...scopes): IQuery<TResult>;
    groupJoin<TOther, TResult = any, TKey = any>(other: Array<TOther> | string, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, Array<TOther>, TResult>, ...scopes): IQuery<TResult>;
    orderBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T>;
    orderByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T>;
    take(count: number): IQuery<T>;
    takeWhile(predicate: Predicate<T>, ...scopes): IQuery<T>;
    skip(count: number): IQuery<T>;
    skipWhile(predicate: Predicate<T>, ...scopes): IQuery<T>;
    groupBy<TResult = any, TKey = any>(keySelector: Func1<T, TKey>, valueSelector: Func1<IGrouping<T, TKey>, TResult>, ...scopes): IQuery<TResult>;
    distinct(comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T>;
    zip<TOther, TResult = any>(other: Array<TOther> | string, selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult>;
    union(other: Array<T> | string, ...scopes): IQuery<T>;
    intersect(other: Array<T> | string, ...scopes): IQuery<T>;
    except(other: Array<T> | string, ...scopes): IQuery<T>;
    defaultIfEmpty(): IQuery<T>;

    first(predicate?: Predicate<T>, ...scopes): T;
    firstAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    firstOrDefault(predicate?: Predicate<T>, ...scopes): T;
    firstOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    last(predicate?: Predicate<T>, ...scopes): T;
    lastAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    lastOrDefault(predicate?: Predicate<T>, ...scopes): T;
    lastOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    single(predicate?: Predicate<T>, ...scopes): T;
    singleAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    singleOrDefault(predicate?: Predicate<T>, ...scopes): T;
    singleOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T>;
    elementAt(index: number): T;
    elementAtAsync(index: number): PromiseLike<T>;
    elementAtOrDefault(index: number): T;
    elementAtOrDefaultAsync(index: number): PromiseLike<T>;
    contains(item: T): boolean;
    containsAsync(item: T): PromiseLike<boolean>;
    sequenceEqual(other: Array<T> | string, ...scopes): boolean;
    sequenceEqualAsync(other: Array<T> | string, ...scopes): PromiseLike<boolean>;
    any(predicate?: Predicate<T>, ...scopes): boolean;
    anyAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<boolean>;
    all(predicate: Predicate<T>, ...scopes): boolean;
    allAsync(predicate: Predicate<T>, ...scopes): PromiseLike<boolean>;
    count(predicate?: Predicate<T>, ...scopes): number;
    countAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<number>;
    min<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult;
    minAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<TResult>;
    max<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult;
    maxAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<TResult>;
    sum(selector?: Func1<T, number>, ...scopes): number;
    sumAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<number>;
    average(selector?: Func1<T, number>, ...scopes): number;
    averageAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<number>;
    aggregate<TAccumulate = any, TResult = TAccumulate>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate,
        selector?: Func1<TAccumulate, TResult>, ...scopes): TResult;
    aggregateAsync<TAccumulate = any, TResult = TAccumulate>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate,
        selector?: Func1<TAccumulate, TResult>, ...scopes): PromiseLike<TResult>;

    toArray(): Array<T>;
    toArrayAsync(): PromiseLike<Array<T>>;
}

export type IQuery<T> = IQuerySafe<T> & IQueryDuplicates<T>;

export interface IOrderedQuery<T> extends IQuery<T> {
    thenBy(selector: Func1<T>, ...scopes): IOrderedQuery<T>;
    thenByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T>;
}
