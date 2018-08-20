import { expect } from 'chai';
import 'mocha';
import '../index';
import { Order, orders, products } from './fixture';

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

        const idNo = orders.select(o => ({ id: o.id, no: o.no })).toArray();
        expect(idNo).to.deep.equal([
            { id: 1, no: 'Ord1' },
            { id: 2, no: 'Ord2' },
            { id: 3, no: 'Ord3' },
            { id: 4, no: 'Ord4' },
            { id: 5, no: 'Ord5' }
        ]);
    });

    it('should select all details to one array', () => {
        const details = orders.selectMany(o => o.details).toArray();
        expect(details.length).to.equal(16);
    });

    it('should join two arrays', () => {
        const details = orders[0].details;
        const supCat = details.joinWith(
            products,
            d => d.product,
            p => p.no,
            (d, p) => ({ supplier: d.supplier, category: p.category })
        ).toArray();

        expect(supCat).to.be.deep.equal([{ supplier: 'ABC', category: 'Cat01' }, { supplier: 'QWE', category: 'Cat02' }]);
    });

    it('should join and group two arrays', () => {
        const details = orders.selectMany(o => o.details).toArray();
        const prdCount = [products[0], products[1]].groupJoin(
            details,
            p => p.no,
            d => d.product,
            (p, ds) => ({ product: p.no, count: ds.length })
        ).toArray();

        expect(prdCount).to.be.deep.equal([{ product: 'Prd1', count: 2 }, { product: 'Prd2', count: 1 }]);
    });

    it('should sort orders by price', () => {
        const sortedOrders = orders.orderBy(o => o.price).toArray();

        expect(sortedOrders[0]).property('no').to.be.equal('Ord4');
        expect(sortedOrders[1]).property('no').to.be.equal('Ord1');
    });
});
