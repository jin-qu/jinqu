import { QueryPart, QueryPartType } from "./query-part";

interface IGrouping<T, TKey> extends Array<T> {
    Key: TKey;
}

export interface IQuery<T = any> {
    where(predicate: (i: T) => boolean | string, ...scopes): IQuery<T>;
    ofType<TResult>(type: new (...args) => TResult): IQuery<TResult>;
    cast<TResult>(type: new (...args) => TResult): IQuery<TResult>;
    select<TResult = any>(selector: (i: T) => TResult | string, ...scopes): IQuery<TResult>;
    selectMany<TResult = any>(selector: (i: T) => Array<TResult> |  string, ...scopes): IQuery<TResult>;
    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey |  string, otherKey: (item: TOther) => TKey |  string,
                                            selector: (item: T, other: TOther) => TResult |  string, ...scopes): IQuery<TResult>;
    groupJoin<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => TKey | string, otherKey: (item: TOther) => TKey | string,
                                            selector: (item: T, other: Array<TOther>) => TResult |  string, ...scopes): IQuery<TResult>;
    orderBy(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T>;
    orderByDescending(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T>;
    thenBy(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T>;
    thenByDescending(keySelector: (item: T) => any, ...scopes): IOrderedQuery<T>;
    take(count: number): IQuery<T>;
    takeWhile(predicate: (i: T) => boolean | string, ...scopes): IQuery<T>;
    skip(count: number): IQuery<T>;
    skipWhile(predicate: (i: T) => boolean | string, ...scopes): IQuery<T>;
    groupBy<TResult = any, TKey = any>(keySelector: (item: T) => TKey | string, valueSelector: (group: IGrouping<T, TKey>) => TResult | string, ...scopes): IQuery<TResult>;
    distinct(comparer?: (x, y) => boolean |  string, ...scopes): IQuery<T>;
    concat(other: Array<T> |  string, ...scopes): IQuery<T>;
    zip<TOther, TResult = any>(other: Array<TOther>, selector: (item: T, other: TOther) => TResult |  string, ...scopes): IQuery<TResult>;
    union(other: Array<T> | string, ...scopes): IQuery<T>;
    intersect(other: Array<T> |  string, ...scopes): IQuery<T>;
    except(other: Array<T> |  string, ...scopes): IQuery<T>;
    first(predicate: (i: T) => boolean | string, ...scopes): T;
    firstOrDefault(predicate: (i: T) => boolean | string, ...scopes): T;
    last(predicate: (i: T) => boolean | string, ...scopes): T;
    lastOrDefault(predicate: (i: T) => boolean | string, ...scopes): T;
    single(predicate: (i: T) => boolean | string, ...scopes): T;
    singleOrDefault(predicate: (i: T) => boolean | string, ...scopes): T;
    elementAt(index: number): T;
    elementAtOrDefault(index: number): T;
    defaultIfEmpty(): IQuery<T>;
    contains(item: T): boolean;
    reverse(): IQuery<T>;
    sequenceEqual(other: Array<T> | string, ...scopes): boolean;
    any(predicate?: (i: T) => boolean | string, ...scopes): boolean;
    all(predicate: (i: T) => boolean | string, ...scopes): boolean;
    count(predicate: (i: T) => boolean | string, ...scopes): number;
    min<TResult = T>(selector?: (i: T) => TResult |  string, ...scopes): TResult;
    max<TResult = T>(selector?: (i: T) => TResult |  string, ...scopes): TResult;
    sum(selector: (i: T) => number |  string, ...scopes): number;
    average(selector: (i: T) => number |  string, ...scopes): number;
    aggregate<TAccumulate = any, TResult = TAccumulate>(func: (aggregate: TAccumulate, item: T) => TAccumulate | string, seed?: TAccumulate,
                                                        selector?: (acc: TAccumulate) => TResult, ...scopes): IQuery<TResult>;
}

export interface IOrderedQuery<T = any> extends IQuery<T> {
    thenBy(selector: (T) => any): IOrderedQuery<T>;
    thenByDescending(): IOrderedQuery<T>;
}

export interface IQueryProvider {
    createQuery<T>(parts: QueryPart[]): IQuery<T>;
    execute<TResult = any>(query: Query, ...scopes): TResult;
}

export class Query<T = any> implements IQuery<T> {

    constructor(private _provider: IQueryProvider, private _parts: QueryPart[] = []) {
    }

    where(predicate: (i) => boolean | string, ...scopes) {
        return this.create(QueryPart.where(predicate, scopes));
    }

    ofType<TResult>(type: new (...args) => TResult) {
        return this.create<TResult>(QueryPart.ofType(type));
    }

    cast<TResult>(type: new (...args) => TResult) {
        return this.create<TResult>(QueryPart.cast(type));
    }

    select<TResult = any>(selector: (i: T) => string | TResult, ...scopes: any[]): IQuery<TResult> {
        throw new Error("Method not implemented.");
    }

    selectMany<TResult = any>(selector: (i: T) => string | TResult[], ...scopes: any[]): IQuery<TResult> {
        throw new Error("Method not implemented.");
    }

    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: (item: T) => string | TKey, otherKey: (item: TOther) => string | TKey,
                                            selector: (item: T, other: TOther) => string | TResult, ...scopes: any[]): IQuery<T> {
        return this.create(QueryPart.join());
    }

    groupJoin<TOther, TResult = any, TKey = any>(other: TOther[], thisKey: (item: T) => string | TKey, otherKey: (item: TOther) => string | TKey,
                                                 selector: (item: T, other: TOther[]) => string | TResult, ...scopes: any[]): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    orderBy(keySelector: (item: T) => , ...scopes: any[]): IOrderedQuery<T> {
        throw new Error("Method not implemented.");
    }

    orderByDescending(keySelector: (item: T) => , ...scopes: any[]): IOrderedQuery<T> {
        throw new Error("Method not implemented.");
    }

    thenBy(keySelector: (item: T) => , ...scopes: any[]): IOrderedQuery<T> {
        throw new Error("Method not implemented.");
    }

    thenByDescending(keySelector: (item: T) => , ...scopes: any[]): IOrderedQuery<T> {
        throw new Error("Method not implemented.");
    }

    take(count: number): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    takeWhile(predicate: (i: T) => string | boolean, ...scopes: any[]): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    skip(count: number): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    skipWhile(predicate: (i: T) => string | boolean, ...scopes: any[]): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    groupBy<TResult = any, TKey = any>(keySelector: (item: T) => string | TKey, valueSelector: (group: IGrouping<T, TKey>) => string | TResult, ...scopes: any[]): IQuery<TResult> {
        throw new Error("Method not implemented.");
    }

    distinct(comparer?: (x: any, y: any) => string | boolean, ...scopes: any[]): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    concat(other: string | T[], ...scopes: any[]): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    zip<TOther, TResult = any>(other: TOther[], selector: (item: T, other: TOther) => string | TResult, ...scopes: any[]): IQuery<TResult> {
        throw new Error("Method not implemented.");
    }

    union(other: string | T[], ...scopes: any[]): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    intersect(other: string | T[], ...scopes: any[]): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    except(other: string | T[], ...scopes: any[]): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    first(predicate: (i: T) => string | boolean, ...scopes: any[]): T {
        throw new Error("Method not implemented.");
    }

    firstOrDefault(predicate: (i: T) => string | boolean, ...scopes: any[]): T {
        throw new Error("Method not implemented.");
    }

    last(predicate: (i: T) => string | boolean, ...scopes: any[]): T {
        throw new Error("Method not implemented.");
    }

    lastOrDefault(predicate: (i: T) => string | boolean, ...scopes: any[]): T {
        throw new Error("Method not implemented.");
    }

    single(predicate: (i: T) => string | boolean, ...scopes: any[]): T {
        throw new Error("Method not implemented.");
    }

    singleOrDefault(predicate: (i: T) => string | boolean, ...scopes: any[]): T {
        throw new Error("Method not implemented.");
    }

    elementAt(index: number): T {
        throw new Error("Method not implemented.");
    }

    elementAtOrDefault(index: number): T {
        throw new Error("Method not implemented.");
    }

    defaultIfEmpty(): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    contains(item: T): boolean {
        throw new Error("Method not implemented.");
    }

    reverse(): IQuery<T> {
        throw new Error("Method not implemented.");
    }

    sequenceEqual(other: string | T[], ...scopes: any[]): boolean {
        throw new Error("Method not implemented.");
    }

    any(predicate?: (i: T) => string | boolean, ...scopes: any[]): boolean {
        throw new Error("Method not implemented.");
    }

    all(predicate: (i: T) => string | boolean, ...scopes: any[]): boolean {
        throw new Error("Method not implemented.");
    }

    count(predicate: (i: T) => string | boolean, ...scopes: any[]): number {
        throw new Error("Method not implemented.");
    }

    min(): T;
    min<TResult = T>(selector: (i: T) => string | TResult, ...scopes: any[]): TResult;
    min(...rest?: any[]) {
        throw new Error("Method not implemented.");
    }

    max(): T;
    max<TResult = T>(selector: (i: T) => string | TResult, ...scopes: any[]): TResult;
    max(...rest?: any[]) {
        throw new Error("Method not implemented.");
    }

    sum(): number;
    sum<TResult = T>(selector: (i: T) => string | TResult, ...scopes: any[]): TResult;
    sum(...rest?: any[]) {
        throw new Error("Method not implemented.");
    }

    average(): number;
    average<TResult = T>(selector: (i: T) => string | TResult, ...scopes: any[]): TResult;
    average(...rest?: any[]) {
        throw new Error("Method not implemented.");
    }

    aggregate<TAccumulate = any, TResult = TAccumulate>(func: (aggregate: TAccumulate, item: T) => string | TAccumulate, seed?: TAccumulate, selector?: (acc: TAccumulate) => TResult, ...scopes: any[]): IQuery<TResult> {
        throw new Error("Method not implemented.");
    }

    protected create<TResult = T>(part: QueryPart) {
        return this._provider.createQuery<TResult>([...this._parts, part]);
    }
}
