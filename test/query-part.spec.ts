import { expect } from 'chai';
import 'mocha';
import '../index';
import { Order, orders } from './fixture';

describe('Query part tests', () => {

    it('should filter the array', () => {
        const result = orders.where(c => c.id > 3).toArray();

        expect(result.length).to.equal(2);
        expect(result[0].id).to.equal(4);
        expect(result[1].no).to.equal('Ord5');
    });

    it('should return only given typed items for ofType', () => {
        // primitive test
        const items: any[] = ['1', 2, 'a3', 4, false, '5'];
        const numbers = items.ofType<Number>(Number).toArray();

        expect(numbers).to.deep.equal([2, 4]);

        // object test
        const classOrders = orders.ofType<Order>(Order).toArray();

        expect(classOrders).to.deep.equal([orders[0], orders[2], orders[4]]);
    });

    it('should cast to given type', () => {
        // primitive test
        const items: any[] = ['1', 2, '3', 4, '5'];
        const numbers = items.cast<Number>(Number).toArray();

        expect(numbers).to.deep.equal([1, 2, 3, 4, 5]);

        // object test
        const classOrders = [orders[0], orders[2], orders[4]].cast<Order>(Order).toArray();
        
        expect(classOrders).to.deep.equal([orders[0], orders[2], orders[4]]);
    });

    it('should select only given members', () => {
        const ids = orders.select(o => o.id).toArray();
        
        expect(ids).to.deep.equal([1, 2, 3, 4, 5]);
    });
});
