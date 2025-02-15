import { plainToClass } from "class-transformer";
import { Query } from "./query";
import { QueryFunc } from "./query-part";
import { Ctor, IPartArgument, IQueryPart, IQueryProvider } from "./shared";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import deepEqual = require("deep-equal");

const primitives = [Number, Boolean, String];
const orderFuncs = [QueryFunc.orderBy, QueryFunc.orderByDescending, QueryFunc.thenBy, QueryFunc.thenByDescending];
const descFuncs = [QueryFunc.orderByDescending, QueryFunc.thenByDescending];
const executors = [
    QueryFunc.aggregate,
    QueryFunc.all,
    QueryFunc.any,
    QueryFunc.average,
    QueryFunc.contains,
    QueryFunc.elementAt,
    QueryFunc.elementAtOrDefault,
    QueryFunc.first,
    QueryFunc.firstOrDefault,
    QueryFunc.last,
    QueryFunc.lastOrDefault,
    QueryFunc.max,
    QueryFunc.min,
    QueryFunc.sequenceEqual,
    QueryFunc.single,
    QueryFunc.singleOrDefault,
    QueryFunc.sum,
    QueryFunc.toArray,
];
const countModifiers = [
    QueryFunc.concat,
    QueryFunc.distinct,
    QueryFunc.except,
    QueryFunc.groupBy,
    QueryFunc.groupJoin,
    QueryFunc.intersect,
    QueryFunc.join,
    QueryFunc.ofGuardedType,
    QueryFunc.ofType,
    QueryFunc.skipWhile,
    QueryFunc.takeWhile,
    QueryFunc.union,
    QueryFunc.where,
    QueryFunc.zip,
];

export class ArrayQueryProvider implements IQueryProvider {

    constructor(private readonly items?: unknown[] | IterableIterator<unknown> | null) {
        if (!items)
            throw new TypeError("Cannot query null array.");
    }

    public createQuery<T>(parts?: IQueryPart[], ctor?: Ctor<T>): Query<T> {
        const query = new Query<T>(this, parts);
        return ctor ? (query.cast(ctor) as never) : query;
    }

    public execute<TResult = unknown>(parts?: IQueryPart[] | null): TResult {
        if (!parts || !parts.length)
            return this.items as never;

        let ctor: Ctor<unknown> = null;
        let value = this.items instanceof Array ? this.items[Symbol.iterator]() : this.items;

        let inlineCountEnabled: boolean;
        let orderParts = [];
        let inlineCount: number = null;

        for (const p of parts) {
            if (p.type === QueryFunc.inlineCount) {
                inlineCountEnabled = true;
                continue;
            } else if (orderFuncs.indexOf(p.type) !== -1) {
                // accumulate consecutive sorting
                orderParts.push(p);
                continue;
            } else if (p.type === QueryFunc.skip || p.type === QueryFunc.take || executors.indexOf(p.type) !== -1) {
                if (inlineCountEnabled && inlineCount == null) {
                    [inlineCount, value] = getCount(value);
                }
            } else if (p.type === QueryFunc.cast) {
                ctor = p.args[0].literal as Ctor<unknown>;
            } else if (countModifiers.indexOf(p.type) !== -1) {
                inlineCount = null;
            }

            // if it is not an order, apply previous sorting
            if (orderParts.length) {
                value = this.multiOrderBy(value, orderParts);
            }

            // clear sorting
            orderParts = [];
            value = this.handlePart(value, p);
        }

        // handle remaining sorting. necessary when last query part is an order
        if (orderParts.length) {
            value = this.multiOrderBy(value, orderParts);
        }

        value = (ctor ? plainToClass(ctor, value) : value) as IterableIterator<unknown>;

        if (inlineCountEnabled) {
            value = { value, inlineCount } as never;
        }

        return value as never;
    }

    public executeAsync<TResult = unknown>(parts: IQueryPart[]): PromiseLike<TResult> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.execute(parts));
            } catch (e) {
                reject(e);
            }
        });
    }

    public handlePart(items: IterableIterator<unknown>, part: IQueryPart) {
        const f = funcs[part.type];
        if (!f)
            throw new Error(`Unknown query part type ${part.type}.`);

        return f.call(null, items, ...part.args);
    }

    public multiOrderBy(items: IterableIterator<unknown>, keySelectors: IQueryPart[]) {
        const arr = Array.from(items).sort((i1, i2) => {
            for (const s of keySelectors) {
                const desc = descFuncs.indexOf(s.type) !== -1 ? 1 : -1;
                const sel = s.args[0];
                const v1 = sel.func(i1);
                const v2 = sel.func(i2);

                if (v1 < v2)
                    return desc;

                if (v1 > v2)
                    return -1 * desc;
            }
        });

        return arr[Symbol.iterator]();
    }
}

const funcs = {

    aggregate(items: IterableIterator<unknown>, func: IPartArgument, seed: IPartArgument) {
        let s = seed.literal || 0;

        for (const i of items) {
            s = func.func(s, i);
        }

        return s;
    },

    all(items: IterableIterator<unknown>, predicate: IPartArgument) {
        for (const i of items) {
            if (!predicate.func(i))
                return false;
        }

        return true;
    },

    any(items: IterableIterator<unknown>, predicate: IPartArgument) {
        for (const i of items) {
            if (!predicate.func || predicate.func(i))
                return true;
        }

        return false;
    },

    average(items: IterableIterator<unknown>, selector: IPartArgument) {
        let sum = 0;
        let c = 0;
        for (const i of items) {
            const curr = selector.func ? selector.func(i) : i;
            sum += curr;
            c++;
        }

        return c === 0 ? 0 : sum / c;
    },

    *cast(items: IterableIterator<unknown>, ctor: IPartArgument) {
        for (const i of items) {
            if (i == null) {
                yield i;
                continue;
            }

            if (i !== Object(i)) {
                const v = (ctor.literal as (arg: any) => any)(i);
                if (v == null || (ctor.literal === Number && isNaN(v)))
                    throw new Error(`Unable to cast ${i}`);

                yield v;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                if (i.constructor !== Object && !(i instanceof (ctor.literal as Function)))
                    throw new Error(`Unable to cast ${i}`);

                yield i;
            }
        }
    },

    *concat(items: IterableIterator<unknown>, other: IPartArgument) {
        const os = getArray(other);

        for (const i of items)
            yield i;

        for (const o of os)
            yield o;
    },

    contains(items: IterableIterator<unknown>, item: IPartArgument, comparer: IPartArgument) {
        for (const i of items) {
            if (comparer.func ? comparer.func(i, item.literal) : i === item.literal)
                return true;
        }

        return false;
    },

    count(items: IterableIterator<unknown>, predicate: IPartArgument) {
        let c = 0;
        for (const i of items) {
            if (!predicate.func || predicate.func(i)) {
                c++;
            }
        }

        return c;
    },

    defaultIfEmpty(items: IterableIterator<unknown>, defaultValue: IPartArgument) {
        const arr = Array.from(items);
        if (arr.length)
            return arr[Symbol.iterator]();

        return defaultValue.literal != null ? [defaultValue.literal] : [];
    },

    *distinct(items: IterableIterator<unknown>, comparer: IPartArgument) {
        const dist = [];
        const c = (comparer.func || ((a, b) => a === b)) as (a: unknown, b: unknown) => boolean;
        for (const i of items) {
            if (dist.find(d => c(i, d)))
                continue;

            dist.push(i);
            yield i;
        }
    },

    elementAt(items: IterableIterator<unknown>, index: IPartArgument) {
        let idx = 0;
        for (const i of items) {
            if (idx++ === index.literal)
                return i;
        }

        throw new Error("Index was outside the bounds of the array.");
    },

    elementAtOrDefault(items: IterableIterator<unknown>, index: IPartArgument) {
        let idx = 0;
        for (const i of items) {
            if (idx++ === index.literal)
                return i;
        }

        return null;
    },

    *except(items: IterableIterator<unknown>, other: IPartArgument, comparer: IPartArgument) {
        const dist = [];
        const c = (comparer.func || ((a, b) => a === b)) as (a: unknown, b: unknown) => boolean;
        for (const i of items) {
            if (dist.find(d => c(i, d)) || other.literal["find"]((d: unknown) => c(i, d)))
                continue;

            dist.push(i);
            yield i;
        }
    },

    first(items: IterableIterator<unknown>, predicate: IPartArgument) {
        const [found, item] = getFirst(items, predicate);

        if (!found)
            throw new Error("Sequence contains no matching element");

        return item;
    },

    firstOrDefault(items: IterableIterator<unknown>, predicate: IPartArgument) {
        return getFirst(items, predicate)[1];
    },

    *groupBy(items: IterableIterator<unknown>, keySelector: IPartArgument, elementSelector: IPartArgument) {
        const groups: { key: unknown, group: unknown[] }[] = [];
        for (const i of items) {
            const key = keySelector.func(i);
            const a = groups.find(g => deepEqual(g.key, key));
            if (!a) {
                const group = [i];
                groups.push({ key, group });
            } else {
                a.group.push(i);
            }
        }

        for (const g of groups) {
            if (elementSelector.func)
                yield elementSelector.func(g.key, g.group);
            else {
                g.group["key"] = g.key;
                yield g.group;
            }
        }
    },

    *groupJoin(items: IterableIterator<unknown>, other: IPartArgument, thisKey: IPartArgument,
                otherKey: IPartArgument, selector: IPartArgument) {
        const os = getArray(other);

        for (const i of items) {
            const k = thisKey.func(i);
            yield selector.func(i, os.filter(o => deepEqual(otherKey.func(o), k)));
        }
    },

    *intersect(items: IterableIterator<unknown>, other: IPartArgument, comparer: IPartArgument) {
        const dist = [];
        const c = (comparer.func || ((a, b) => a === b)) as (a: unknown, b: unknown) => boolean;
        for (const i of items) {
            if (dist.find((d: unknown) => c(i, d)) || !other.literal["find"]((d: unknown) => c(i, d)))
                continue;

            dist.push(i);
            yield i;
        }
    },

    *join(items: IterableIterator<unknown>, other: IPartArgument, thisKey: IPartArgument,
            otherKey: IPartArgument, selector: IPartArgument) {
        const os = getArray(other);

        for (const i of items) {
            const k = thisKey.func(i);
            for (const o of os) {
                if (deepEqual(otherKey.func(o), k))
                    yield selector.func(i, o);
            }
        }
    },

    last(items: IterableIterator<unknown>, predicate: IPartArgument) {
        const [found, item] = getLast(items, predicate);

        if (!found)
            throw new Error("Sequence contains no matching element");

        return item;
    },

    lastOrDefault(items: IterableIterator<unknown>, predicate: IPartArgument) {
        return getLast(items, predicate)[1];
    },

    max(items: IterableIterator<unknown>, selector: IPartArgument) {
        let max: unknown;
        for (const i of items) {
            const curr = selector.func ? selector.func(i) : i;
            if (max == null || curr > max) {
                max = curr;
            }
        }

        return max;
    },

    min(items: IterableIterator<unknown>, selector: IPartArgument) {
        let min: unknown;
        for (const i of items) {
            const curr = selector.func ? selector.func(i) : i;
            if (min == null || curr < min) {
                min = curr;
            }
        }

        return min;
    },

    *ofGuardedType(items: IterableIterator<unknown>, typeGuard: IPartArgument) {
        const predicate = typeGuard.literal as (i: unknown) => boolean;
        for (const i of items) {
            if (predicate(i))
                yield i;
        }
    },

    *ofType(items: IterableIterator<unknown>, ctor: IPartArgument) {
        const type = ctor.literal;
        const isPrimitive = primitives.indexOf(type as never) !== -1;
        for (const i of items) {
            // if type is primitive
            if (isPrimitive && i !== Object(i)) {
                if ((type as (...args: any[]) => any)(i) === i)
                    yield i;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
            } else if (i instanceof (type as Function))
                yield i;
        }
    },

    // eslint-disable-next-line require-yield
    *reverse(items: IterableIterator<unknown>) {
        const arr = [];

        for (const i of items) {
            arr.splice(0, 0, i);
        }

        return arr;
    },

    *select(items: IterableIterator<unknown>, selector: IPartArgument) {
        for (const i of items)
            yield selector.func(i);
    },

    *selectMany(items: IterableIterator<unknown>, selector: IPartArgument) {
        for (const i of items) {
            for (const ii of selector.func(i))
                yield ii;
        }
    },

    sequenceEqual(items: IterableIterator<unknown>, other: IPartArgument, comparer: IPartArgument) {
        const os = getArray(other);
        let idx = 0;

        const c = (comparer.func || ((a, b) => a === b)) as (a: unknown, b: unknown) => boolean;
        for (const i of items) {
            if (idx >= os.length || !c(i, os[idx++]))
                return false;
        }

        return idx === os.length;
    },

    single(items: IterableIterator<unknown>, predicate: IPartArgument) {
        const [found, item] = getSingle(items, predicate);

        if (!found)
            throw new Error("Sequence contains no matching element");

        return item;
    },

    singleOrDefault(items: IterableIterator<unknown>, predicate: IPartArgument) {
        return getSingle(items, predicate)[1];
    },

    *skip(items: IterableIterator<unknown>, count: IPartArgument) {
        let i = 0;
        for (const item of items) {
            if (++i > (count.literal as number))
                yield item;
        }
    },

    *skipWhile(items: IterableIterator<unknown>, predicate: IPartArgument) {
        let yielding = false;
        for (const i of items) {
            if (!yielding && !predicate.func(i)) {
                yielding = true;
            }

            if (yielding)
                yield i;
        }
    },

    sum(items: IterableIterator<unknown>, selector: IPartArgument) {
        let sum = 0;
        for (const i of items) {
            const curr = selector.func ? selector.func(i) : i;
            sum += curr;
        }

        return sum;
    },

    *take(items: IterableIterator<unknown>, count: IPartArgument) {
        let i = 0;
        for (const item of items) {
            if (++i <= (count.literal as number))
                yield item;
            else
                break;
        }
    },

    *takeWhile(items: IterableIterator<unknown>, predicate: IPartArgument) {
        for (const i of items) {
            if (predicate.func(i))
                yield i;
            else
                break;
        }
    },

    *union(items: IterableIterator<unknown>, other: IPartArgument, comparer: IPartArgument) {
        const dist = [];

        const c = (comparer.func || ((a, b) => a === b)) as (a: unknown, b: unknown) => boolean;
        for (const i of items) {
            if (!dist.find(d => c(i, d))) {
                dist.push(i);
                yield i;
            }
        }

        const os = getArray(other);
        for (const o of os) {
            if (!dist.find(d => c(o, d))) {
                dist.push(o);
                yield o;
            }
        }
    },

    *where(items: IterableIterator<unknown>, predicate: IPartArgument) {
        for (const i of items) {
            if (predicate.func(i))
                yield i;
        }
    },

    *zip(items: IterableIterator<unknown>, other: IPartArgument, selector: IPartArgument) {
        const os = getArray(other);

        let idx = 0;
        for (const i of items) {
            if (idx >= os.length)
                return;

            yield selector.func(i, os[idx++]);
        }
    },

    toArray(items: IterableIterator<unknown>) {
        return Array.from(items);
    },
};

function getArray(arg: IPartArgument) {
    return arg.literal as unknown[];
}

function getFirst(items: IterableIterator<unknown>, predicate: IPartArgument) {
    for (const i of items) {
        if (!predicate.func || predicate.func(i))
            return [true, i];
    }

    return [false, null];
}

function getLast(items: IterableIterator<unknown>, predicate: IPartArgument) {
    let last: any;

    for (const i of items) {
        if (!predicate.func || predicate.func(i)) {
            last = [true, i];
        }
    }

    return last ? last : [false, null];
}

function getSingle(items: IterableIterator<unknown>, predicate: IPartArgument) {
    const matches = [];
    for (const item of items) {
        if (predicate.func && !predicate.func(item))
            continue;

        if (matches.length > 0)
            throw new Error("Sequence contains more than one matching element");

        matches.push(item);
    }

    return matches.length ? [true, matches[0]] : [false, null];
}

function getCount<T>(it: IterableIterator<T>): [number, IterableIterator<T>] {
    const arr = Array.from(it);
    return [arr.length, arr[Symbol.iterator]()];
}
