import { expect } from 'chai';
import 'mocha';
import { Order, orders, products } from './fixture';
import '..';

describe('Jinqu should be able to use string expressions with', () => {

    it('aggregate', () => {
        expect([1, 2, 3, 4].asQueryable().aggregate('(seed, value) => seed + value')).to.equal(10);
        expect([1, 2, 3, 4].asQueryable().aggregate('(seed, value) => seed + value', 32)).to.equal(42);
    });

    it('all', () => {
        expect([1, 2, 3, 4].asQueryable().all('i => i > 0')).to.be.true;
        expect([1, 2, 3, 4].asQueryable().any('i => i > 4')).to.be.false;

        expect(products.asQueryable().all('p => p.category !== null')).to.be.true;
        expect(products.asQueryable().all('p => p.name === "None"')).to.be.false;
    });

    it('any', () => {
        expect([1, 2, 3, 4].asQueryable().any('i => i > 3')).to.be.true;
        expect([1, 2, 3, 4].asQueryable().any('i => i > 4')).to.be.false;

        const p5 = products[5];
        expect(products.asQueryable().any('p => p.name === p5.name', { p5 })).to.be.true;
        expect(products.asQueryable().any('p => p.name === "None"')).to.be.false;
    });

    it('average', () => {
        expect(orders.asQueryable().average('o => o.id')).to.equal(3);
    });

    it('count', () => {
        expect([1, 2, 3, 4].asQueryable().count('i => i > 2')).to.equal(2);
    });

    it('distinct', () => {
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

    it('except', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 2 }, { id: 3 }, arr1[0]];

        const except = arr2.asQueryable().except(arr1, '(i1, i2) => i1.id == i2.id').toArray();
        expect(except).property('length').to.equal(1);
    });

    it('first', () => {
        const p4 = products[3];
        expect(products.asQueryable().first('p => p.no === p4.no', { p4 })).to.equal(products[3]);
        expect(() => products.asQueryable().first('p => p.category === "None"')).to.throw();
    });

    it('firstOrDefault', () => {
        const p3 = products[2];
        expect(products.asQueryable().firstOrDefault('p => p.no == p3.no', { p3 })).to.equal(products[2]);
        expect(products.asQueryable().firstOrDefault('p => p.category === "None"')).to.equal(null);
    });

    it('groupBy', () => {
        const prodCat1 = products
            .asQueryable()
            .groupBy('p => p.category', '(k, g) => ({ category: k, count: g.length })')
            .toArray();

        expect(prodCat1).property('length').to.equal(3);
        expect(prodCat1[0]).property('count').to.equal(3);
        expect(prodCat1[1]).property('count').to.equal(2);
        expect(prodCat1[2]).property('count').to.equal(4);

        const prodCat2 = products
            .asQueryable()
            .groupBy('p => p.category')
            .toArray();

        expect(prodCat2).property('length').to.equal(3);
        expect(prodCat2[2]).property('key').to.equal('Cat03');
        expect(prodCat2[2]).property('length').to.equal(4);
    });

    it('groupJoin', () => {
        const details = orders.asQueryable().selectMany(o => o.details).toArray();
        const prdCount = [products[0], products[1]].asQueryable().groupJoin(
            details,
            'p => p.no',
            'd => d.product',
            '(p, ds) => { product: p.no, count: ds.length }'
        ).toArray();

        expect(prdCount).to.be.deep.equal([{ product: 'Prd1', count: 2 }, { product: 'Prd2', count: 1 }]);
    });

    it('intersect', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 2 }, { id: 3 }, arr1[0]];

        const concat = arr1.asQueryable().intersect(arr2, '(i1, i2) => i1.id == i2.id').toArray();
        expect(concat).property('length').to.equal(2);
    });

    it('join', () => {
        const details = orders[0].details;
        const supCat = details.asQueryable().join(
            products,
            'd => d.product',
            'p => p.no',
            '(d, p) => { supplier: d.supplier, category: p.category }'
        ).toArray();

        expect(supCat).to.be.deep.equal([{ supplier: 'ABC', category: 'Cat01' }, { supplier: 'QWE', category: 'Cat02' }]);
    });

    it('last', () => {
        const last = products[products.length - 1];
        expect(products.asQueryable().last('p => p.no === lastNo', { lastNo: last.no })).to.equal(last);
        expect(() => products.asQueryable().last('p => p.category === "None"')).to.throw();
    });

    it('lastOrDefault', () => {
        expect(products.asQueryable().lastOrDefault('p => p.category === "None"')).to.equal(null);
    });

    it('max', () => {
        expect(products.asQueryable().max('p => p.no')).to.equal('Prd9');
    });

    it('min', () => {
        expect(products.asQueryable().min('p => p.no')).to.equal('Prd1');
    });

    it('orderBy, orderByDescending, thenBy, thenByDescending', () => {
        const sortedDetails1 = orders[4].details.asQueryable()
            .orderBy('d => d.supplier')
            .thenByDescending('d => d.count')
            .toArray();

        expect(sortedDetails1[0]).property('count').to.be.equal(67);
        expect(sortedDetails1[1]).property('count').to.be.equal(13);
        expect(sortedDetails1[2]).property('count').to.be.equal(86);

        const sortedDetails2 = orders[4].details.asQueryable()
            .orderByDescending('d => d.supplier')
            .thenBy('d => d.count')
            .toArray();

        expect(sortedDetails2[0]).property('count').to.be.equal(8);
        expect(sortedDetails2[1]).property('count').to.be.equal(4);
        expect(sortedDetails2[2]).property('count').to.be.equal(34);
    });

    it('select', () => {
        const ids = orders.asQueryable().select('o => o.id').toArray();
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

    it('selectMany', () => {
        const details = orders.asQueryable().selectMany('o => o.details').toArray();
        expect(details.length).to.equal(16);
    });

    it('sequenceEqual', () => {
        expect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            .asQueryable()
            .sequenceEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], '(i1, i2) => i1.id == i2.id')
        ).to.be.true;
    });

    it('single', () => {
        const p4 = products[3];
        expect(products.asQueryable().single('p => p.no === p4No', { p4No: p4.no })).to.equal(p4);
        expect(() => products.asQueryable().single('p => p.category === "None"')).to.throw();
        expect(() => products.asQueryable().single('p => p.category !== "None"')).to.throw();
    });

    it('singleOrDefault', () => {
        expect(products.asQueryable().singleOrDefault('p => p.category === "None"')).to.equal(null);
        expect(() => products.asQueryable().singleOrDefault('p => p.category !== "None"')).to.throw();
    });

    it('skipWhile', () => {
        const biggerTwo = orders.asQueryable().skipWhile('o => o.id < 3').toArray();

        expect(biggerTwo).property('length').to.be.equal(3);
        expect(biggerTwo[0]).property('id').to.be.equal(3);
        expect(biggerTwo[1]).property('id').to.be.equal(4);
        expect(biggerTwo[2]).property('id').to.be.equal(5);
    });

    it('sum', () => {
        expect(orders.asQueryable().sum('o => o.id')).to.equal(15);
    });

    it('takeWhile', () => {
        const firstTwo = orders.asQueryable().takeWhile('o => o.id < 3').toArray();

        expect(firstTwo).property('length').to.be.equal(2);
        expect(firstTwo[0]).property('id').to.be.equal(1);
        expect(firstTwo[1]).property('id').to.be.equal(2);
    });

    it('union', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 2 }, { id: 3 }, arr1[0]];

        const union = arr1.asQueryable().union(arr2, '(i1, i2) => i1.id == i2.id').toArray();
        expect(union).property('length').to.equal(3);
    });

    it('where', () => {
        const result1 = orders.asQueryable().where('c => c.id > 3').toArray();
        expect(result1).property('length').to.equal(2);
        expect(result1[0].id).to.equal(4);
        expect(result1[1].no).to.equal('Ord5');

        const details = orders.asQueryable().selectMany(o => o.details).toArray();
        const result2 = details.asQueryable()
            .where('d => (d.count > 20 &&  d.supplier != "QWE") || (d.count < 10 && d.supplier == "TYU")')
            .toArray();
        expect(result2).property('length').to.equal(8);
        expect(result2[0].count).to.equal(63);
        expect(result2[1].product).to.equal('Prd4');
        expect(result2[2].supplier).to.equal('ABC');
    });

    it('zip', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }];
        const arr3 = [{ id: 5 }];

        const zip1 = arr1.asQueryable().zip(arr2, '(i1, i2) => i1.id + i2.id').toArray();
        expect(zip1).to.deep.equal([4, 6]);

        const zip2 = arr1.asQueryable().zip(arr3, '(i1, i2) => i1.id + i2.id').toArray();
        expect(zip2).to.deep.equal([6]);
    });
});
