import { IQueryProvider, IQuery } from './types';

export class ArrayQueryProvider implements IQueryProvider {

    execute<TResult = any>(query: IQuery<any>, ...scopes: any[]): TResult {
        throw new Error("Method not implemented.");
    }    
    
    executeAsync<TResult = any>(query: IQuery<any>, ...scopes: any[]): TResult {
        throw new Error("Method not implemented.");
    }
}