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
    execute<T = any, TResult = T[]>(parts: IQueryPart[]): TResult;
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

export interface IQuery<T> extends IQueryBase {
    where(predicate: Predicate<T>, ...scopes): IQuery<T>;
    ofType<TResult extends T>(type: Ctor<TResult>): IQuery<TResult>;
    cast<TResult>(type: Ctor<TResult>): IQuery<TResult>;
    select<TResult = any>(selector: Func1<T, TResult>, ...scopes): IQuery<TResult>;
    selectMany<TResult = any>(selector: Func1<T, Array<TResult>>, ...scopes): IQuery<TResult>;
    joinWith<TOther, TResult = any, TKey = any>(other: Array<TOther> | string, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult>;
    groupJoin<TOther, TResult = any, TKey = any>(other: Array<TOther> | string, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, Array<TOther>, TResult>, ...scopes): IQuery<TResult>;
    orderBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T>;
    orderByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T>;
    take(count: number): IQuery<T>;
    takeWhile(predicate: Predicate<T>, ...scopes): IQuery<T>;
    skip(count: number): IQuery<T>;
    skipWhile(predicate: Predicate<T>, ...scopes): IQuery<T>;
    groupBy<TResult = any, TKey = any>(keySelector: Func1<T, TKey>, valueSelector: Func1<IGrouping<T, TKey>, TResult>, ...scopes): IQuery<TResult>;
    distinct(comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T>;
    concatWith(other: Array<T> | string, ...scopes): IQuery<T>;
    zip<TOther, TResult = any>(other: Array<TOther> | string, selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult>;
    union(other: Array<T> | string, ...scopes): IQuery<T>;
    intersect(other: Array<T> | string, ...scopes): IQuery<T>;
    except(other: Array<T> | string, ...scopes): IQuery<T>;
    defaultIfEmpty(): IQuery<T>;
    reverseTo(): IQuery<T>;

    first(predicate?: Predicate<T>, ...scopes): T;
    firstOrDefault(predicate?: Predicate<T>, ...scopes): T;
    last(predicate?: Predicate<T>, ...scopes): T;
    lastOrDefault(predicate?: Predicate<T>, ...scopes): T;
    single(predicate?: Predicate<T>, ...scopes): T;
    singleOrDefault(predicate?: Predicate<T>, ...scopes): T;
    elementAt(index: number): T;
    elementAtOrDefault(index: number): T;
    contains(item: T): boolean;
    sequenceEqual(other: Array<T> | string, ...scopes): boolean;
    any(predicate?: Predicate<T>, ...scopes): boolean;
    all(predicate: Predicate<T>, ...scopes): boolean;
    count(predicate?: Predicate<T>, ...scopes): number;
    min<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult;
    max<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult;
    sum(selector?: Func1<T, number>, ...scopes): number;
    average(selector?: Func1<T, number>, ...scopes): number;
    aggregate<TAccumulate = any, TResult = TAccumulate>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate,
        selector?: Func1<TAccumulate, TResult>, ...scopes): TResult;

    toList(): Array<T>;
}

export interface IOrderedQuery<T> extends IQuery<T> {
    thenBy(selector: Func1<T>, ...scopes): IOrderedQuery<T>;
    thenByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T>;
}
