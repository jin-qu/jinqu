import { Expression } from "jokenizer";

export interface IGrouping<T, TKey> extends Array<T> {
    Key: TKey;
}

export interface IQueryProvider {
    execute<TResult = any>(query: IQuery, ...scopes): TResult;
    executeAsync<TResult = any>(query: IQuery, ...scopes): TResult;
}

export interface IPartArgument {
    readonly func: Function;
    readonly exp: Expression;
    readonly literal;
}

export interface IQueryPart {
    readonly type: string;
    readonly args: IPartArgument[];
    readonly scopes: any[];
}

export interface IQuery<T = any> {
    readonly provider: IQueryProvider;
    readonly parts: IQueryPart[];

    where(predicate: (i: T) => boolean | string, ...scopes): IQuery<T>;
    ofType<TResult>(type: new (...args) => TResult): IQuery<TResult>;
    cast<TResult>(type: new (...args) => TResult): IQuery<TResult>;
    select<TResult = any>(selector: (i: T) => TResult | string, ...scopes): IQuery<TResult>;
    selectMany<TResult = any>(selector: (i: T) => Array<TResult> | string, ...scopes): IQuery<TResult>;
    joinWith<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: TOther) => TResult | string, ...scopes): IQuery<TResult>;
    groupJoin<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: Array<TOther>) => TResult | string, ...scopes): IQuery<TResult>;
    orderBy(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T>;
    orderByDescending(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T>;
    take(count: number): IQuery<T>;
    takeWhile(predicate: (i: T) => boolean | string, ...scopes): IQuery<T>;
    skip(count: number): IQuery<T>;
    skipWhile(predicate: (i: T) => boolean | string, ...scopes): IQuery<T>;
    groupBy<TResult = any, TKey = any>(keySelector: (item: T) => TKey | string, valueSelector: (group: IGrouping<T, TKey>) => TResult | string, ...scopes): IQuery<TResult>;
    distinct(comparer?: (x, y) => boolean | string, ...scopes): IQuery<T>;
    concatWith(other: Array<T> | string, ...scopes): IQuery<T>;
    zip<TOther, TResult = any>(other: Array<TOther>, selector: (item: T, other: TOther) => TResult | string, ...scopes): IQuery<TResult>;
    union(other: Array<T> | string, ...scopes): IQuery<T>;
    intersect(other: Array<T> | string, ...scopes): IQuery<T>;
    except(other: Array<T> | string, ...scopes): IQuery<T>;
    defaultIfEmpty(): IQuery<T>;
    reverse(): IQuery<T>;

    first(predicate?: (i: T) => boolean | string, ...scopes): T;
    firstOrDefault(predicate?: (i: T) => boolean | string, ...scopes): T;
    last(predicate?: (i: T) => boolean | string, ...scopes): T;
    lastOrDefault(predicate?: (i: T) => boolean | string, ...scopes): T;
    single(predicate?: (i: T) => boolean | string, ...scopes): T;
    singleOrDefault(predicate?: (i: T) => boolean | string, ...scopes): T;
    elementAt(index: number): T;
    elementAtOrDefault(index: number): T;
    contains(item: T): boolean;
    sequenceEqual(other: Array<T> | string, ...scopes): boolean;
    any(predicate?: (i: T) => boolean | string, ...scopes): boolean;
    all(predicate: (i: T) => boolean | string, ...scopes): boolean;
    count(predicate?: (i: T) => boolean | string, ...scopes): number;
    min<TResult = T>(selector?: (i: T) => TResult | string, ...scopes): TResult;
    max<TResult = T>(selector?: (i: T) => TResult | string, ...scopes): TResult;
    sum(selector?: (i: T) => number | string, ...scopes): number;
    average(selector?: (i: T) => number | string, ...scopes): number;
    aggregate<TAccumulate = any, TResult = TAccumulate>(func: (aggregate: TAccumulate, item: T) => TAccumulate | string, seed?: TAccumulate,
        selector?: (acc: TAccumulate) => TResult, ...scopes): TResult;
}

export interface IOrderedQuery<T> extends IQuery<T> {
    thenBy(selector: (T) => any): IOrderedQuery<T>;
    thenByDescending(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T>;
}
