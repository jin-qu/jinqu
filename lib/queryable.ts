import { QueryPart } from "./query-part";
import { Ctor, Func1, Func2, Predicate, IGrouping, IQueryProvider, IQueryPart, IQuery, IOrderedQuery } from './types';

export class Query<T = any> implements IOrderedQuery<T> {

    constructor(public readonly provider: IQueryProvider, public readonly parts: IQueryPart[] = []) {
    }

    where(predicate: Predicate<T>, ...scopes): IQuery<T> {
        return this.create(QueryPart.where(predicate, scopes));
    }

    ofType<TResult extends T>(type: Ctor<TResult>): IQuery<TResult> {
        return this.create(QueryPart.ofType(type));
    }

    cast<TResult>(type: Ctor<TResult>): IQuery<TResult> {
        return this.create(QueryPart.cast(type));
    }

    select<TResult = any>(selector: Func1<T, TResult>, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.select(selector, scopes));
    }

    selectMany<TResult = any>(selector: Func1<T, Array<TResult>>, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.selectMany(selector, scopes));
    }

    join<TOther, TResult = any, TKey = any>(other: Array<TOther> | string, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.join(other, thisKey, otherKey, selector, scopes));
    }

    groupJoin<TOther, TResult = any, TKey = any>(other: Array<TOther> |  string, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.groupJoin(other, thisKey, otherKey, selector, scopes));
    }

    orderBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T> {
        return <IOrderedQuery<T>>this.create(QueryPart.orderBy(keySelector, scopes));
    }

    orderByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T> {
        return <IOrderedQuery<T>>this.create(QueryPart.orderByDescending(keySelector, scopes));
    }

    thenBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T> {
        return <IOrderedQuery<T>>this.create(QueryPart.thenBy(keySelector, scopes));
    }

    thenByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T> {
        return <IOrderedQuery<T>>this.create(QueryPart.thenByDescending(keySelector, scopes));
    }

    take(count: number): IQuery<T> {
        return this.create(QueryPart.take(count));
    }

    takeWhile(predicate: Predicate<T>, ...scopes): IQuery<T> {
        return this.create(QueryPart.takeWhile(predicate, scopes));
    }

    skip(count: number): IQuery<T> {
        return this.create(QueryPart.skip(count));
    }

    skipWhile(predicate: Predicate<T>, ...scopes): IQuery<T> {
        return this.create(QueryPart.skipWhile(predicate, scopes));
    }

    groupBy<TResult = any, TKey = any>(keySelector: Func1<T, TKey>, valueSelector: Func1<IGrouping<T, TKey>, TResult>, ...scopes): IQuery<TResult> {
        return this.create(QueryPart.groupBy(keySelector, valueSelector, scopes));
    }

    distinct(comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T> {
        return this.create(QueryPart.distinct(comparer, scopes));
    }

    concat(other: Array<T> | string, ...scopes): IQuery<T> {
        return this.create(QueryPart.concat(other, scopes));
    }

    zip<TOther, TResult = any>(other: Array<TOther> |  string, selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult> {
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

    reverseTo(): IQuery<T> {
        return this.create(QueryPart.reverseTo());
    }

    first(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.first(predicate, scopes)]);
    }

    firstOrDefault(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.firstOrDefault(predicate, scopes)]);
    }

    last(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.last(predicate, scopes)]);
    }

    lastOrDefault(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.lastOrDefault(predicate, scopes)]);
    }

    single(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.single(predicate, scopes)]);
    }

    singleOrDefault(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.singleOrDefault(predicate, scopes)]);
    }

    elementAt(index: number): T {
        return this.provider.execute([...this.parts, QueryPart.elementAt(index)]);
    }

    elementAtOrDefault(index: number): T {
        return this.provider.execute([...this.parts, QueryPart.elementAtOrDefault(index)]);
    }

    contains(item: T): boolean {
        return this.provider.execute([...this.parts, QueryPart.contains(item)]);
    }

    sequenceEqual(other: Array<T> | string, ...scopes): boolean {
        return this.provider.execute([...this.parts, QueryPart.sequenceEqual(other, scopes)]);
    }

    any(predicate?: Predicate<T>, ...scopes): boolean {
        return this.provider.execute([...this.parts, QueryPart.any(predicate, scopes)]);
    }

    all(predicate: Predicate<T>, ...scopes): boolean {
        return this.provider.execute([...this.parts, QueryPart.all(predicate, scopes)]);
    }

    count(predicate: Predicate<T>, ...scopes): number {
        return this.provider.execute([...this.parts, QueryPart.count(predicate, scopes)]);
    }

    min<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult {
        return this.provider.execute([...this.parts, QueryPart.min(selector, scopes)]);
    }

    max<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult {
        return this.provider.execute([...this.parts, QueryPart.max(selector, scopes)]);
    }

    sum(selector?: Func1<T, number>, ...scopes): number {
        return this.provider.execute([...this.parts, QueryPart.sum(selector, scopes)]);
    }

    average(selector?: Func1<T, number>, ...scopes): number {
        return this.provider.execute([...this.parts, QueryPart.average(selector, scopes)]);
    }

    aggregate<TAccumulate = any, TResult = TAccumulate>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate,
        selector?: Func1<TAccumulate, TResult>, ...scopes): TResult {
        return this.provider.execute([...this.parts, QueryPart.aggregate(func, seed, selector, scopes)]);
    }

    toList() {
        return this.provider.execute(this.parts);
    }

    private create<TResult = T>(part: IQueryPart): IQuery<TResult> {
        return this.provider.createQuery<TResult>([...this.parts, part]);
    }
}
