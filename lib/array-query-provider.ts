import {  IQueryProvider, IPartArgument, IQueryPart, IQuery } from './types';
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
    joinWith(items: any[], other: IPartArgument, thisKey: IPartArgument, otherKey: IPartArgument, selector: IPartArgument) {
    }
}
