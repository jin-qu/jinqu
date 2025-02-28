import { QueryPart } from "./query-part";
import {
    Ctor,
    Func1,
    Func2,
    IGrouping,
    InlineCountInfo,
    IOrderedQuery,
    IQuery,
    IQueryPart,
    IQueryProvider,
    Predicate,
    Result,
    TypePredicate
} from "./shared";

export class Query<T = unknown, TExtra = object> implements IOrderedQuery<T, TExtra>, Iterable<T> {

    constructor(public readonly provider: IQueryProvider, public readonly parts: IQueryPart[] = []) {
    }

    public aggregate<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>,
        seed?: TAccumulate, ...scopes: unknown[]): TAccumulate {
        return this.provider.execute([...this.parts, QueryPart.aggregate(func, seed, scopes)]);
    }

    public aggregateAsync<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>,
        seed?: TAccumulate, ...scopes: unknown[]): PromiseLike<TAccumulate> {
        return this.provider.executeAsync([...this.parts, QueryPart.aggregate(func, seed, scopes)]);
    }

    public all(predicate: Predicate<T>, ...scopes: unknown[]): Result<boolean, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.all(predicate, scopes)]);
    }

    public allAsync(predicate: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<boolean, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.all(predicate, scopes)]);
    }

    public any(predicate?: Predicate<T>, ...scopes: unknown[]): Result<boolean, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.any(predicate, scopes)]);
    }

    public anyAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<boolean, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.any(predicate, scopes)]);
    }

    public average(selector?: Func1<T, number>, ...scopes: unknown[]): Result<number, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.average(selector, scopes)]);
    }

    public averageAsync(selector?: Func1<T, number>, ...scopes: unknown[]): PromiseLike<Result<number, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.average(selector, scopes)]);
    }

    public cast<TResult>(type: Ctor<TResult>): IQuery<TResult, TExtra> {
        return this.create(QueryPart.cast(type));
    }

    public concat(other: T[]): IQuery<T, TExtra> {
        return this.create(QueryPart.concat(other));
    }

    public contains(item: T, comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): Result<boolean, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.contains(item, comparer, scopes)]);
    }

    public containsAsync(item: T, comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): PromiseLike<Result<boolean, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.contains(item, comparer, scopes)]);
    }

    public count(predicate?: Predicate<T>, ...scopes: unknown[]): Result<number, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.count(predicate, scopes)]);
    }

    public countAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<number, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.count(predicate, scopes)]);
    }

    public defaultIfEmpty(defaultValue?: T): IQuery<T, TExtra> {
        return this.create(QueryPart.defaultIfEmpty(defaultValue));
    }

    public distinct(comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): IQuery<T, TExtra> {
        return this.create(QueryPart.distinct(comparer, scopes));
    }

    public elementAt(index: number): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.elementAt(index)]);
    }

    public elementAtAsync(index: number): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.elementAt(index)]);
    }

    public elementAtOrDefault(index: number): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.elementAtOrDefault(index)]);
    }

    public elementAtOrDefaultAsync(index: number): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.elementAtOrDefault(index)]);
    }

    public except(other: T[], comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): IQuery<T, TExtra> {
        return this.create(QueryPart.except(other, comparer, scopes));
    }

    public first(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.first(predicate, scopes)]);
    }

    public firstAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.first(predicate, scopes)]);
    }

    public firstOrDefault(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.firstOrDefault(predicate, scopes)]);
    }

    public firstOrDefaultAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.firstOrDefault(predicate, scopes)]);
    }

    public groupBy<TKey = unknown, TResult = IGrouping<T, TKey>>(
        keySelector: Func1<T, TKey>, elementSelector?: Func2<TKey, T[], TResult>, ...scopes: unknown[])
        : IQuery<TResult, TExtra>;
    // eslint-disable-next-line no-dupe-class-members
    public groupBy<TKey = unknown, TResult = IGrouping<T, TKey>>(
        keySelector: Func1<T, TKey>, elementSelector?: Func2<TKey, T[], TResult>, ctor?: Ctor<TResult>, ...scopes: unknown[])
        : IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.groupBy(keySelector, elementSelector, s), ctor, scopes) as never;
    }

    public groupJoin<TOther, TKey = unknown, TResult = unknown>(
        other: TOther[], thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther[], TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    // eslint-disable-next-line no-dupe-class-members
    public groupJoin<TOther, TKey = unknown, TResult = unknown>(
        other: TOther[], thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther[], TResult>, ctor: Ctor<TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.groupJoin(other, thisKey, otherKey, selector, s), ctor, scopes) as never;
    }

    public inlineCount(): IQuery<T, TExtra & InlineCountInfo> {
        return this.create(QueryPart.inlineCount());
    }

    public intersect(other: T[], comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): IQuery<T, TExtra> {
        return this.create(QueryPart.intersect(other, comparer, scopes));
    }

    public join<TOther, TResult = unknown, TKey = unknown>(
        other: TOther[], thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    // eslint-disable-next-line no-dupe-class-members
    public join<TOther, TResult = unknown, TKey = unknown>(
        other: TOther[], thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ctor: Ctor<TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.join(other, thisKey, otherKey, selector, s), ctor, scopes) as never;
    }

    public last(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.last(predicate, scopes)]);
    }

    public lastAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.last(predicate, scopes)]);
    }

    public lastOrDefault(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.lastOrDefault(predicate, scopes)]);
    }

    public lastOrDefaultAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.lastOrDefault(predicate, scopes)]);
    }

    public max<TResult = T>(selector?: Func1<T, TResult>, ...scopes: unknown[]): Result<TResult, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.max(selector, scopes)]);
    }

    public maxAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes: unknown[]): PromiseLike<Result<TResult, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.max(selector, scopes)]);
    }

    public min<TResult = T>(selector?: Func1<T, TResult>, ...scopes: unknown[]): Result<TResult, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.min(selector, scopes)]);
    }

    public minAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes: unknown[]): PromiseLike<Result<TResult, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.min(selector, scopes)]);
    }

    public ofGuardedType<TResult>(checker: TypePredicate<TResult>): IQuery<TResult, TExtra> {
        return this.create(QueryPart.ofGuardedType(checker as never));
    }

    public ofType<TResult extends T>(type: Ctor<TResult> | TResult): IQuery<TResult, TExtra> {
        const ctor = typeof type === "function" ? type : type.constructor;
        return this.create(QueryPart.ofType(ctor as never)).cast(ctor as never);
    }

    public orderBy(keySelector: Func1<T>, ...scopes: unknown[]): IOrderedQuery<T, TExtra> {
        return this.create(QueryPart.orderBy(keySelector, scopes)) as never;
    }

    public orderByDescending(keySelector: Func1<T>, ...scopes: unknown[]): IOrderedQuery<T, TExtra> {
        return this.create(QueryPart.orderByDescending(keySelector, scopes)) as never;
    }

    public reverse(): IQuery<T, TExtra> {
        return this.create(QueryPart.reverse());
    }

    public select<TResult = unknown>(selector: Func1<T, TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    // eslint-disable-next-line no-dupe-class-members
    public select<TResult = unknown>(selector: Func1<T, TResult>, ctor: Ctor<TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.select(selector, s), ctor, scopes) as never;
    }

    public selectMany<TResult>(selector: Func1<T, TResult[]>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    // eslint-disable-next-line no-dupe-class-members
    public selectMany<TResult>(selector: Func1<T, TResult[]>, ctor: Ctor<TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.selectMany(selector, s), ctor, scopes) as never;
    }

    public sequenceEqual(other: T[], comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): Result<boolean, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.sequenceEqual(other, comparer, scopes)]);
    }

    public sequenceEqualAsync(other: T[], comparer?: Func2<T, T, boolean>, ...scopes: unknown[])
        : PromiseLike<Result<boolean, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.sequenceEqual(other, comparer, scopes)]);
    }

    public single(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.single(predicate, scopes)]);
    }

    public singleAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.single(predicate, scopes)]);
    }

    public singleOrDefault(predicate?: Predicate<T>, ...scopes: unknown[]): Result<T, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.singleOrDefault(predicate, scopes)]);
    }

    public singleOrDefaultAsync(predicate?: Predicate<T>, ...scopes: unknown[]): PromiseLike<Result<T, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.singleOrDefault(predicate, scopes)]);
    }

    public skip(count: number): IQuery<T, TExtra> {
        return this.create(QueryPart.skip(count));
    }

    public skipWhile(predicate: Predicate<T>, ...scopes: unknown[]): IQuery<T, TExtra> {
        return this.create(QueryPart.skipWhile(predicate, scopes));
    }

    public sum(selector?: Func1<T, number>, ...scopes: unknown[]): Result<number, TExtra> {
        return this.provider.execute([...this.parts, QueryPart.sum(selector, scopes)]);
    }

    public sumAsync(selector?: Func1<T, number>, ...scopes: unknown[]): PromiseLike<Result<number, TExtra>> {
        return this.provider.executeAsync([...this.parts, QueryPart.sum(selector, scopes)]);
    }

    public take(count: number): IQuery<T, TExtra> {
        return this.create(QueryPart.take(count));
    }

    public takeWhile(predicate: Predicate<T>, ...scopes: unknown[]): IQuery<T, TExtra> {
        return this.create(QueryPart.takeWhile(predicate, scopes));
    }

    public thenBy(keySelector: Func1<T>, ...scopes: unknown[]): IOrderedQuery<T, TExtra> {
        return this.create(QueryPart.thenBy(keySelector, scopes)) as never;
    }

    public thenByDescending(keySelector: Func1<T>, ...scopes: unknown[]): IOrderedQuery<T, TExtra> {
        return this.create(QueryPart.thenByDescending(keySelector, scopes)) as never;
    }

    public union(other: T[], comparer?: Func2<T, T, boolean>, ...scopes: unknown[]): IQuery<T, TExtra> {
        return this.create(QueryPart.union(other, comparer, scopes));
    }

    public where(predicate: Predicate<T>, ...scopes: unknown[]): IQuery<T, TExtra> {
        return this.create(QueryPart.where(predicate, scopes));
    }

    public zip<TOther, TResult = unknown>(other: TOther[], selector: Func2<T, TOther, TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra>;
    // eslint-disable-next-line no-dupe-class-members
    public zip<TOther, TResult = unknown>(other: TOther[], selector: Func2<T, TOther, TResult>, ctor: Ctor<TResult>, ...scopes: unknown[]): IQuery<TResult, TExtra> {
        return this.fixCtorArg(s => QueryPart.zip(other, selector, s), ctor, scopes) as never;
    }

    public toArray(ctor?: Ctor<T>): Result<T[], TExtra> {
        const query = ctor ? this.cast(ctor) : this;
        return query.provider.execute([...query.parts, QueryPart.toArray()]);
    }

    public toArrayAsync(ctor?: Ctor<T>): PromiseLike<Result<T[], TExtra>> {
        const query = ctor ? this.cast(ctor) : this;
        return query.provider.executeAsync([...query.parts, QueryPart.toArray()]);
    }

    public [Symbol.iterator]() {
        const result = this.provider.execute(this.parts);
        return ("value" in result ? result.value : result) as never;
    }

    protected create<TResult = T, TNewExtra = TExtra>(part: IQueryPart): IQuery<TResult, TNewExtra> {
        return this.provider.createQuery([...this.parts, part]) as never;
    }

    protected fixCtorArg(partCurry: (scopes: unknown[]) => IQueryPart, ctor: Ctor<unknown>, ...scopes: unknown[]) {
        if (ctor && typeof ctor !== "function") {
            scopes = [ctor, ...scopes];
            ctor = null;
        }

        const query = this.create(partCurry(scopes));
        return ctor ? query.cast(ctor) : query;
    }
}
