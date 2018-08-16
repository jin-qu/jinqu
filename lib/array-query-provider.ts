import { IQueryProvider, IPartArgument, IQueryPart, IQuery } from './types';

export class ArrayQueryProvider implements IQueryProvider {

    constructor(private readonly items: any[]) {
    }

    execute<TResult = any>(query: IQuery<any>): TResult {
        let items = this.items;
        for (let i = 0; i < query.parts.length; i++) {
            items = handlePart(items, query.parts[i]);
        }
        return <any>items;
    }    
    
    executeAsync<TResult = any>(query: IQuery<any>): Promise<TResult> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.execute(query));
            }
            catch (e) {
                reject(e);
            }
        });
    }
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
