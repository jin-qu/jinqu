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

    it('should sort order details', () => {
        const sortedDetails = orders[4].details.orderBy(d => d.supplier).thenByDescending(d => d.count).toArray();
        
        expect(sortedDetails[0]).property('count').to.be.equal(67);
        expect(sortedDetails[1]).property('count').to.be.equal(13);
        expect(sortedDetails[2]).property('count').to.be.equal(86);
    });

    it('should take only first 3', () => {
        const firstThree = orders.take(3).toArray();
   
        expect(firstThree).property('length').to.be.equal(3);
        expect(firstThree[0]).property('id').to.be.equal(1);
        expect(firstThree[1]).property('id').to.be.equal(2);
        expect(firstThree[2]).property('id').to.be.equal(3);
    });

    it('should take when id is smaller than 3', () => {
        const firstTwo = orders.takeWhile(o => o.id < 3).toArray();
   
        expect(firstTwo).property('length').to.be.equal(2);
        expect(firstTwo[0]).property('id').to.be.equal(1);
        expect(firstTwo[1]).property('id').to.be.equal(2);
    });

    it('should skip first 3', () => {
        const skipThree = orders.skip(3).toArray();
   
        expect(skipThree).property('length').to.be.equal(2);
        expect(skipThree[0]).property('id').to.be.equal(4);
        expect(skipThree[1]).property('id').to.be.equal(5);
    });

    it('should skip when id is smaller than 3', () => {
        const biggerTwo = orders.skipWhile(o => o.id < 3).toArray();
   
        expect(biggerTwo).property('length').to.be.equal(3);
        expect(biggerTwo[0]).property('id').to.be.equal(3);
        expect(biggerTwo[1]).property('id').to.be.equal(4);
        expect(biggerTwo[2]).property('id').to.be.equal(5);
    });
});
