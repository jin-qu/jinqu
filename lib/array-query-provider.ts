import deepEqual = require('deep-equal');
import { IQueryProvider, IPartArgument, IQueryPart } from './types';
import { QueryFunc } from './query-part';
import { Query } from './queryable';

const orderFuncs = [QueryFunc.orderBy, QueryFunc.orderByDescending];
const thenFuncs = [QueryFunc.thenBy, QueryFunc.thenByDescending];
const descFuncs = [QueryFunc.orderByDescending, QueryFunc.thenByDescending];

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

export function execute(items: any[], parts: IQueryPart[]): any {
    if (!parts || !parts.length) return items;

    check(items);

    let value = items[Symbol.iterator]();
    let orderParts = [];
    for (let p of parts) {
        // accumulate consecutive sortings
        if (~thenFuncs.indexOf(p.type)) {
            orderParts.push(p);
            continue;
        }

        // if it is not a thenBy, apply previous sortings to items
        if (orderParts.length) {
            value = multiOrderBy(value, orderParts);
        }

        if (~orderFuncs.indexOf(p.type)) {
            // save the new sorting
            orderParts = [p];
        }
        else {
            // clear sortings
            orderParts = [];
            value = handlePart(value, p);
        }
    }

    // handle remaining sortings
    return orderParts.length ? multiOrderBy(value, orderParts) : value;
}

function handlePart(items: IterableIterator<any>, part: IQueryPart) {
    const f = funcs[part.type];
    if (!f) throw new Error(`Unknown query part type ${part.type}.`);

    return f.call(null, items, ...part.args);
}

const funcs = {
    where,
    ofType,
    cast,
    select,
    selectMany,
    joinWith,
    groupJoin,
    take,
    takeWhile,
    skip,
    skipWhile,
    groupBy,
    distinct,
    concatWith,
    zip,
    union,
    intersect,
    except,
    defaultIfEmpty,
    reverseTo,

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

function* where(items: IterableIterator<any>, predicate: IPartArgument) {
    for (let i of items) {
        if (predicate.func(i)) yield i;
    }
}

function* ofType(items: IterableIterator<any>, ctor: IPartArgument) {
    for (let i of items) {
        if (i !== Object(i)) {
            if (ctor.literal(i) === i)
                yield i;
        } else if (i instanceof ctor.literal)
            yield i;
    }
}

function* cast(items: IterableIterator<any>, ctor: IPartArgument) {
    for (let i of items) {
        if (i !== Object(i)) {
            const v = ctor.literal(i);
            if (v === NaN || v === null)
                throw new Error(`Unable to cast ${i}`);

            yield v;
        } else {
            if (i.constructor !== Object && !(i instanceof ctor.literal))
                throw new Error(`Unable to cast ${i}`);

            yield i;
        }
    }
}

function* select(items: IterableIterator<any>, selector: IPartArgument) {
    for (let i of items)
        yield selector.func(i);
}

function* selectMany(items: IterableIterator<any>, selector: IPartArgument) {
    for (let i of items) {
        for (let ii of selector.func(i))
            yield ii;
    }
}

function* joinWith(items: IterableIterator<any>, other: IPartArgument, thisKey: IPartArgument, otherKey: IPartArgument, selector: IPartArgument) {
    const os = getArray(other);

    for (let i of items) {
        var k = thisKey.func(i);
        for (let o of os) {
            if (deepEqual(otherKey.func(o), k))
                yield selector.func(i, o);
        }
    }
}

function* groupJoin(items: IterableIterator<any>, other: IPartArgument, thisKey: IPartArgument, otherKey: IPartArgument, selector: IPartArgument) {
    const os = getArray(other);

    for (let i of items) {
        var k = thisKey.func(i);
        yield selector.func(i, os.filter(o => deepEqual(otherKey.func(o), k)));
    }
}

function multiOrderBy(items: IterableIterator<any>, keySelectors: IQueryPart[]) {
    const arr = Array.from(items).sort((i1, i2) => {
        for (let s of keySelectors) {
            const desc = ~descFuncs.indexOf(s.type) ? 1 : -1;
            const sel = s.args[0];
            const v1 = sel.func(i1);
            const v2 = sel.func(i2);

            if (v1 < v2) return desc;
            if (v1 > v2) return -1 * desc;
        }
    });

    return arr[Symbol.iterator]();
}

function* take(items: IterableIterator<any>, count: IPartArgument) {
    let i = 0;
    for (let item of items) {
        if (++i <= count.literal)
            yield item;
        else break;
    }
}

function* takeWhile(items: IterableIterator<any>, predicate: IPartArgument) {
    for (let i of items) {
        if (predicate.func(i))
            yield i;
        else break;
    }
}

function* skip(items: IterableIterator<any>, count: IPartArgument) {
    let i = 0;
    for (let item of items) {
        if (++i > count.literal)
            yield item;
    }
}

function* skipWhile(items: IterableIterator<any>, predicate: IPartArgument) {
    let yielding = false;
    for (let i of items) {
        if (!yielding && !predicate.func(i)) {
            yielding = true;
        }

        if (yielding) yield i;
    }
}

function* groupBy(items: IterableIterator<any>, keySelector: IPartArgument, valueSelector: IPartArgument) {
    const groups = [];
    for (let i of items) {
        const k = keySelector.func(i);
        const a = groups.find(g => deepEqual(g.key, k));
        if (!a) {
            const group = [i];
            group['key'] = k;
            groups.push(group);
        }
        else {
            a.push(i);
        }
    }

    for (let g of groups)
        yield valueSelector.func(g);
}

function* distinct(items: IterableIterator<any>, comparer: IPartArgument) {
    const dist = [];
    for (let i of items) {
        if (!dist.find(d => comparer.func ? comparer.func(i, d) : (i == d))) {
            dist.push(i);
            yield i;
        }
    }
}

function* concatWith(items: IterableIterator<any>, other: IPartArgument) {
    const os = getArray(other);

    for (let i of items)
        yield i;

    for (let o of os)
        yield o;
}

function* zip(items: IterableIterator<any>, other: IPartArgument, selector: IPartArgument) {
    const os = getArray(other);

    let idx = 0;
    for (let i of items) {
        if (idx >= os.length) return;

        yield selector.func(i, os[idx++]);
    }
}

function* union(items: IterableIterator<any>, other: IPartArgument) {
    const s = new Set();

    for (let i of items) {
        if (!s.has(i)) {
            s.add(i);
            yield i;
        }
    }

    const os = getArray(other);
    for (let o of os) {
        if (!s.has(o)) {
            s.add(o);
            yield o;
        }
    }
}

function* intersect(items: IterableIterator<any>, other: IPartArgument) {
    const os = new Set(getArray(other));

    const s = new Set();
    for (let i of items) {
        if (os.has(i) && !s.has(i)) {
            s.add(i);
            yield i;
        }
    }
}

function* except(items: IterableIterator<any>, other: IPartArgument) {
    const os = new Set(getArray(other));

    const s = new Set();
    for (let i of items) {
        if (!os.has(i) && !s.has(i)) {
            s.add(i);
            yield i;
        }
    }
}

function* defaultIfEmpty(items: IterableIterator<any>) {
    return items;
}

function* reverseTo(items: IterableIterator<any>) {
    const arr = [];

    for (let i of items) {
        arr.splice(0, 0, i);
    }

    return arr;
}

function first(items: IterableIterator<any>, predicate: IPartArgument) {
    const [found, item] = getFirst(items, predicate);

    if (!found) throw new Error('Sequence contains no matching element');

    return item;
}

function firstOrDefault(items: IterableIterator<any>, predicate: IPartArgument) {
    return getFirst(items, predicate)[1];
}

function getFirst(items: IterableIterator<any>, predicate: IPartArgument) {
    for (let i of items) {
        if (!predicate.func || predicate.func(i)) return [true, i];
    }

    return [false, null]
}

function last(items: IterableIterator<any>, predicate: IPartArgument) {
    const [found, item] = getLast(items, predicate);

    if (!found) throw new Error('Sequence contains no matching element');

    return item;
}

function lastOrDefault(items: IterableIterator<any>, predicate: IPartArgument) {
    return getLast(items, predicate)[1];
}

function getLast(items: IterableIterator<any>, predicate: IPartArgument) {
    let last;

    for (let i of items) {
        if (!predicate.func || predicate.func(i)) {
            last = [true, i];
        }
    }
    
    return last ? last : [false, null];
}

function single(items: IterableIterator<any>, predicate: IPartArgument) {
    const [found, item] = getSingle(items, predicate);

    if (!found) throw new Error('Sequence contains no matching element');

    return item;
}

function singleOrDefault(items: IterableIterator<any>, predicate: IPartArgument) {
    return getSingle(items, predicate)[1];
}

function getSingle(items: IterableIterator<any>, predicate: IPartArgument) {
    let matches = [];
    for (let item of items) {
        if (predicate.func && !predicate.func(item)) continue;

        if (matches.length > 0)
            throw new Error('Sequence contains more than one matching element');

        matches.push(item);
    }

    return matches.length ? [true, matches[0]] : [false, null];
}

function elementAt(items: IterableIterator<any>, index: IPartArgument) {
    let idx = 0;
    for (let i of items) {
        if (idx++ === index.literal) return i;
    }
    
    throw new Error('Index was outside the bounds of the array.');
}

function elementAtOrDefault(items: IterableIterator<any>, index: IPartArgument) {
    return items[index.literal];
}

function contains(items: IterableIterator<any>, item: IPartArgument) {
    for (let i of items)
        if (i == item) return true;
    
    return false;
}

function sequenceEqual(items: IterableIterator<any>, other: IPartArgument) {
    let os = getArray(other);
    let idx = 0;

    for (let i of items) {
        if (idx >= os.length || i != os[i]) return false;
        idx++;
    }
    
    return idx === os.length;
}

function any(items: IterableIterator<any>, predicate: IPartArgument) {
    for (let i of items) {
        if (!predicate.func || predicate.func(i)) return true;
    }
    
    return false;
}

function all(items: IterableIterator<any>, predicate: IPartArgument) {
    for (let i of items) {
        if (!predicate.func(i)) return false;
    }
    
    return true;
}

function count(items: IterableIterator<any>, predicate: IPartArgument) {
    let c = 0;
    for (let i of items) {
        if (!predicate.func || predicate.func(i)) c++;
    }
    
    return c;
}

function min(items: IterableIterator<any>, selector: IPartArgument) {
    let min;
    for (let i of items) {
        let curr = selector.func ? selector.func(i) : i;
        if (min == null || curr < min) {
            min = i;
        }
    }
    
    return min;
}

function max(items: IterableIterator<any>, selector: IPartArgument) {
    let max;
    for (let i of items) {
        let curr = selector.func ? selector.func(i) : i;
        if (max == null || curr > max) {
            max = i;
        }
    }
    
    return max;
}

function sum(items: IterableIterator<any>, selector: IPartArgument) {
    let sum;
    for (let i of items) {
        let curr = selector.func ? selector.func(i) : i;
        sum += curr;
    }
    
    return sum;
}

function average(items: IterableIterator<any>, selector: IPartArgument) {
    let sum;
    let c = 0;
    for (let i of items) {
        let curr = selector.func ? selector.func(i) : i;
        sum += curr;
        c++;
    }
    
    return c === 0 ? 0 : sum / 0;
}

function aggregate(items: IterableIterator<any>, func: IPartArgument, seed: IPartArgument, selector: IPartArgument) {
    let s = seed.literal || 0;

    for (let i of items) {
        s = func.func(s, selector.func ? selector.func(i) : i);
    }
    
    return s;
}

function check(items) {
    if (!items) throw new TypeError('Cannot query null array.');
}

function getArray(arg: IPartArgument) {
    return (arg.func ? arg.func() : arg.literal) as any[];
}
