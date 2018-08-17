import { IQueryProvider, IPartArgument, IQueryPart, IQuery, Predicate } from './types';
import { QueryFunc } from './query-part';
import { Query } from './queryable';

const orderFuncs = [QueryFunc.orderBy, QueryFunc.orderByDescending, QueryFunc.thenBy, QueryFunc.thenByDescending];

export class ArrayQueryProvider implements IQueryProvider {

    constructor(private readonly items: any[]) {
    }

    createQuery<T>(parts?: IQueryPart[]): Query<T> {
        return new Query<T>(this, parts);
    }

    execute<TResult = any>(parts: IQueryPart[]): TResult {
        return execute(this.items, parts);
    }
}

export function execute(items: any[], parts: IQueryPart[]) {
    if (!parts || !parts.length) return items;
    
    check(items);
    
    let value: any = items;
    let orderParts = [];
    for (let p of parts) {
        if (orderFuncs.contains(p.type)) {
            orderParts.push(p);
        }
        else {
            if (orderParts.length) {
                value = orderBy(items, orderParts);
                orderParts = [];
            }

            value = handlePart(value, p);
        }
    }
    return value;
}

function handlePart(items: any[], part: IQueryPart) {
    return funcs[part.type].call(null, items, ...part.args);
}

const funcs = {
    where,
    ofType,
    cast,
    select,
    selectMany,
    join,
    groupJoin,
    take,
    takeWhile,
    skip,
    skipWhile,
    groupBy,
    distinct,
    concat,
    zip,
    union,
    intersect,
    except,
    defaultIfEmpty,
    reverse,

    first,
    firstOrDefault,
    last,
    lastOrDefault,
    single,
    singleOrDefault,
    elementAt,
    elementAtOrDefault,
    contains,
    sequenceEqual,
    any,
    all,
    count,
    min,
    max,
    sum,
    average,
    aggregate
}

function* where(items: any[], predicate: IPartArgument) {
    for (let i of items) {
        if (predicate.func(i)) yield i;
    }
}

function ofType(items: any[]) { return items; }

function cast(items: any[]) { return items; }

function* select(items: any[], selector: IPartArgument) {
    for (let i in items)
        yield selector.func(i);
}

function* selectMany(items: any[], selector: IPartArgument) {
    for (let i in items) {
        for (let ii in selector.func(i))
            yield ii;
    }
}

function join(items: any[], other: IPartArgument, thisKey: IPartArgument, otherKey: IPartArgument, selector: IPartArgument) {
}

function groupJoin(items: any[], other: IPartArgument, thisKey: IPartArgument, otherKey: IPartArgument, selector: IPartArgument) {
}

function orderBy(items: any[], keySelectors: IQueryPart[]) {
}

function take(items: any[], count: IPartArgument) {
    return items.slice(0, count.literal);
}

function* takeWhile(items: any[], predicate: IPartArgument) {
    for (let i in items) {
        if (predicate.func(i))
            yield i;
        else break;
    }
}

function skip(items: any[], count: IPartArgument) {
    return items.slice(count.literal);
}

function* skipWhile(items: any[], predicate: IPartArgument) {
    for (let i in items) {
        if (predicate.func(i))
            break;
        else yield i;
    }
}

function* groupBy(items: any[], keySelector: IPartArgument, valueSelector: IPartArgument) {
}

function distinct(items: any[], comparer: IPartArgument) {
    // comparer nullable
}

function concat(items: any[], other: IPartArgument) {
    return Array.prototype.concat.call(items, other)
}

function zip(items: any[], other: IPartArgument, selector: IPartArgument) {
}

function union(items: any[], other: IPartArgument) {
}

function intersect(items: any[], other: IPartArgument) {
}

function except(items: any[], other: IPartArgument) {
}

function defaultIfEmpty(items: any[]) {
    return items || [];
}

function reverse(items: any[]) {
    return Array.prototype.reverse.call(items.slice());
}

function first(items: any[], predicate: IPartArgument) {
    if (!items.length) throw new Error('Sequence contains no element')
    
    const i = predicate.func ? items.find(<any>predicate.func) : items[0];
    if (!i) throw new Error('Sequence contains no matching element');

    return i;
}

function firstOrDefault(items: any[], predicate: IPartArgument) {
    return predicate.func ? items.find(<any>predicate.func) : items[0];
}

function last(items: any[], predicate: IPartArgument) {
    // predicate nullable
}

function lastOrDefault(items: any[], predicate: IPartArgument) {
    // predicate nullable
}

function single(items: any[], predicate: IPartArgument) {
    if (!items.length) throw new Error('Sequence contains no element');
    
    if (predicate.func) {
        const matches = getSingle(items, predicate);
        if (matches.length !== 1) throw new Error('Sequence contains no matching element');

        return matches[0];
    }

    if (items.length > 1) throw new Error('Sequence contains more than one matching element');

    return items[0];
}

function singleOrDefault(items: any[], predicate: IPartArgument) {
    if (predicate.func)
        return getSingle(items, predicate)[0];

    if (items.length > 1) throw new Error('Sequence contains more than one matching element');

    return items[0];
}

function getSingle(items: any[], predicate: IPartArgument) {
    const matches = [];
    for (let item of items) {
        if (!predicate.func(item)) continue;

        if (matches.length > 0) 
            throw new Error('Sequence contains more than one matching element');

        matches.push(item);
    }

    return matches;
}

function elementAt(items: any[], index: IPartArgument) {
    if (index.literal > items.length)
        throw new Error('Index was outside the bounds of the array.');
    
    return items[index.literal];
}

function elementAtOrDefault(items: any[], index: IPartArgument) {
    return items[index.literal];
}

function contains(items: any[], item: IPartArgument) {
    return items.indexOf(item) > 0;
}

function sequenceEqual(items: any[], other: IPartArgument) {    
}

function any(items: any[], predicate: IPartArgument) {
    return predicate.func ? items.some(<any>predicate.func) : items.length;
}

function all(items: any[], predicate: IPartArgument) {
    return items.every(<any>predicate.func);
}

function count(items: any[], predicate: IPartArgument) {
    return items.filter(<any>predicate.func).length;
}

function min(items: any[], selector: IPartArgument) {
    return Math.min(selector.func ? selector.func(items) : items);
}

function max(items: any[], selector: IPartArgument) {
    return Math.max(selector.func ? selector.func(items) : items);
}

function sum(items: any[], selector: IPartArgument) {
    if (selector.func) {
        items = selector.func(items);
    }

    return items.reduce((p, c) => p + c, 0);
}

function average(items: any[], selector: IPartArgument) {
    return sum(items, selector) / items.length;
}

function aggregate(items: any[], func: IPartArgument, seed: IPartArgument, selector: IPartArgument) {
    if (selector.func) {
        items = selector.func(items);
    }

    return items.reduce(<any>func, seed);
}




function check(items) {
    if (!items) throw new TypeError('Cannot query null array.');
}
