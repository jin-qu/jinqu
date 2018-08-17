import { IQueryProvider, IPartArgument, IQueryPart, IQuery, Predicate } from './types';
import { QueryFunc } from './query-part';
import { Query } from './queryable';

const thenFuncs = [QueryFunc.thenBy, QueryFunc.thenByDescending];

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
    if (!parts || !parts.length) return items;

    check(items);

    let value: any = items;
    let orderParts = [];
    for (let p of parts) {
        if (thenFuncs.contains(p.type)) {
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
    for (let i of items) {
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
    // todo
}

function groupJoin(items: any[], other: IPartArgument, thisKey: IPartArgument, otherKey: IPartArgument, selector: IPartArgument) {
    // todo
}

function orderBy(items: any[], keySelectors: IQueryPart[]) {
    // todo
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
    // todo
}

function distinct(items: any[], comparer: IPartArgument) {
    const r = [];
    for (let i = 0; i < items.length; i++) {
        const i1 = items[i];
        let j = i
        for (; j < items.length; j++) {
            const i2 = items[j];
            if (comparer.func ? comparer.func(i1, i2) : (i1 == i2)) break;
        }

        if (j === items.length) {
            r.push(i1);
        }
    }

    return r;
}

function concat(items: any[], other: IPartArgument) {
    return Array.prototype.concat.call(items, other)
}

function zip(items: any[], other: IPartArgument, selector: IPartArgument) {
    // todo
}

function union(items: any[], other: IPartArgument) {
    // todo
}

function intersect(items: any[], other: IPartArgument) {
    // todo
}

function except(items: any[], other: IPartArgument) {
    // todo
}

function defaultIfEmpty(items: any[]) {
    return items || [];
}

function reverse(items: any[]) {
    return Array.prototype.reverse.call(items.slice());
}

function first(items: any[], predicate: IPartArgument) {
    if (!items.length) throw new Error('Sequence contains no element')

    const [found, item] = getFirst(items, predicate);

    if (!found) throw new Error('Sequence contains no matching element');

    return item;
}

function firstOrDefault(items: any[], predicate: IPartArgument) {
    return getFirst(items, predicate)[1];
}

function getFirst(items: any[], predicate: IPartArgument) {
    for (let i of items) {
        if (!predicate.func || predicate.func(i)) return [true, i];
    }

    return [false, null]
}

function last(items: any[], predicate: IPartArgument) {
    if (!items.length) throw new Error('Sequence contains no element');

    const [found, item] = getLast(items, predicate);

    if (!found) throw new Error('Sequence contains no matching element');

    return item;
}

function lastOrDefault(items: any[], predicate: IPartArgument) {
    return getLast(items, predicate)[1];
}

function getLast(items: any[], predicate: IPartArgument) {
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (!predicate.func || predicate.func(item)) return [true, item];
    }

    return [false, null];
}

function single(items: any[], predicate: IPartArgument) {
    if (!items.length) throw new Error('Sequence contains no element');

    const [found, item] = getSingle(items, predicate);
   
    if (!found) throw new Error('Sequence contains no matching element');

    return item;
}

function singleOrDefault(items: any[], predicate: IPartArgument) {
    return getSingle(items, predicate)[1];
}

function getSingle(items: any[], predicate: IPartArgument) {
    let matches = [];
    for (let item of items) {
        if (predicate.func && !predicate.func(item)) continue;

        if (matches.length > 0)
            throw new Error('Sequence contains more than one matching element');

        matches.push(item);
    }
    
    return matches.length ? [true, matches[0]] : [false, null];
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
    const o = other.literal;
    if (!o || items.length !== o.length) return false;

    for (let i = 0; i < items.length; i++) {
        if (items[i] != o[i]) return false;
    }

    return true;
}

function any(items: any[], predicate: IPartArgument) {
    return predicate.func ? items.some(<any>predicate.func) : items.length > 0;
}

function all(items: any[], predicate: IPartArgument) {
    return items.every(<any>predicate.func);
}

function count(items: any[], predicate: IPartArgument) {
    return predicate.func ? items.filter(<any>predicate.func).length : items.length;
}

function min(items: any[], selector: IPartArgument) {
    return Math.min(selector.func ? <any>items.map(<any>selector.func) : items);
}

function max(items: any[], selector: IPartArgument) {
    return Math.max(selector.func ? <any>items.map(<any>selector.func) : items);
}

function sum(items: any[], selector: IPartArgument) {
    let s = 0;
    for (let i of items) {
        s += selector.func ? selector.func(i) : i;
    }

    return s;
}

function average(items: any[], selector: IPartArgument) {
    return items.length ? sum(items, selector) / items.length : 0;
}

function aggregate(items: any[], func: IPartArgument, seed: IPartArgument, selector: IPartArgument) {
    let s = seed.literal != null ? seed.literal : 0;
    for (let i of items) {
        s = func.func(s, selector.func ? selector.func(i) : i);
    }

    return items.reduce(<any>func, seed);
}

function check(items) {
    if (!items) throw new TypeError('Cannot query null array.');
}
