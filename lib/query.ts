import { QueryPart } from "./query-part";
import { 
    Ctor, Func1, Func2, Predicate, IGrouping, IQueryProvider, IQueryPart, 
    IQuery, IOrderedQuery, InlineCountInfo, TypePredicate, Result 
} from './types';

export class Query<T = any, TExtra = {}> implements IOrderedQuery<T, TExtra>, Iterable<T> {

    constructor(public readonly provider: IQueryProvider, public readonly parts: IQueryPart[] = []) {
    }

    aggregate<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate, ...scopes): TAccumulate {
        return this.provider.execute([...this.parts, QueryPart.aggregate(func, seed, scopes)]);
    }

    aggregateAsync<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate, ...scopes): PromiseLike<TAccumulate> {
        return this.provider.executeAsync([...this.parts, QueryPart.aggregate(func, seed, scopes)]);
    }

    all(predicate: Predicate<T>, ...scopes): Result<boolean, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.all(predicate, scopes)]);
    }

    allAsync(predicate: Predicate<T>, ...scopes): PromiseLike<Result<boolean, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.all(predicate, scopes)]);
    }

    any(predicate?: Predicate<T>, ...scopes): Result<boolean, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.any(predicate, scopes)]);
    }

    anyAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<boolean, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.any(predicate, scopes)]);
    }

    average(selector?: Func1<T, number>, ...scopes): Result<number, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.average(selector, scopes)]);
    }

    averageAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<Result<number, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.average(selector, scopes)]);
    }

    cast<TResult>(type: Ctor<TResult>): IQuery<TResult, TExtra> {
        return this.create(QueryPart.cast(type));
    }

    concat(other: Array<T>): IQuery<T, TExtra> {
        return this.create(QueryPart.concat(other));
    }

    contains(item: T, comparer?: Func2<T, T, boolean>, ...scopes): Result<boolean, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.contains(item, comparer, scopes)]);
    }

    containsAsync(item: T, comparer?: Func2<T, T, boolean>, ...scopes): PromiseLike<Result<boolean, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.contains(item, comparer, scopes)]);
    }

    count(predicate?: Predicate<T>, ...scopes): Result<number, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.count(predicate, scopes)]);
    }

    countAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<number, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.count(predicate, scopes)]);
    }

    defaultIfEmpty(defaultValue?: T): IQuery<T, TExtra> {
        return this.create(QueryPart.defaultIfEmpty(defaultValue));
    }

    distinct(comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TExtra> {
        return this.create(QueryPart.distinct(comparer, scopes));
    }

    elementAt(index: number): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.elementAt(index)]);
    }

    elementAtAsync(index: number): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.elementAt(index)]);
    }

    elementAtOrDefault(index: number): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.elementAtOrDefault(index)]);
    }

    elementAtOrDefaultAsync(index: number): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.elementAtOrDefault(index)]);
    }

    except(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TExtra> {
        return this.create(QueryPart.except(other, comparer, scopes));
    }

    first(predicate?: Predicate<T>, ...scopes): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.first(predicate, scopes)]);
    }

    firstAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.first(predicate, scopes)]);
    }

    firstOrDefault(predicate?: Predicate<T>, ...scopes): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.firstOrDefault(predicate, scopes)]);
    }

    firstOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.firstOrDefault(predicate, scopes)]);
    }

    groupBy<TKey = any, TResult = IGrouping<T, TKey>>(keySelector: Func1<T, TKey>,
        elementSelector?: Func2<TKey, Array<T>, TResult>, ...scopes): IQuery<TResult, TExtra>;
    groupBy<TKey = any, TResult = IGrouping<T, TKey>>(keySelector: Func1<T, TKey>,
        elementSelector?: Func2<TKey, Array<T>, TResult>, ctor?: Ctor<TResult>, ...scopes): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.groupBy(keySelector, elementSelector, s), ctor, scopes);
    }

    groupJoin<TOther, TKey = any, TResult = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, Array<TOther>, TResult>, ...scopes): IQuery<TResult, TExtra>;
    groupJoin<TOther, TKey = any, TResult = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, Array<TOther>, TResult>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.groupJoin(other, thisKey, otherKey, selector, s), ctor, scopes);
    }

    inlineCount(): IQuery<T, TExtra & InlineCountInfo> {
        return this.create(QueryPart.inlineCount());
    }
    
    intersect(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TExtra> {
        return this.create(QueryPart.intersect(other, comparer, scopes));
    }

    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult, TExtra>;
    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.join(other, thisKey, otherKey, selector, s), ctor, scopes);
    }

    last(predicate?: Predicate<T>, ...scopes): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.last(predicate, scopes)]);
    }

    lastAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.last(predicate, scopes)]);
    }

    lastOrDefault(predicate?: Predicate<T>, ...scopes): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.lastOrDefault(predicate, scopes)]);
    }

    lastOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.lastOrDefault(predicate, scopes)]);
    }

    max<TResult = T>(selector?: Func1<T, TResult>, ...scopes): Result<TResult, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.max(selector, scopes)]);
    }

    maxAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<Result<TResult, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.max(selector, scopes)]);
    }

    min<TResult = T>(selector?: Func1<T, TResult>, ...scopes): Result<TResult, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.min(selector, scopes)]);
    }

    minAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<Result<TResult, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.min(selector, scopes)]);
    }

    ofGuardedType<TResult>(checker: TypePredicate<TResult>): IQuery<TResult, TExtra> {
        return this.create(QueryPart.ofGuardedType(<any>checker));
    }

    ofType<TResult extends T>(type: Ctor<TResult> | TResult): IQuery<TResult, TExtra> {
        let ctor: any = typeof type === 'function' ? type : type.constructor;
        return (<IQuery<TResult, TExtra>>this.create(QueryPart.ofType(ctor))).cast(ctor);
    }

    orderBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T, TExtra> {
        return <any>this.create(QueryPart.orderBy(keySelector, scopes));
    }

    orderByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T, TExtra> {
        return <any>this.create(QueryPart.orderByDescending(keySelector, scopes));
    }

    reverse(): IQuery<T, TExtra> {
        return this.create(QueryPart.reverse());
    }

    select<TResult = any>(selector: Func1<T, TResult>, ...scopes): IQuery<TResult, TExtra>;
    select<TResult = any>(selector: Func1<T, TResult>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.select(selector, s), ctor, scopes);
    }

    selectMany<TResult>(selector: Func1<T, Array<TResult>>, ...scopes): IQuery<TResult, TExtra>;
    selectMany<TResult>(selector: Func1<T, Array<TResult>>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.selectMany(selector, s), ctor, scopes);
    }

    sequenceEqual(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): Result<boolean, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.sequenceEqual(other, comparer, scopes)]);
    }

    sequenceEqualAsync(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): PromiseLike<Result<boolean, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.sequenceEqual(other, comparer, scopes)]);
    }

    single(predicate?: Predicate<T>, ...scopes): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.single(predicate, scopes)]);
    }

    singleAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.single(predicate, scopes)]);
    }

    singleOrDefault(predicate?: Predicate<T>, ...scopes): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.singleOrDefault(predicate, scopes)]);
    }

    singleOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.singleOrDefault(predicate, scopes)]);
    }

    skip(count: number): IQuery<T, TExtra> {
        return this.create(QueryPart.skip(count));
    }

    skipWhile(predicate: Predicate<T>, ...scopes): IQuery<T, TExtra> {
        return this.create(QueryPart.skipWhile(predicate, scopes));
    }

    sum(selector?: Func1<T, number>, ...scopes): Result<number, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.sum(selector, scopes)]);
    }

    sumAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<Result<number, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.sum(selector, scopes)]);
    }

    take(count: number): IQuery<T, TExtra> {
        return this.create(QueryPart.take(count));
    }

    takeWhile(predicate: Predicate<T>, ...scopes): IQuery<T, TExtra> {
        return this.create(QueryPart.takeWhile(predicate, scopes));
    }

    thenBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T, TExtra> {
        return <any>this.create(QueryPart.thenBy(keySelector, scopes));
    }

    thenByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T, TExtra> {
        return <any>this.create(QueryPart.thenByDescending(keySelector, scopes));
    }

    union(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TExtra> {
        return this.create(QueryPart.union(other, comparer, scopes));
    }

    where(predicate: Predicate<T>, ...scopes): IQuery<T, TExtra> {
        return this.create(QueryPart.where(predicate, scopes));
    }

    zip<TOther, TResult = any>(other: Array<TOther>, selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult, TExtra>;
    zip<TOther, TResult = any>(other: Array<TOther>, selector: Func2<T, TOther, TResult>, ctor: Ctor<TResult>, ...scopes): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.zip(other, selector, s), ctor, scopes);
    }

    toArray(ctor?: Ctor<T>): T[] & TExtra {
        const query = ctor ? this.cast(ctor) : this;
        return query.provider.execute([...query.parts, QueryPart.toArray()]);
    }

    toArrayAsync(ctor?: Ctor<T>): PromiseLike<T[] & TExtra> {
        const query = ctor ? this.cast(ctor) : this;
        return query.provider.executeAsync([...query.parts, QueryPart.toArray()]);
    }

    [Symbol.iterator]() {
        return this.provider.execute<IterableIterator<T>>(this.parts);
    }

    protected create<TResult = T, TNewExtra = TExtra>(part: IQueryPart): IQuery<TResult, TNewExtra> {
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
