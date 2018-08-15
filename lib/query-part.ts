import { tokenize, Expression, evaluate } from 'jokenizer';

export interface IQueryPart {
    readonly type: string;
    readonly func: Function;
    readonly expStr: string;
    readonly exp: Expression;
    readonly scopes: any[];
}

export class QueryPart implements IQueryPart {

    constructor(private _type: string, private _func: Function, private _expStr: string, private _scopes: any[] = []) {
        if (!_type) throw new Error('Type of QueryPart cannot be null or empty.');
        if (!_func && !_expStr) throw new Error('Function or expression string must be provided.');
    }

    get type() {
        return this._type;
    }

    get func() {
        if (this._func != null) return this._func;

        return this._func = (scopes: []) => evaluate(this.exp, scopes);
    }

    get expStr() {
        if (this._expStr != null) return this._expStr;

        return this._expStr = this.func.toString();
    }

    private _exp: Expression;
    get exp() {
        if (this._exp != null) return this._exp;

        return this._exp = tokenize(this.expStr);
    }

    get scopes() {
        return this._scopes;
    }

    static where<T>(predicate: (i: T) => boolean | string, ...scopes) {
        const args = handleArgs(predicate);
        return new QueryPart(QueryPartType.where, args[0], args[1], scopes);
    }

    static ofType<TResult>(type: new(...args) => TResult) {
        return new QueryPart(QueryPartType.ofType, type, null);
    }

    static cast<TResult>(type: new(...args) => TResult) {
        return new QueryPart(QueryPartType.cast, type, null);
    }
}

function handleArgs(arg) {
    return arg && typeof arg === "function"
        ? [arg, null]
        : [null, arg];
}

export const QueryPartType = {
    where: 'where', 
    ofType: 'ofType',
    cast: 'cast',
    select: 'select',
    selectMany: 'selectMany',
    join: 'join',
    groupJoin: 'groupJoin',
    orderBy: 'orderBy',
    orderByDescending: 'orderByDescending',
    thenBy: 'thenBy',
    thenByDescending: 'thenByDescending',
    take: 'take',
    takeWhile: 'takeWhile',
    skip: 'skip',
    skipWhile: 'skipWhile',
    groupBy: 'groupBy',
    distinct: 'distinct',
    concat: 'concat',
    zip: 'zip',
    union: 'union',
    intersect: 'intersect',
    except: 'except',
    first: 'first',
    firstOrDefault: 'firstOrDefault',
    last: 'last',
    lastOrDefault: 'lastOrDefault',
    single: 'single',
    singleOrDefault: 'singleOrDefault',
    elementAt: 'elementAt',
    elementAtOrDefault: 'elementAtOrDefault',
    defaultIfEmpty: 'defaultIfEmpty',
    contains: 'contains',
    reverse: 'reverse',
    sequenceEqual: 'sequenceEqual',
    any: 'any',
    all: 'all',
    count: 'count',
    min: 'min',
    max: 'max',
    sum: 'sum',
    average: 'average',
    aggregate: 'aggregate'
};
