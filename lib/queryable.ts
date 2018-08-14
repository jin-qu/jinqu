import { Expression } from "jokenizer";
import { QueryPart } from "./query-part";

export const QueryPartType = {
    where: 'where', 
    orderBy: 'orderBy'
};

export interface IQuery<T = any> {

}

export interface IQueryProvider {
    createQuery<T = any>(expression: Expression): IQuery<T>;
    execute<T = any>(query: Query): T;
}

export class Query<TSource = any> {

    constructor(private _provider: IQueryProvider, private _parts: QueryPart[] = []) {
    }

    where(predicate: (i) => boolean | string, ...scopes) {
        const args = handleArgs(predicate);
        const part = new QueryPart(QueryPartType.where, args[0], args[1]);
        return new Query<TSource>(this._provider, [...this._parts, part]);
    }

    clone() {
        new Query<TSource>(this._provider, this._parts);
    }
}

function handleArgs(arg) {
    return arg && typeof arg === "function"
        ? [arg, null]
        : [null, arg];
}