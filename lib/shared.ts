import { Expression } from "jokenizer";

export type Ctor<T> = new (...args: never[]) => T;

export type Func1<T1, T2 = unknown> = ((p1: T1) => T2) | string;
export type Func2<T1, T2, T3 = unknown> = ((p1: T1, p2: T2) => T3) | string;
export type Predicate<T> = Func1<T, boolean>;
export type TypePredicate<T> = (t: unknown) => t is T;
export interface Value<T> { value: T; }
export type Result<T, TExtra> = object extends TExtra ? T : Value<T> & TExtra;

export interface IGrouping<T, TKey> extends Array<T> {
    key: TKey;
}

export interface IQueryProvider {
    createQuery(parts?: IQueryPart[]): IQueryBase;
    execute<TResult = unknown[]>(parts: IQueryPart[]): TResult;
    executeAsync<TResult = unknown[]>(parts: IQueryPart[]): PromiseLike<TResult>;
}

export interface IPartArgument {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    readonly func: Function;
    readonly exp: Expression;
    readonly literal: unknown;
    readonly scopes: unknown[];
}

export interface IQueryPart {
    readonly type: string;
    readonly args: IPartArgument[];
    readonly scopes: unknown[];
}

export interface IQueryBase {
    readonly provider: IQueryProvider;
    readonly parts: IQueryPart[];
}

export interface InlineCountInfo {
    readonly inlineCount: number;
}

interface IQueryDuplicates<T, TExtra = object> {
    concat(other: T[]): IQuery<T, TExtra>;
    join<TOther, TResult = unknown, TKey = unknown>(
        other: TOther[], thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    join<TOther, TResult = unknown, TKey = unknown>(
        other: TOther[], thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ctor: Ctor<TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    reverse(): IQuery<T, TExtra>;
}

export interface IQuerySafe<T, TExtra = object> extends IQueryBase, Iterable<T> {
    aggregate<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>,
                                    seed?: TAccumulate, ...scopes: unknown[]): TAccumulate;
    aggregateAsync<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>,
                                        seed?: TAccumulate, ...scopes: unknown[]): PromiseLike<TAccumulate>;
    all(predicate: Predicate<T>, ...scopes: unknown[]): Result<boolean, TExtra>;
    allAsync(predicate: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<boolean, TExtra>>;
    any(predicate?: Predicate<T>, ...scopes: unknown[]): Result<boolean, TExtra>;
    anyAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<boolean, TExtra>>;
    average(selector?: Func1<T, number>, ...scopes: unknown[]): Result<number, TExtra>;
    averageAsync(selector?: Func1<T, number>, ...scopes: unknown[]): PromiseLike<Result<number, TExtra>>;
    cast<TResult>(type: Ctor<TResult>): IQuery<TResult, TExtra>;
    contains(item: T, comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): Result<boolean, TExtra>;
    containsAsync(item: T, comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): PromiseLike<Result<boolean, TExtra>>;
    count(predicate?: Predicate<T>, ...scopes: unknown[]): Result<number, TExtra>;
    countAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<number, TExtra>>;
    defaultIfEmpty(defaultValue?: T | null): IQuery<T, TExtra>;
    distinct(comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): IQuery<T, TExtra>;
    elementAt(index: number): Result<T, TExtra>;
    elementAtAsync(index: number): PromiseLike<Result<T, TExtra>>;
    elementAtOrDefault(index: number): Result<T, TExtra>;
    elementAtOrDefaultAsync(index: number): PromiseLike<Result<T, TExtra>>;
    except(other: T[], comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): IQuery<T, TExtra>;
    first(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra>;
    firstAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>>;
    firstOrDefault(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra>;
    firstOrDefaultAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>>;
    groupBy<TKey = unknown, TResult = IGrouping<TKey, T>>(
        keySelector: Func1<T, TKey>,
        elementSelector?: Func2<TKey, T[], TResult>,
        ...scopes: unknown[]): IQuery<TResult, TExtra>;
    groupBy<TKey = unknown, TResult = IGrouping<TKey, T>>(
        keySelector: Func1<T, TKey>,
        elementSelector?: Func2<TKey, T[], TResult>,
        ctor?: Ctor<TResult>,
        ...scopes: unknown[]): IQuery<TResult, TExtra>;
    groupJoin<TOther, TKey = unknown, TResult = unknown>(
        other: TOther[],
        thisKey: Func1<T, TKey>,
        otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther[], TResult>,
        ...scopes: unknown[]): IQuery<TResult, TExtra>;
    groupJoin<TOther, TKey = unknown, TResult = unknown>(
        other: TOther[],
        thisKey: Func1<T, TKey>,
        otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther[], TResult>,
        ctor?: Ctor<TResult>,
        ...scopes: unknown[]): IQuery<TResult, TExtra>;
    inlineCount(): IQuery<T, TExtra & InlineCountInfo>;
    intersect(other: T[], comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): IQuery<T, TExtra>;
    last(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra>;
    lastAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>>;
    lastOrDefault(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra>;
    lastOrDefaultAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>>;
    max<TResult = T>(selector?: Func1<T, TResult>, ...scopes: unknown[]): Result<TResult, TExtra>;
    maxAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes: unknown[]): PromiseLike<Result<TResult, TExtra>>;
    min<TResult = T>(selector?: Func1<T, TResult>, ...scopes: unknown[]): Result<TResult, TExtra>;
    minAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes: unknown[]): PromiseLike<Result<TResult, TExtra>>;
    ofGuardedType<TResult>(checker: TypePredicate<TResult>): IQuery<TResult, TExtra>;
    ofType<TResult extends T>(type: Ctor<TResult> | TResult): IQuery<TResult, TExtra>;
    orderBy(keySelector: Func1<T>, ...scopes: unknown[]): IOrderedQuery<T, TExtra>;
    orderByDescending(keySelector: Func1<T>, ...scopes: unknown[]): IOrderedQuery<T, TExtra>;
    select<TResult = unknown>(selector: Func1<T, TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    select<TResult = unknown>(selector: Func1<T, TResult>, ctor: Ctor<T>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    selectMany<TResult>(selector: Func1<T, TResult[]>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    selectMany<TResult>(selector: Func1<T, TResult[]>, ctor: Ctor<T>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    sequenceEqual(other: T[], comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): Result<boolean, TExtra>;
    sequenceEqualAsync(other: T[], comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): PromiseLike<Result<boolean, TExtra>>;
    single(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra>;
    singleAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>>;
    singleOrDefault(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra>;
    singleOrDefaultAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>>;
    skip(count: number): IQuery<T, TExtra>;
    skipWhile(predicate: Predicate<T>, ...scopes: unknown[]): IQuery<T, TExtra>;
    sum(selector?: Func1<T, number>, ...scopes: unknown[]): Result<number, TExtra>;
    sumAsync(selector?: Func1<T, number>, ...scopes: unknown[]): PromiseLike<Result<number, TExtra>>;
    take(count: number): IQuery<T, TExtra>;
    takeWhile(predicate: Predicate<T>, ...scopes: unknown[]): IQuery<T, TExtra>;
    union(other: T[], comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): IQuery<T, TExtra>;
    where(predicate: Predicate<T>, ...scopes: unknown[]): IQuery<T, TExtra>;
    zip<TOther, TResult = unknown>(other: TOther[], selector: Func2<T, TOther, TResult>,
                                ...scopes: unknown[]): IQuery<TResult, TExtra>;
    zip<TOther, TResult = unknown>(other: TOther[], selector: Func2<T, TOther, TResult>,
                                ctor: Ctor<T>, ...scopes: unknown[]): IQuery<TResult, TExtra>;

    toArray(ctor?: Ctor<T>): Result<T[], TExtra>;
    toArrayAsync(ctor?: Ctor<T>): PromiseLike<Result<T[], TExtra>>;
}

export type IQuery<T, TExtra = object> = IQuerySafe<T, TExtra> & IQueryDuplicates<T, TExtra>;

export interface IOrderedQuery<T, TExtra = object> extends IQuery<T, TExtra> {
    thenBy(selector: Func1<T>, ...scopes: unknown[]): IOrderedQuery<T, TExtra>;
    thenByDescending(keySelector: Func1<T>, ...scopes: unknown[]): IOrderedQuery<T, TExtra>;
}
