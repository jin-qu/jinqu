import deepEqual = require('deep-equal');
import { IQueryProvider, IPartArgument, IQueryPart, IQuery } from './types';
import { QueryFunc } from './query-part';
import { Query } from './queryable';

const orderFuncs = [QueryFunc.orderBy, QueryFunc.orderByDescending, QueryFunc.thenBy, QueryFunc.thenByDescending];
const descFuncs = [QueryFunc.orderByDescending, QueryFunc.thenByDescending];
const countModifiers = [
    QueryFunc.aggregate,
    QueryFunc.concat,
    QueryFunc.distinct,
    QueryFunc.except,
    QueryFunc.groupBy,
    QueryFunc.groupJoin,
    QueryFunc.intersect,
    QueryFunc.join,
    QueryFunc.ofType,
    QueryFunc.selectMany,
    QueryFunc.union,
    QueryFunc.where,
    QueryFunc.zip
];

export class ArrayQueryProvider implements IQueryProvider {

    constructor(private readonly items: any[] | IterableIterator<any>) {
        check(items);
    }

    createQuery<T>(parts?: IQueryPart[]): Query<T> {
        return new Query<T>(this, parts);
    }

    execute<TResult = any>(parts: IQueryPart[]): TResult {
        if (!parts || !parts.length) return <any>this.items;

        let value = this.items instanceof Array ? this.items[Symbol.iterator]() : this.items;

        let inlineCountEnabled: boolean;
        let inlineCount: number;
        let orderParts = [];

        for (let p of parts) {
            if (p.type === QueryFunc.inlineCount) {
                inlineCountEnabled = true;
                continue;
            }
            else if (p.type === QueryFunc.skip || p.type === QueryFunc.take) {
                if (inlineCountEnabled && inlineCount == null) {
                    const arr = Array.from(value);
                    inlineCount = arr.length;
                    value = arr[Symbol.iterator]();
                }
            }
            else if (~countModifiers.indexOf(p.type)) {
                inlineCount = null;
            }
            else if (~orderFuncs.indexOf(p.type)) {
                // accumulate consecutive sortings
                orderParts.push(p);
                continue;
            }

            // if it is not an order, apply previous sortings
            if (orderParts.length) {
                value = this.multiOrderBy(value, orderParts);
            }

            // clear sortings
            orderParts = [];
            value = this.handlePart(value, p);
        }

        // handle remaining sortings. necessary when last query part is an order
        if (orderParts.length) {
            value = this.multiOrderBy(value, orderParts);
        }

        if (inlineCountEnabled && value instanceof Array) {
            value['$inlineCount'] = inlineCount != null ? inlineCount : value.length;
        }

        return <any>value;
    }

    executeAsync<TResult = any>(parts: IQueryPart[]): PromiseLike<TResult> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.execute(parts));
            }
            catch (e) {
                reject(e);
            }
        });
    }

    handlePart(items: IterableIterator<any>, part: IQueryPart) {
        const f = funcs[part.type];
        if (!f) throw new Error(`Unknown query part type ${part.type}.`);

        return f.call(null, items, ...part.args);
    }

    multiOrderBy(items: IterableIterator<any>, keySelectors: IQueryPart[]) {
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
}

const funcs = {

    aggregate(items: IterableIterator<any>, func: IPartArgument, seed: IPartArgument) {
        let s = seed.literal || 0;

        for (let i of items) {
            s = func.func(s, i);
        }

        return s;
    },

    all(items: IterableIterator<any>, predicate: IPartArgument) {
        for (let i of items) {
            if (!predicate.func(i)) return false;
        }

        return true;
    },

    any(items: IterableIterator<any>, predicate: IPartArgument) {
        for (let i of items) {
            if (!predicate.func || predicate.func(i)) return true;
        }

        return false;
    },

    average(items: IterableIterator<any>, selector: IPartArgument) {
        let sum = 0, c = 0;
        for (let i of items) {
            let curr = selector.func ? selector.func(i) : i;
            sum += curr;
            c++;
        }

        return c === 0 ? 0 : sum / c;
    },

    cast: function* (items: IterableIterator<any>, ctor: IPartArgument) {
        for (let i of items) {
            if (i == null) {
                yield i;
                continue;
            }

            if (i !== Object(i)) {
                const v = ctor.literal(i);
                if (isNaN(v) || v === null)
                    throw new Error(`Unable to cast ${i}`);

                yield v;
            } else {
                if (i.constructor !== Object && !(i instanceof ctor.literal))
                    throw new Error(`Unable to cast ${i}`);

                yield i;
            }
        }
    },

    concat: function* (items: IterableIterator<any>, other: IPartArgument) {
        const os = getArray(other);

        for (let i of items)
            yield i;

        for (let o of os)
            yield o;
    },

    contains(items: IterableIterator<any>, item: IPartArgument, comparer: IPartArgument) {
        for (let i of items) {
            if (comparer.func ? comparer.func(i, item.literal) : i == item.literal)
                return true;
        }

        return false;
    },

    count(items: IterableIterator<any>, predicate: IPartArgument) {
        let c = 0;
        for (let i of items) {
            if (!predicate.func || predicate.func(i)) c++;
        }

        return c;
    },

    defaultIfEmpty(items: IterableIterator<any>, defaultValue: IPartArgument) {
        var arr = Array.from(items);
        if (arr.length) return arr[Symbol.iterator]();

        return defaultValue.literal != null ? [defaultValue.literal] : [];
    },

    distinct: function* (items: IterableIterator<any>, comparer: IPartArgument) {
        const dist = [];
        const c = <(a, b) => boolean>(comparer.func || ((a, b) => a == b));
        for (let i of items) {
            if (dist.find(d => c(i, d)))
                continue;

            dist.push(i);
            yield i;
        }
    },

    elementAt(items: IterableIterator<any>, index: IPartArgument) {
        let idx = 0;
        for (let i of items) {
            if (idx++ === index.literal) return i;
        }

        throw new Error('Index was outside the bounds of the array.');
    },

    elementAtOrDefault(items: IterableIterator<any>, index: IPartArgument) {
        let idx = 0;
        for (let i of items) {
            if (idx++ === index.literal) return i;
        }

        return null;
    },

    except: function* (items: IterableIterator<any>, other: IPartArgument, comparer: IPartArgument) {
        const dist = [];
        const c = <(a, b) => boolean>(comparer.func || ((a, b) => a == b));
        for (let i of items) {
            if (dist.find(d => c(i, d)) || other.literal.find(d => c(i, d)))
                continue;

            dist.push(i);
            yield i;
        }
    },

    first(items: IterableIterator<any>, predicate: IPartArgument) {
        const [found, item] = getFirst(items, predicate);

        if (!found) throw new Error('Sequence contains no matching element');

        return item;
    },

    firstOrDefault(items: IterableIterator<any>, predicate: IPartArgument) {
        return getFirst(items, predicate)[1];
    },

    groupBy: function* (items: IterableIterator<any>, keySelector: IPartArgument, elementSelector: IPartArgument) {
        const groups: Array<{ key, group: any[] }> = [];
        for (let i of items) {
            const key = keySelector.func(i);
            const a = groups.find(g => deepEqual(g.key, key));
            if (!a) {
                const group = [i];
                groups.push({ key, group });
            }
            else {
                a.group.push(i);
            }
        }

        for (let g of groups) {
            if (elementSelector.func) {
                yield elementSelector.func(g.key, g.group);
            }
            else {
                g.group["key"] = g.key;
                yield g.group;
            }
        }
    },

    groupJoin: function* (items: IterableIterator<any>, other: IPartArgument, thisKey: IPartArgument, otherKey: IPartArgument, selector: IPartArgument) {
        const os = getArray(other);

        for (let i of items) {
            var k = thisKey.func(i);
            yield selector.func(i, os.filter(o => deepEqual(otherKey.func(o), k)));
        }
    },

    intersect: function* (items: IterableIterator<any>, other: IPartArgument, comparer: IPartArgument) {
        const dist = [];
        const c = <(a, b) => boolean>(comparer.func || ((a, b) => a == b));
        for (let i of items) {
            if (dist.find(d => c(i, d)) || !other.literal.find(d => c(i, d)))
                continue;

            dist.push(i);
            yield i;
        }
    },

    join: function* (items: IterableIterator<any>, other: IPartArgument, thisKey: IPartArgument, otherKey: IPartArgument, selector: IPartArgument) {
        const os = getArray(other);

        for (let i of items) {
            var k = thisKey.func(i);
            for (let o of os) {
                if (deepEqual(otherKey.func(o), k))
                    yield selector.func(i, o);
            }
        }
    },

    last(items: IterableIterator<any>, predicate: IPartArgument) {
        const [found, item] = getLast(items, predicate);

        if (!found) throw new Error('Sequence contains no matching element');

        return item;
    },

    lastOrDefault(items: IterableIterator<any>, predicate: IPartArgument) {
        return getLast(items, predicate)[1];
    },

    max(items: IterableIterator<any>, selector: IPartArgument) {
        let max;
        for (let i of items) {
            let curr = selector.func ? selector.func(i) : i;
            if (max == null || curr > max) {
                max = curr;
            }
        }

        return max;
    },

    min(items: IterableIterator<any>, selector: IPartArgument) {
        let min;
        for (let i of items) {
            let curr = selector.func ? selector.func(i) : i;
            if (min == null || curr < min) {
                min = curr;
            }
        }

        return min;
    },

    ofType: function* (items: IterableIterator<any>, ctor: IPartArgument) {
        for (let i of items) {
            if (i !== Object(i)) {
                if (ctor.literal(i) === i)
                    yield i;
            } else if (i instanceof ctor.literal)
                yield i;
        }
    },

    reverse: function* (items: IterableIterator<any>) {
        const arr = [];

        for (let i of items) {
            arr.splice(0, 0, i);
        }

        return arr;
    },

    select: function* (items: IterableIterator<any>, selector: IPartArgument) {
        for (let i of items)
            yield selector.func(i);
    },

    selectMany: function* (items: IterableIterator<any>, selector: IPartArgument) {
        for (let i of items) {
            for (let ii of selector.func(i))
                yield ii;
        }
    },

    sequenceEqual(items: IterableIterator<any>, other: IPartArgument, comparer: IPartArgument) {
        let os = getArray(other);
        let idx = 0;

        const c = <(a, b) => boolean>(comparer.func || ((a, b) => a == b));
        for (let i of items) {
            if (idx >= os.length || !c(i, os[idx++])) return false;
        }

        return idx === os.length;
    },

    single(items: IterableIterator<any>, predicate: IPartArgument) {
        const [found, item] = getSingle(items, predicate);

        if (!found) throw new Error('Sequence contains no matching element');

        return item;
    },

    singleOrDefault(items: IterableIterator<any>, predicate: IPartArgument) {
        return getSingle(items, predicate)[1];
    },

    skip: function* (items: IterableIterator<any>, count: IPartArgument) {
        let i = 0;
        for (let item of items) {
            if (++i > count.literal)
                yield item;
        }
    },

    skipWhile: function* (items: IterableIterator<any>, predicate: IPartArgument) {
        let yielding = false;
        for (let i of items) {
            if (!yielding && !predicate.func(i)) {
                yielding = true;
            }

            if (yielding) yield i;
        }
    },

    sum(items: IterableIterator<any>, selector: IPartArgument) {
        let sum = 0;
        for (let i of items) {
            let curr = selector.func ? selector.func(i) : i;
            sum += curr;
        }

        return sum;
    },

    take: function* (items: IterableIterator<any>, count: IPartArgument) {
        let i = 0;
        for (let item of items) {
            if (++i <= count.literal)
                yield item;
            else break;
        }
    },

    takeWhile: function* (items: IterableIterator<any>, predicate: IPartArgument) {
        for (let i of items) {
            if (predicate.func(i))
                yield i;
            else break;
        }
    },

    union: function* (items: IterableIterator<any>, other: IPartArgument, comparer: IPartArgument) {
        const dist = [];

        const c = <(a, b) => boolean>(comparer.func || ((a, b) => a == b));
        for (let i of items) {
            if (!dist.find(d => c(i, d))) {
                dist.push(i);
                yield i;
            }
        }

        const os = getArray(other);
        for (let o of os) {
            if (!dist.find(d => c(o, d))) {
                dist.push(o);
                yield o;
            }
        }
    },

    where: function* (items: IterableIterator<any>, predicate: IPartArgument) {
        for (let i of items) {
            if (predicate.func(i)) yield i;
        }
    },

    zip: function* (items: IterableIterator<any>, other: IPartArgument, selector: IPartArgument) {
        const os = getArray(other);

        let idx = 0;
        for (let i of items) {
            if (idx >= os.length) return;

            yield selector.func(i, os[idx++]);
        }
    },

    toArray(items: IterableIterator<any>) {
        return Array.from(items);
    }
};

function check(items) {
    if (!items) throw new TypeError('Cannot query null array.');
}

function getArray(arg: IPartArgument) {
    return arg.literal as any[];
}

function getFirst(items: IterableIterator<any>, predicate: IPartArgument) {
    for (let i of items) {
        if (!predicate.func || predicate.func(i)) return [true, i];
    }

    return [false, null]
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
