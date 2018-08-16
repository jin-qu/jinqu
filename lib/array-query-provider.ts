import { IQueryProvider, IPartArgument, IQueryPart, IQuery } from './types';
import { Query } from './queryable';

export class ArrayQueryProvider implements IQueryProvider {

    constructor(private readonly items: any[]) {
    }

    createQuery<T>(parts?: IQueryPart[]) {
        return new Query<T>(this, parts);
    }

    execute<TResult = any>(parts: IQueryPart[]): TResult {
        return execute(this.items, parts);
    }
}

export function execute(items: any[], parts: IQueryPart[]) {
    let value: any = items;
    for (let i = 0; i < parts.length; i++) {
        value = handlePart(value, parts[i]);
    }
    return value;
}

function handlePart(items: any[], part: IQueryPart) {
    return funcs[part.type].call(null, items, ...part.args);
}

const funcs = {
    where(items: any[], predicate: IPartArgument) {
        if (!items) return items;

        return items.filter(i => predicate.func(i));
    },
    ofType(items: any[]) { return items; },
    cast(items: any[]) { return items; },
    select(items: any[], selector: IPartArgument) {
        if (!items) return items;

        return items.map(i => selector.func(i));
    },
    selectMany(items: any[], selector: IPartArgument) {
        if (!items) return items;

        const arr = [];
        return items.forEach(i => arr.push(selector.func(i)));
    },
    join(items: any[], other: IPartArgument, thisKey: IPartArgument, otherKey: IPartArgument, selector: IPartArgument) {
    },
    groupJoin(items, other: IPartArgument, thisKey: IPartArgument, otherKey: IPartArgument, selector: IPartArgument) {
    },
    orderBy(keySelector: IPartArgument) {
    },
    orderByDescending(keySelector: IPartArgument) {
    },
    take(count: IPartArgument) {
    },
    takeWhile(predicate: IPartArgument) {
    },
    skip(count: IPartArgument) {
    },
    skipWhile(predicate: IPartArgument) {
    },
    groupBy(keySelector: IPartArgument, valueSelector: IPartArgument, ...scopes) {
    },
    distinct(comparer: IPartArgument) {
    },
    concat(other: IPartArgument) {
    },
    zip(other: IPartArgument, selector: IPartArgument) {
    },
    union(other: IPartArgument) {
    },
    intersect(other: IPartArgument) {
    },
    except(other: IPartArgument) {
    },
    defaultIfEmpty() {
    },
    reverse(items: any[]) {
        return Array.prototype.reverse.call(items.slice());
    },

    first(predicate: IPartArgument) {
    },
    firstOrDefault(predicate: IPartArgument) {
    },
    last(predicate: IPartArgument) {
    },
    lastOrDefault(predicate: IPartArgument) {
    },
    single(predicate: IPartArgument) {
    },
    singleOrDefault(predicate: IPartArgument) {
    },
    elementAt(index: IPartArgument) {
    },
    elementAtOrDefault(index: IPartArgument) {
    },
    contains(item: IPartArgument) {
    },
    sequenceEqual(other: IPartArgument) {
    },
    any(predicate: IPartArgument) {
    },
    all(predicate: IPartArgument) {
    },
    count(predicate: IPartArgument) {
    },
    min(selector: IPartArgument) {
    },
    max(selector: IPartArgument) {
    },
    sum(selector: IPartArgument) {
    },
    average(selector: IPartArgument) {
    },
    aggregate(func: IPartArgument, seed: IPartArgument, selector: IPartArgument) {
    }
}
