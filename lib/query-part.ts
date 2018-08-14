import { tokenize, Expression } from 'jokenizer';

export interface IQueryPart {
    readonly type: string;
    readonly func: Function;
    readonly expStr: string;
    readonly exp: Expression;
    readonly scopes: any[];
}

export class QueryPart implements IQueryPart {

    constructor(private _type: string, private _func: Function, private _expStr: string, private _scopes: any[] = []) {
    }

    get type() {
        return this._type;
    }

    get func() {
        if (this._func != null) return this._func;

        const e = this.exp;
        if (e == null) throw new Error('Expression cannot be null');

        return this._func = (scopes: []) => evaluate(e, scopes);
    }

    get expStr() {
        if (this._expStr != null) return this._expStr;

        const f = this.func;
        if (f == null) throw new Error('Function cannot be null');

        return this._expStr = f.toString();
    }

    get exp() {
        if (this._exp != null) return this._exp;

        const s = this.expStr;
        if (s == null) throw new Error('Expression string cannot be null')

        return this._exp = tokenize(s);
    }

    get scopes() {
        return this._scopes;
    }
}
