import { expect } from 'chai';
import 'mocha';
import '../index';
import { Order, orders, products } from './fixture';

describe('Query part tests', () => {

    it('should filter the array', () => {
        const result = orders.where(c => c.id > 3).toArray();
        expect(result).property('length').to.equal(2);
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

    it('should group orders by customer', () => {
        const prodCat = products
            .groupBy(p => p.category, g => ({ category: g.key, count: g.length }))
            .toArray();

        expect(prodCat).property('length').to.equal(3);
        expect(prodCat[0]).property('count').to.equal(3);
        expect(prodCat[1]).property('count').to.equal(2);
        expect(prodCat[2]).property('count').to.equal(4);
    });

    it('should eleminate recurring items', () => {
        const arr = [1, 2, 1, 3, 3, 2, 1, 3];
        const dist = arr.distinct().toArray();

        expect(dist).property('length').to.equal(3);

        const items = [
            { id: 1, name: 'i1' },
            { id: 2, name: 'i2' },
            { id: 1, name: 'i3' },
            { id: 3, name: 'i4' },
            { id: 3, name: 'i5' },
            { id: 2, name: 'i6' },
            { id: 1, name: 'i7' },
            { id: 3, name: 'i8' }
        ];
        const distItems = items.distinct((i1, i2) => i1.id === i2.id).toArray();

        expect(distItems).property('length').to.equal(3);
    });

    it('should concat two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr1.concatWith(arr2).toArray();

        expect(concat).property('length').to.equal(5);
    });

    it('should zip two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }];

        const zip = arr1.zip(arr2, (i1, i2) => i1.id + i2.id).toArray();

        expect(zip).to.deep.equal([4, 6]);
    });

    it('should union two arrays with eliminating recurring items', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr1.union(arr2).toArray();

        expect(concat).property('length').to.equal(4);
    });
    
    it('should detect shared items between two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr1.intersect(arr2).toArray();

        expect(concat).property('length').to.equal(1);
    });

    it('should detect differing items between two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr2.except(arr1).toArray();

        expect(concat).property('length').to.equal(2);
    });

    it('should return same sequence for defaultIfEmpty', () => {
        const arr = [{ id: 1 }, { id: 2 }];

        const defEmp = arr.defaultIfEmpty().toArray();

        expect(defEmp).to.not.equal(arr);
        expect(defEmp).to.deep.equal(arr);
    });

    it('should reverse the array to a new one', () => {
        const arr = [1, 2, 1, 3, 3, 2, 1, 3];
        const rev1 = arr.asQueryable().reverse().toArray()
        const rev2 = arr.splice(0, 0).reverse();
        
        expect(rev1).to.deep.equal(rev2);
    });

    it('should return first item', () => {
        expect(products.first()).to.equal(products[0]);
        expect(products.first(p => p.no === products[3].no)).to.equal(products[3]);
    });

    it('should return default for missing first item', () => {
        expect([].firstOrDefault()).to.equal(null);
        expect(products.firstOrDefault(p => p.category === 'None')).to.equal(null);
    });

    it('should throw error for missing first item', () => {
        expect(() => [].first()).to.throw();
        expect(() => products.first(p => p.category === 'None')).to.throw();
    });

    it('should return last item', () => {
        const idx = products.length - 1;
        expect(products.last()).to.equal(products[idx]);
        expect(products.last(p => p.no === products[idx].no)).to.equal(products[idx]);
    });

    it('should return default for missing last item', () => {
        expect([].lastOrDefault()).to.equal(null);
        expect(products.lastOrDefault(p => p.category === 'None')).to.equal(null);
    });

    it('should throw error for missing last item', () => {
        expect(() => [].last()).to.throw();
        expect(() => products.last(p => p.category === 'None')).to.throw();
    });

    it('should return single item', () => {
        expect([42].single()).to.equal(42);
        expect(products.single(p => p.no === products[3].no)).to.equal(products[3]);
    });

    it('should return default for missing single item', () => {
        expect([].singleOrDefault()).to.equal(null);
        expect(products.singleOrDefault(p => p.category === 'None')).to.equal(null);
    });

    it('should throw error for missing single item', () => {
        expect(() => products.single()).to.throw();
        expect(() => products.single(p => p.category === 'None')).to.throw();
    });

    it('should return given indexed item', () => {
        expect(products.elementAt(3)).to.equal(products[3]);
        expect(products.elementAtOrDefault(33)).to.equal(null);
    });

    it('should return if array contains the given item', () => {
        expect(products.contains(products[3])).to.be.true;
        expect([1, 2, 3, 4].contains(5)).to.be.false;
    });

    it('should return if array is equal to given array', () => {
        expect([1, 2, 3, 4].sequenceEqual([1, 2, 3, 4])).to.be.true;
        expect([1, 2, 3, 4, 5].sequenceEqual([1, 2, 3, 4])).to.be.false;
        expect([1, 2, 3, 4].sequenceEqual([1, 2, 3, 4, 5])).to.be.false;
    });
});
