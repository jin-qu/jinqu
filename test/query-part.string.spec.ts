import { expect } from 'chai';
import 'mocha';
import { Order, orders, products } from './fixture';
import '..';

describe('Query part tests with strings', () => {

    it('should filter the array', () => {
        const result = orders.asQueryable().where('c => c.id > 3').toArray();
        expect(result).property('length').to.equal(2);
        expect(result[0].id).to.equal(4);
        expect(result[1].no).to.equal('Ord5');
    });

    it('should select only given members', () => {
        const ids = orders.asQueryable().select(o => o.id).toArray();
        expect(ids).to.deep.equal([1, 2, 3, 4, 5]);

        const idNo = orders.asQueryable().select('o => ({ id: o.id, no: o.no })').toArray();
        expect(idNo).to.deep.equal([
            { id: 1, no: 'Ord1' },
            { id: 2, no: 'Ord2' },
            { id: 3, no: 'Ord3' },
            { id: 4, no: 'Ord4' },
            { id: 5, no: 'Ord5' }
        ]);
    });

    it('should select all details to one array', () => {
        const details = orders.asQueryable().selectMany('o => o.details').toArray();
        expect(details.length).to.equal(16);
    });

    it('should join two arrays', () => {
        const details = orders[0].details;
        const supCat = details.asQueryable().joinWith(
            'products',
            'd => d.product',
            'p => p.no',
            '(d, p) => ({ supplier: d.supplier, category: p.category })',
            { products }
        ).toArray();

        expect(supCat).to.be.deep.equal([{ supplier: 'ABC', category: 'Cat01' }, { supplier: 'QWE', category: 'Cat02' }]);
    });

    it('should join and group two arrays', () => {
        const details = orders.asQueryable().selectMany(o => o.details).toArray();
        const prdCount = [products[0], products[1]].asQueryable().groupJoin(
            'details',
            'p => p.no',
            'd => d.product',
            '(p, ds) => ({ product: p.no, count: ds.length })',
            { details }
        ).toArray();

        expect(prdCount).to.be.deep.equal([{ product: 'Prd1', count: 2 }, { product: 'Prd2', count: 1 }]);
    });

    it('should sort order details', () => {
        const sortedDetails = orders[4].details.asQueryable()
            .orderBy('d => d.supplier')
            .thenByDescending('d => d.count')
            .toArray();

        expect(sortedDetails[0]).property('count').to.be.equal(67);
        expect(sortedDetails[1]).property('count').to.be.equal(13);
        expect(sortedDetails[2]).property('count').to.be.equal(86);
    });

    it('should take when id is smaller than 3', () => {
        const firstTwo = orders.asQueryable().takeWhile('o => o.id < 3').toArray();

        expect(firstTwo).property('length').to.be.equal(2);
        expect(firstTwo[0]).property('id').to.be.equal(1);
        expect(firstTwo[1]).property('id').to.be.equal(2);
    });

    it('should take when id is smaller than 3', () => {
        const firstTwo = orders.asQueryable().takeWhile('o => o.id < 3').toArray();

        expect(firstTwo).property('length').to.be.equal(2);
        expect(firstTwo[0]).property('id').to.be.equal(1);
        expect(firstTwo[1]).property('id').to.be.equal(2);
    });

    it('should skip when id is smaller than 3', () => {
        const biggerTwo = orders.asQueryable().skipWhile('o => o.id < 3').toArray();

        expect(biggerTwo).property('length').to.be.equal(3);
        expect(biggerTwo[0]).property('id').to.be.equal(3);
        expect(biggerTwo[1]).property('id').to.be.equal(4);
        expect(biggerTwo[2]).property('id').to.be.equal(5);
    });

    it('should group orders by customer', () => {
        const prodCat = products
            .asQueryable()
            .groupBy('p => p.category', 'g => ({ category: g.key, count: g.length })')
            .toArray();

        expect(prodCat).property('length').to.equal(3);
        expect(prodCat[0]).property('count').to.equal(3);
        expect(prodCat[1]).property('count').to.equal(2);
        expect(prodCat[2]).property('count').to.equal(4);
    });

    it('should eleminate recurring items', () => {
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
        const distItems = items.asQueryable().distinct('(i1, i2) => i1.id === i2.id').toArray();

        expect(distItems).property('length').to.equal(3);
    });

    it('should concat two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];

        const concat = arr1.asQueryable().concatWith('[{ id: 3 }, { id: 4 }, arr1_0]', { arr1_0: arr1[0] }).toArray();

        expect(concat).property('length').to.equal(5);
    });

    it('should zip two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];

        const zip = arr1.asQueryable().zip('[{ id: 3 }, { id: 4 }]', '(i1, i2) => i1.id + i2.id').toArray();

        expect(zip).to.deep.equal([4, 6]);
    });

    it('should union two arrays with eliminating recurring items', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr1.asQueryable().union('arr2', { arr2 }).toArray();

        expect(concat).property('length').to.equal(4);
    });

    it('should detect shared items between two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr1.asQueryable().intersect('arr2', { arr2 }).toArray();

        expect(concat).property('length').to.equal(1);
    });

    it('should detect differing items between two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr2.asQueryable().except('arr1', { arr1 }).toArray();

        expect(concat).property('length').to.equal(2);
    });

    it('should return same sequence for defaultIfEmpty', () => {
        const arr = [{ id: 1 }, { id: 2 }];

        const defEmp = arr.asQueryable().defaultIfEmpty().toArray();

        expect(defEmp).to.not.equal(arr);
        expect(defEmp).to.deep.equal(arr);
    });

    it('should return first item', () => {
        const p4 = products[3];
        expect(products.asQueryable().first('p => p.no === p4.no', { p4 })).to.equal(products[3]);
    });

    it('should return default for missing first item', () => {
        expect(products.asQueryable().firstOrDefault('p => p.category === "None"')).to.equal(null);
    });

    it('should throw error for missing first item', () => {
        expect(() => products.asQueryable().first('p => p.category === "None"')).to.throw();
    });

    it('should return last item', () => {
        const last = products[products.length - 1];
        expect(products.asQueryable().last('p => p.no === lastNo', { lastNo: last.no })).to.equal(last);
    });

    it('should return default for missing last item', () => {
        expect(products.asQueryable().lastOrDefault('p => p.category === "None"')).to.equal(null);
    });

    it('should throw error for missing last item', () => {
        expect(() => products.asQueryable().last('p => p.category === "None"')).to.throw();
    });
});
