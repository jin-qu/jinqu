import { tokenize, Expression, evaluate } from 'jokenizer';

export interface QueryPart {
    readonly func: Function;
    readonly exp: Expression;
    readonly expStr: string;
}

export abstract class QueryPartBase implements QueryPart {

    constructor (private _func: Function, private _expStr: string, private _exp: Expression) {
    }

    get func(): Function {
        if (this._func != null) return this._func;

        const e = this.exp;
        if (e == null) throw new Error('Expression cannot be null');

        return this._func = (scopes: []) => evaluate(e, scopes);
    }

    get exp(): Expression {
        if (this._exp != null) return this._exp;

        const s = this.expStr;
        if (s == null) throw new Error('Expression string cannot be null')
        
        return this._exp = tokenize(s);
    }

    get expStr(): string {
        if (this._expStr != null) return this._expStr;

        const f = this.func;
        if (f == null) throw new Error('Function cannot be null');
        
        return this._expStr = f.toString();
    }
}
