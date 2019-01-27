import { QueryPart } from "./query-part";
import { Ctor, Func1, Func2, Predicate, IGrouping, IQueryProvider, IQueryPart, IQuery, IOrderedQuery, InlineCountInfo, TypePredicate } from './types';

export class Query<T = any> implements IOrderedQuery<T>, Iterable<T> {

    constructor(public readonly provider: IQueryProvider, public readonly parts: IQueryPart[] = []) {
    }

    aggregate<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate, ...scopes): TAccumulate {
        return this.provider.execute([...this.parts, QueryPart.aggregate(func, seed, scopes)]);
    }

    aggregateAsync<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate, ...scopes): PromiseLike<TAccumulate> {
        return this.provider.executeAsync([...this.parts, QueryPart.aggregate(func, seed, scopes)]);
    }

    all(predicate: Predicate<T>, ...scopes): boolean {
        return this.provider.execute([...this.parts, QueryPart.all(predicate, scopes)]);
    }

    allAsync(predicate: Predicate<T>, ...scopes): PromiseLike<boolean> {
        return this.provider.executeAsync([...this.parts, QueryPart.all(predicate, scopes)]);
    }

    any(predicate?: Predicate<T>, ...scopes): boolean {
        return this.provider.execute([...this.parts, QueryPart.any(predicate, scopes)]);
    }

    anyAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<boolean> {
        return this.provider.executeAsync([...this.parts, QueryPart.any(predicate, scopes)]);
    }

    average(selector?: Func1<T, number>, ...scopes): number {
        return this.provider.execute([...this.parts, QueryPart.average(selector, scopes)]);
    }

    averageAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<number> {
        return this.provider.executeAsync([...this.parts, QueryPart.average(selector, scopes)]);
    }

    cast<TResult>(type: Ctor<TResult>): IQuery<TResult> {
        return this.create(QueryPart.cast(type));
    }

    concat(other: Array<T>): IQuery<T> {
        return this.create(QueryPart.concat(other));
    }

    contains(item: T, comparer?: Func2<T, T, boolean>, ...scopes): boolean {
        return this.provider.execute([...this.parts, QueryPart.contains(item, comparer, scopes)]);
    }

    containsAsync(item: T, comparer?: Func2<T, T, boolean>, ...scopes): PromiseLike<boolean> {
        return this.provider.executeAsync([...this.parts, QueryPart.contains(item, comparer, scopes)]);
    }

    count(predicate?: Predicate<T>, ...scopes): number {
        return this.provider.execute([...this.parts, QueryPart.count(predicate, scopes)]);
    }

    countAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<number> {
        return this.provider.executeAsync([...this.parts, QueryPart.count(predicate, scopes)]);
    }

    defaultIfEmpty(defaultValue?: T): IQuery<T> {
        return this.create(QueryPart.defaultIfEmpty(defaultValue));
    }

    distinct(comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T> {
        return this.create(QueryPart.distinct(comparer, scopes));
    }

    elementAt(index: number): T {
        return this.provider.execute([...this.parts, QueryPart.elementAt(index)]);
    }

    elementAtAsync(index: number): PromiseLike<T> {
        return this.provider.executeAsync([...this.parts, QueryPart.elementAt(index)]);
    }

    elementAtOrDefault(index: number): T {
        return this.provider.execute([...this.parts, QueryPart.elementAtOrDefault(index)]);
    }

    elementAtOrDefaultAsync(index: number): PromiseLike<T> {
        return this.provider.executeAsync([...this.parts, QueryPart.elementAtOrDefault(index)]);
    }

    except(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T> {
        return this.create(QueryPart.except(other, comparer, scopes));
    }

    first(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.first(predicate, scopes)]);
    }

    firstAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.executeAsync([...this.parts, QueryPart.first(predicate, scopes)]);
    }

    firstOrDefault(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.firstOrDefault(predicate, scopes)]);
    }

    firstOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.executeAsync([...this.parts, QueryPart.firstOrDefault(predicate, scopes)]);
    }

    groupBy<TKey = any, TResult = IGrouping<T, TKey>>(keySelector: Func1<T, TKey>,
        elementSelector?: Func2<TKey, Array<T>, TResult>, ...scopes): IQuery<TResult>;
    groupBy<TKey = any, TResult = IGrouping<T, TKey>>(keySelector: Func1<T, TKey>,
        elementSelector?: Func2<TKey, Array<T>, TResult>, ctor?: Ctor<TResult>, ...scopes): IQuery<TResult> {
        return this.fixCtorArg(s => QueryPart.groupBy(keySelector, elementSelector, s), ctor, scopes);
    }

    groupJoin<TOther, TKey = any, TResult = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, Array<TOther>, TResult>, ...scopes): IQuery<TResult>;
    groupJoin<TOther, TKey = any, TResult = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, Array<TOther>, TResult>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult> {
        return this.fixCtorArg(s => QueryPart.groupJoin(other, thisKey, otherKey, selector, s), ctor, scopes);
    }

    inlineCount(value?: boolean): IQuery<T> {
        return this.create(QueryPart.inlineCount(value));
    }
    
    intersect(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T> {
        return this.create(QueryPart.intersect(other, comparer, scopes));
    }

    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult>;
    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult> {
        return this.fixCtorArg(s => QueryPart.join(other, thisKey, otherKey, selector, s), ctor, scopes);
    }

    last(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.last(predicate, scopes)]);
    }

    lastAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.executeAsync([...this.parts, QueryPart.last(predicate, scopes)]);
    }

    lastOrDefault(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.lastOrDefault(predicate, scopes)]);
    }

    lastOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.executeAsync([...this.parts, QueryPart.lastOrDefault(predicate, scopes)]);
    }

    max<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult {
        return this.provider.execute([...this.parts, QueryPart.max(selector, scopes)]);
    }

    maxAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<TResult> {
        return this.provider.executeAsync([...this.parts, QueryPart.max(selector, scopes)]);
    }

    min<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult {
        return this.provider.execute([...this.parts, QueryPart.min(selector, scopes)]);
    }

    minAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<TResult> {
        return this.provider.executeAsync([...this.parts, QueryPart.min(selector, scopes)]);
    }

    ofType<TResult extends T>(type: Ctor<TResult> | TResult | TypePredicate<TResult>): IQuery<TResult> {
        if (type == null) throw new Error('Value cannot be null. Parameter name: type');

        let ctor = <Ctor<TResult>>type;
        if (typeof type !== 'function') {
            ctor = <any>type.constructor;
        }
        else if (!isCtor(type)) {
            return this.create(QueryPart.guard(<any>type));
        }
        
        return (<IQuery<TResult>>this.create(QueryPart.ofType(ctor))).cast(ctor);
    }

    orderBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T> {
        return <any>this.create(QueryPart.orderBy(keySelector, scopes));
    }

    orderByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T> {
        return <any>this.create(QueryPart.orderByDescending(keySelector, scopes));
    }

    reverse(): IQuery<T> {
        return this.create(QueryPart.reverse());
    }

    select<TResult = any>(selector: Func1<T, TResult>, ...scopes): IQuery<TResult>;
    select<TResult = any>(selector: Func1<T, TResult>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult> {
        return this.fixCtorArg(s => QueryPart.select(selector, s), ctor, scopes);
    }

    selectMany<TResult>(selector: Func1<T, Array<TResult>>, ...scopes): IQuery<TResult>;
    selectMany<TResult>(selector: Func1<T, Array<TResult>>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult> {
        return this.fixCtorArg(s => QueryPart.selectMany(selector, s), ctor, scopes);
    }

    sequenceEqual(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): boolean {
        return this.provider.execute([...this.parts, QueryPart.sequenceEqual(other, comparer, scopes)]);
    }

    sequenceEqualAsync(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): PromiseLike<boolean> {
        return this.provider.executeAsync([...this.parts, QueryPart.sequenceEqual(other, comparer, scopes)]);
    }

    single(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.single(predicate, scopes)]);
    }

    singleAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.executeAsync([...this.parts, QueryPart.single(predicate, scopes)]);
    }

    singleOrDefault(predicate?: Predicate<T>, ...scopes): T {
        return this.provider.execute([...this.parts, QueryPart.singleOrDefault(predicate, scopes)]);
    }

    singleOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.executeAsync([...this.parts, QueryPart.singleOrDefault(predicate, scopes)]);
    }

    skip(count: number): IQuery<T> {
        return this.create(QueryPart.skip(count));
    }

    skipWhile(predicate: Predicate<T>, ...scopes): IQuery<T> {
        return this.create(QueryPart.skipWhile(predicate, scopes));
    }

    sum(selector?: Func1<T, number>, ...scopes): number {
        return this.provider.execute([...this.parts, QueryPart.sum(selector, scopes)]);
    }

    sumAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<number> {
        return this.provider.executeAsync([...this.parts, QueryPart.sum(selector, scopes)]);
    }

    take(count: number): IQuery<T> {
        return this.create(QueryPart.take(count));
    }

    takeWhile(predicate: Predicate<T>, ...scopes): IQuery<T> {
        return this.create(QueryPart.takeWhile(predicate, scopes));
    }

    thenBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T> {
        return <any>this.create(QueryPart.thenBy(keySelector, scopes));
    }

    thenByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T> {
        return <any>this.create(QueryPart.thenByDescending(keySelector, scopes));
    }

    union(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T> {
        return this.create(QueryPart.union(other, comparer, scopes));
    }

    where(predicate: Predicate<T>, ...scopes): IQuery<T> {
        return this.create(QueryPart.where(predicate, scopes));
    }

    zip<TOther, TResult = any>(other: Array<TOther>, selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult>;
    zip<TOther, TResult = any>(other: Array<TOther>, selector: Func2<T, TOther, TResult>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult> {
        return this.fixCtorArg(s => QueryPart.zip(other, selector, s), ctor, scopes);
    }

    toArray(ctor?: Ctor<T>): T[] & InlineCountInfo {
        const query = ctor ? this.cast(ctor) : this;
        return query.provider.execute([...query.parts, QueryPart.toArray()]);
    }

    toArrayAsync(ctor?: Ctor<T>): PromiseLike<T[] & InlineCountInfo> {
        const query = ctor ? this.cast(ctor) : this;
        return query.provider.executeAsync([...query.parts, QueryPart.toArray()]);
    }

    [Symbol.iterator]() {
        return this.provider.execute<IterableIterator<T>>(this.parts);
    }

    protected create<TResult = T>(part: IQueryPart): IQuery<TResult> {
        return <any>this.provider.createQuery([...this.parts, part]);
    }

    protected fixCtorArg(partCurry: (scopes: any[]) => IQueryPart, ctor: Ctor<any>, scopes: any[]) {
        if (ctor && typeof ctor !== 'function') {
            scopes = [ctor, ...scopes];
            ctor = null;
        }

        const query = this.create(partCurry(scopes));
        return ctor ? query.cast(ctor) : query;
    }
}

function isCtor(func) {
    if (func.prototype == null) return false;

    return !('' + func).includes('return');
}
