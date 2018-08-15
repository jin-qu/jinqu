import { QueryPart } from "./query-part";

export interface IQueryProvider {
    execute<TResult = any>(query: Query, ...scopes): TResult;
    executeAsync<TResult = any>(query: Query, ...scopes): TResult;
}

interface IGrouping<T, TKey> extends Array<T> {
    Key: TKey;
}

export interface IQuery<T> {
    // readonly provider: IQueryProvider;
    // readonly parts: QueryPart[];

    where(predicate: (i: T) => boolean | string, ...scopes): IQuery<T>;
    ofType<TResult>(type: new (...args) => TResult): IQuery<TResult>;
    cast<TResult>(type: new (...args) => TResult): IQuery<TResult>;
    select<TResult = any>(selector: (i: T) => TResult | string, ...scopes): IQuery<TResult>;
    selectMany<TResult = any>(selector: (i: T) => Array<TResult> | string, ...scopes): IQuery<TResult>;
    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: TOther) => TResult | string, ...scopes): IQuery<TResult>;
    groupJoin<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: Array<TOther>) => TResult | string, ...scopes): IQuery<TResult>;
    orderBy(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T>;
    orderByDescending(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T>;
    // take(count: number): IQuery<T>;
    // takeWhile(predicate: (i: T) => boolean | string, ...scopes): IQuery<T>;
    // skip(count: number): IQuery<T>;
    // skipWhile(predicate: (i: T) => boolean | string, ...scopes): IQuery<T>;
    // groupBy<TResult = any, TKey = any>(keySelector: (item: T) => TKey | string, valueSelector: (group: IGrouping<T, TKey>) => TResult | string, ...scopes): IQuery<TResult>;
    // distinct(comparer?: (x, y) => boolean | string, ...scopes): IQuery<T>;
    // concat(other: Array<T> | string, ...scopes): IQuery<T>;
    // zip<TOther, TResult = any>(other: Array<TOther>, selector: (item: T, other: TOther) => TResult | string, ...scopes): IQuery<TResult>;
    // union(other: Array<T> | string, ...scopes): IQuery<T>;
    // intersect(other: Array<T> | string, ...scopes): IQuery<T>;
    // except(other: Array<T> | string, ...scopes): IQuery<T>;
    // first(predicate: (i: T) => boolean | string, ...scopes): T;
    // firstOrDefault(predicate: (i: T) => boolean | string, ...scopes): T;
    // last(predicate: (i: T) => boolean | string, ...scopes): T;
    // lastOrDefault(predicate: (i: T) => boolean | string, ...scopes): T;
    // single(predicate: (i: T) => boolean | string, ...scopes): T;
    // singleOrDefault(predicate: (i: T) => boolean | string, ...scopes): T;
    // elementAt(index: number): T;
    // elementAtOrDefault(index: number): T;
    // defaultIfEmpty(): IQuery<T>;
    // contains(item: T): boolean;
    // reverse(): IQuery<T>;
    // sequenceEqual(other: Array<T> | string, ...scopes): boolean;
    // any(predicate?: (i: T) => boolean | string, ...scopes): boolean;
    // all(predicate: (i: T) => boolean | string, ...scopes): boolean;
    // count(predicate: (i: T) => boolean | string, ...scopes): number;
    // min<TResult = T>(selector?: (i: T) => TResult | string, ...scopes): TResult;
    // max<TResult = T>(selector?: (i: T) => TResult | string, ...scopes): TResult;
    // sum(selector: (i: T) => number | string, ...scopes): number;
    // average(selector: (i: T) => number | string, ...scopes): number;
    // aggregate<TAccumulate = any, TResult = TAccumulate>(func: (aggregate: TAccumulate, item: T) => TAccumulate | string, seed?: TAccumulate,
    //     selector?: (acc: TAccumulate) => TResult, ...scopes): IQuery<TResult>;
}

export interface IOrderedQuery<T> extends IQuery<T> {
    thenBy(selector: (T) => any): IOrderedQuery<T>;
    thenByDescending(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T>;
}

export class Query<T> implements IOrderedQuery<T> {

    constructor(public readonly provider: IQueryProvider, public readonly parts: QueryPart[] = []) {
    }

    where(predicate: (i: T) => boolean | string, ...scopes): IQuery<T> {
        return this.create(QueryPart.where(predicate, scopes));
    }

    ofType<TResult>(type: new (...args) => TResult): IQuery<TResult> {
        return this.create(QueryPart.ofType(type));
    }

    cast<TResult>(type: new (...args) => TResult): IQuery<TResult> {
        return this.create(QueryPart.cast(type));
    }

    select<TResult = any>(selector: (i: T) => TResult | string, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.select(selector, scopes));
    }

    selectMany<TResult = any>(selector: (i: T) => Array<TResult> | string, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.selectMany(selector, scopes));
    }

    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: TOther) => TResult | string, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.join(other, thisKey, otherKey, selector, scopes));
    }

    groupJoin<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: Array<TOther>) => TResult | string, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.groupJoin(other, thisKey, otherKey, selector, scopes));
    }

    orderBy(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T> {
        return this.create(QueryPart.orderBy(keySelector, scopes));
    }

    orderByDescending(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T> {
        return this.create(QueryPart.orderByDescending(keySelector, scopes));
    }

    thenBy(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T> {
        return this.create(QueryPart.thenBy(keySelector, scopes));
    }

    thenByDescending(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T> {
        return this.create(QueryPart.thenByDescending(keySelector, scopes));
    }

    // take(count: number): IQuery<T> {
    // }

    // takeWhile(predicate: (i: T) => boolean | string, ...scopes): IQuery<T> {
    // }

    // skip(count: number): IQuery<T> {
    // }

    // skipWhile(predicate: (i: T) => boolean | string, ...scopes): IQuery<T> {
    // }

    // groupBy<TResult = any, TKey = any>(keySelector: (item: T) => TKey | string, valueSelector: (group: IGrouping<T, TKey>) => TResult | string, ...scopes): IQuery<TResult> {
    // }

    // distinct(comparer?: (x, y) => boolean | string, ...scopes): IQuery<T> {
    // }

    // concat(other: Array<T> | string, ...scopes): IQuery<T> {
    // }

    // zip<TOther, TResult = any>(other: Array<TOther>, selector: (item: T, other: TOther) => TResult | string, ...scopes): IQuery<TResult> {
    // }

    // union(other: Array<T> | string, ...scopes): IQuery<T> {
    // }

    // intersect(other: Array<T> | string, ...scopes): IQuery<T> {
    // }

    // except(other: Array<T> | string, ...scopes): IQuery<T> {
    // }

    // first(predicate: (i: T) => boolean | string, ...scopes): T {
    // }

    // firstOrDefault(predicate: (i: T) => boolean | string, ...scopes): T {
    // }

    // last(predicate: (i: T) => boolean | string, ...scopes): T {
    // }

    // lastOrDefault(predicate: (i: T) => boolean | string, ...scopes): T {
    // }

    // single(predicate: (i: T) => boolean | string, ...scopes): T {
    // }

    // singleOrDefault(predicate: (i: T) => boolean | string, ...scopes): T {
    // }

    // elementAt(index: number): T {
    // }

    // elementAtOrDefault(index: number): T {
    // }

    // defaultIfEmpty(): IQuery<T> {
    // }

    // contains(item: T): boolean {
    // }

    // reverse(): IQuery<T> {
    // }

    // sequenceEqual(other: Array<T> | string, ...scopes): boolean {
    // }

    // any(predicate?: (i: T) => boolean | string, ...scopes): boolean {
    // }

    // all(predicate: (i: T) => boolean | string, ...scopes): boolean {
    // }

    // count(predicate: (i: T) => boolean | string, ...scopes): number {
    // }

    // min<TResult = T>(selector?: (i: T) => TResult | string, ...scopes): TResult {
    // }

    // max<TResult = T>(selector?: (i: T) => TResult | string, ...scopes): TResult {
    // }

    // sum(selector: (i: T) => number | string, ...scopes): number {
    // }

    // average(selector: (i: T) => number | string, ...scopes): number {
    // }

    // aggregate<TAccumulate = any, TResult = TAccumulate>(func: (aggregate: TAccumulate, item: T) => TAccumulate | string, seed?: TAccumulate,
    //     selector?: (acc: TAccumulate) => TResult, ...scopes): IQuery<TResult> {
    // }

    protected create<TResult>(part: QueryPart): Query<TResult> {
        return new Query<TResult>(this.provider, [...this.parts, part]);
    }
}
