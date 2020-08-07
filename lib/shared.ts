import { Expression } from "jokenizer";

export type Ctor<T> = new (...args: any[]) => T;

export type Func1<T1, T2 = any> = ((p1: T1) => T2) | string;
export type Func2<T1, T2, T3 = any> = ((p1: T1, p2: T2) => T3) | string;
export type Predicate<T> = Func1<T, boolean>;
export type TypePredicate<T> = (t: any) => t is T;
export interface Value<T> { value: T; }
export type Result<T, TExtra> = {} extends TExtra ? T : Value<T> & TExtra;

export interface IGrouping<T, TKey> extends Array<T> {
    key: TKey;
}

export interface IQueryProvider {
    createQuery(parts?: IQueryPart[]): IQueryBase;
    execute<TResult = any[]>(parts: IQueryPart[]): TResult;
    executeAsync<TResult = any[]>(parts: IQueryPart[]): PromiseLike<TResult>;
}

export interface IPartArgument {
    // tslint:disable-next-line:ban-types
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
    readonly inlineCount: number;
}

interface IQueryDuplicates<T, TExtra = {}> {
    concat(other: T[]): IQuery<T, TExtra>;
    join<TOther, TResult = any, TKey = any>(
        other: TOther[], thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult, TExtra>;
    join<TOther, TResult = any, TKey = any>(
        other: TOther[], thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult, TExtra>;
    reverse(): IQuery<T, TExtra>;
}

export interface IQuerySafe<T, TExtra = {}> extends IQueryBase, Iterable<T> {
    aggregate<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>,
                                    seed?: TAccumulate, ...scopes): TAccumulate;
    aggregateAsync<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>,
                                        seed?: TAccumulate, ...scopes): PromiseLike<TAccumulate>;
    all(predicate: Predicate<T>, ...scopes): Result<boolean, TExtra>;
    allAsync(predicate: Predicate<T>, ...scopes): PromiseLike<Result<boolean, TExtra>>;
    any(predicate?: Predicate<T>, ...scopes): Result<boolean, TExtra>;
    anyAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<boolean, TExtra>>;
    average(selector?: Func1<T, number>, ...scopes): Result<number, TExtra>;
    averageAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<Result<number, TExtra>>;
    cast<TResult>(type: Ctor<TResult>): IQuery<TResult, TExtra>;
    contains(item: T, comparer?: Func2<T, T, boolean>, ...scopes): Result<boolean, TExtra>;
    containsAsync(item: T, comparer?: Func2<T, T, boolean>, ...scopes): PromiseLike<Result<boolean, TExtra>>;
    count(predicate?: Predicate<T>, ...scopes): Result<number, TExtra>;
    countAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<number, TExtra>>;
    defaultIfEmpty(defaultValue?: T): IQuery<T, TExtra>;
    distinct(comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TExtra>;
    elementAt(index: number): Result<T, TExtra>;
    elementAtAsync(index: number): PromiseLike<Result<T, TExtra>>;
    elementAtOrDefault(index: number): Result<T, TExtra>;
    elementAtOrDefaultAsync(index: number): PromiseLike<Result<T, TExtra>>;
    except(other: T[], comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TExtra>;
    first(predicate?: Predicate<T>, ...scopes): Result<T, TExtra>;
    firstAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>>;
    firstOrDefault(predicate?: Predicate<T>, ...scopes): Result<T, TExtra>;
    firstOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>>;
    groupBy<TKey = any, TResult = IGrouping<TKey, T>>(
        keySelector: Func1<T, TKey>,
        elementSelector?: Func2<TKey, T[], TResult>,
        ...scopes): IQuery<TResult, TExtra>;
    groupBy<TKey = any, TResult = IGrouping<TKey, T>>(
        keySelector: Func1<T, TKey>,
        elementSelector?: Func2<TKey, T[], TResult>,
        ctor?: Ctor<TResult>,
        ...scopes): IQuery<TResult, TExtra>;
    groupJoin<TOther, TKey = any, TResult = any>(
        other: TOther[],
        thisKey: Func1<T, TKey>,
        otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther[], TResult>,
        ...scopes): IQuery<TResult, TExtra>;
    groupJoin<TOther, TKey = any, TResult = any>(
        other: TOther[],
        thisKey: Func1<T, TKey>,
        otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther[], TResult>,
        ctor?: Ctor<TResult>,
        ...scopes): IQuery<TResult, TExtra>;
    inlineCount(): IQuery<T, TExtra & InlineCountInfo>;
    intersect(other: T[], comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TExtra>;
    last(predicate?: Predicate<T>, ...scopes): Result<T, TExtra>;
    lastAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>>;
    lastOrDefault(predicate?: Predicate<T>, ...scopes): Result<T, TExtra>;
    lastOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>>;
    max<TResult = T>(selector?: Func1<T, TResult>, ...scopes): Result<TResult, TExtra>;
    maxAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<Result<TResult, TExtra>>;
    min<TResult = T>(selector?: Func1<T, TResult>, ...scopes): Result<TResult, TExtra>;
    minAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<Result<TResult, TExtra>>;
    ofGuardedType<TResult>(checker: TypePredicate<TResult>): IQuery<TResult, TExtra>;
    ofType<TResult extends T>(type: Ctor<TResult> | TResult): IQuery<TResult, TExtra>;
    orderBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T, TExtra>;
    orderByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T, TExtra>;
    select<TResult = any>(selector: Func1<T, TResult>, ...scopes): IQuery<TResult, TExtra>;
    select<TResult = any>(selector: Func1<T, TResult>, ctor: Ctor<T>, ...scopes): IQuery<TResult, TExtra>;
    selectMany<TResult>(selector: Func1<T, TResult[]>, ...scopes): IQuery<TResult, TExtra>;
    selectMany<TResult>(selector: Func1<T, TResult[]>, ctor: Ctor<T>, ...scopes): IQuery<TResult, TExtra>;
    sequenceEqual(other: T[], comparer?: Func2<T, T, boolean>, ...scopes): Result<boolean, TExtra>;
    sequenceEqualAsync(other: T[], comparer?: Func2<T, T, boolean>, ...scopes): PromiseLike<Result<boolean, TExtra>>;
    single(predicate?: Predicate<T>, ...scopes): Result<T, TExtra>;
    singleAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>>;
    singleOrDefault(predicate?: Predicate<T>, ...scopes): Result<T, TExtra>;
    singleOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>>;
    skip(count: number): IQuery<T, TExtra>;
    skipWhile(predicate: Predicate<T>, ...scopes): IQuery<T, TExtra>;
    sum(selector?: Func1<T, number>, ...scopes): Result<number, TExtra>;
    sumAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<Result<number, TExtra>>;
    take(count: number): IQuery<T, TExtra>;
    takeWhile(predicate: Predicate<T>, ...scopes): IQuery<T, TExtra>;
    union(other: T[], comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TExtra>;
    where(predicate: Predicate<T>, ...scopes): IQuery<T, TExtra>;
    zip<TOther, TResult = any>(other: TOther[], selector: Func2<T, TOther, TResult>,
                                ...scopes): IQuery<TResult, TExtra>;
    zip<TOther, TResult = any>(other: TOther[], selector: Func2<T, TOther, TResult>,
                                ctor: Ctor<T>, ...scopes): IQuery<TResult, TExtra>;

    toArray(ctor?: Ctor<T>): Result<T[], TExtra>;
    toArrayAsync(ctor?: Ctor<T>): PromiseLike<Result<T[], TExtra>>;
}

export type IQuery<T, TExtra = {}> = IQuerySafe<T, TExtra> & IQueryDuplicates<T, TExtra>;

export interface IOrderedQuery<T, TExtra = {}> extends IQuery<T, TExtra> {
    thenBy(selector: Func1<T>, ...scopes): IOrderedQuery<T, TExtra>;
    thenByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T, TExtra>;
}
