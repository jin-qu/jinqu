import { QueryPart } from "./query-part";
import { IGrouping, IQueryProvider, IQuery, IOrderedQuery } from './types';

export class Query<T = any> implements IOrderedQuery<T> {

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

    joinWith<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
        selector: (item: T, other: TOther) => TResult | string, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.joinWith(other, thisKey, otherKey, selector, scopes));
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

    take(count: number): IQuery<T> {
        return this.create(QueryPart.take(count));
    }

    takeWhile(predicate: (i: T) => boolean | string, ...scopes): IQuery<T> {
        return this.create(QueryPart.takeWhile(predicate, scopes));
    }

    skip(count: number): IQuery<T> {
        return this.create(QueryPart.skip(count));
    }

    skipWhile(predicate: (i: T) => boolean | string, ...scopes): IQuery<T> {
        return this.create(QueryPart.skipWhile(predicate, scopes));
    }

    groupBy<TResult = any, TKey = any>(keySelector: (item: T) => TKey | string, valueSelector: (group: IGrouping<T, TKey>) => TResult | string, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.groupBy(keySelector, valueSelector, scopes));
    }

    distinct(comparer?: (x, y) => boolean | string, ...scopes): IQuery<T> {
        return this.create(QueryPart.distinct(comparer, scopes));
    }

    concatWith(other: Array<T> | string, ...scopes): IQuery<T> {
        return this.create(QueryPart.concatWith(other, scopes));
    }

    zip<TOther, TResult = any>(other: Array<TOther>, selector: (item: T, other: TOther) => TResult | string, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.zip(other, selector, scopes));
    }

    union(other: Array<T> | string, ...scopes): IQuery<T> {
        return this.create(QueryPart.union(other, scopes));
    }

    intersect(other: Array<T> | string, ...scopes): IQuery<T> {
        return this.create(QueryPart.intersect(other, scopes));
    }

    except(other: Array<T> | string, ...scopes): IQuery<T> {
        return this.create(QueryPart.except(other, scopes));
    }

    defaultIfEmpty(): IQuery<T> {
        return this.create(QueryPart.defaultIfEmpty());
    }

    reverse(): IQuery<T> {
        return this.create(QueryPart.reverse());
    }

    first(predicate?: (i: T) => boolean | string, ...scopes): T {
        return this.provider.execute(this.create(QueryPart.first(predicate, scopes)));
    }

    firstOrDefault(predicate?: (i: T) => boolean | string, ...scopes): T {
        return this.provider.execute(this.create(QueryPart.firstOrDefault(predicate, scopes)));
    }

    last(predicate?: (i: T) => boolean | string, ...scopes): T {
        return this.provider.execute(this.create(QueryPart.last(predicate, scopes)));
    }

    lastOrDefault(predicate: (i: T) => boolean | string, ...scopes): T {
        return this.provider.execute(this.create(QueryPart.lastOrDefault(predicate, scopes)));
    }

    single(predicate: (i: T) => boolean | string, ...scopes): T {
        return this.provider.execute(this.create(QueryPart.single(predicate, scopes)));
    }

    singleOrDefault(predicate: (i: T) => boolean | string, ...scopes): T {
        return this.provider.execute(this.create(QueryPart.singleOrDefault(predicate, scopes)));
    }

    elementAt(index: number): T {
        return this.provider.execute(this.create(QueryPart.elementAt(index)));
    }

    elementAtOrDefault(index: number): T {
        return this.provider.execute(this.create(QueryPart.elementAtOrDefault(index)));
    }

    contains(item: T): boolean {
        return this.provider.execute(this.create(QueryPart.contains(item)));
    }

    sequenceEqual(other: Array<T> | string, ...scopes): boolean {
        return this.provider.execute(this.create(QueryPart.sequenceEqual(other, scopes)));
    }

    any(predicate?: (i: T) => boolean | string, ...scopes): boolean {
        return this.provider.execute(this.create(QueryPart.any(predicate, scopes)));
    }

    all(predicate: (i: T) => boolean | string, ...scopes): boolean {
        return this.provider.execute(this.create(QueryPart.all(predicate, scopes)));
    }

    count(predicate: (i: T) => boolean | string, ...scopes): number {
        return this.provider.execute(this.create(QueryPart.count(predicate, scopes)));
    }

    min<TResult = T>(selector?: (i: T) => TResult | string, ...scopes): TResult {
        return this.provider.execute(this.create(QueryPart.min(selector, scopes)));
    }

    max<TResult = T>(selector?: (i: T) => TResult | string, ...scopes): TResult {
        return this.provider.execute(this.create(QueryPart.max(selector, scopes)));
    }

    sum(selector?: (i: T) => number | string, ...scopes): number {
        return this.provider.execute(this.create(QueryPart.sum(selector, scopes)));
    }

    average(selector?: (i: T) => number | string, ...scopes): number {
        return this.provider.execute(this.create(QueryPart.average(selector, scopes)));
    }

    aggregate<TAccumulate = any, TResult = TAccumulate>(func: (aggregate: TAccumulate, item: T) => TAccumulate | string, seed?: TAccumulate,
        selector?: (acc: TAccumulate) => TResult, ...scopes): TResult {
        return this.provider.execute(this.create(QueryPart.aggregate(func, seed, selector, scopes)));
    }

    protected create<TResult = T>(part: QueryPart): Query<TResult> {
        return new Query<TResult>(this.provider, [...this.parts, part]);
    }
}
