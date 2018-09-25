import { expect } from 'chai';
import 'mocha';
import { ArrayQueryProvider, IQuery } from '..';
import { Order, orders, products, ExtendedOrder } from './fixture';
import { QueryPart, PartArgument } from '../lib/query-part';

describe('Query part tests', () => {

    it('should filter the array', () => {
        const result = orders.asQueryable().where(c => c.id > 3).toArray();
        expect(result).property('length').to.equal(2);
        expect(result[0].id).to.equal(4);
        expect(result[1].no).to.equal('Ord5');
    });

    it('should return only given typed items for ofType', () => {
        // primitive test
        const items: any[] = ['1', 2, 'a3', 4, false, '5'];
        const numbers = items.asQueryable().ofType<Number>(Number).toArray();
        expect(numbers).to.deep.equal([2, 4]);

        // object test
        const classOrders = orders.asQueryable().ofType<Order>(Order).toArray();
        expect(classOrders).to.deep.equal([orders[0], orders[2], orders[4]]);
    });

    it('should cast to given type', () => {
        // primitive test
        const items: any[] = ['1', 2, '3', 4, '5'];
        const numbers = items.asQueryable().cast<Number>(Number).toArray();
        expect(numbers).to.deep.equal([1, 2, 3, 4, 5]);

        // object test
        const classOrders = [orders[0], orders[2], orders[4]].asQueryable().cast<Order>(Order).toArray();
        expect(classOrders).to.deep.equal([orders[0], orders[2], orders[4]]);

        const extendedOrders = [new ExtendedOrder(1, '2', 3, new Date(), null, [])];
        const query: IQuery<Order> = extendedOrders.asQueryable();
        const result = query.cast<ExtendedOrder>(ExtendedOrder).toArray();
        expect(extendedOrders).to.deep.equal(result);

        expect([null].asQueryable().cast<Number>(Number).toArray()).to.deep.equal([null]);

        expect(() => ['Morty'].asQueryable().cast<Number>(Number).toArray()).to.throw();
    });

    it('should select only given members', () => {
        const ids = orders.asQueryable().select(o => o.id).toArray();
        expect(ids).to.deep.equal([1, 2, 3, 4, 5]);

        const idNo = orders.asQueryable().select(o => ({ id: o.id, no: o.no })).toArray();
        expect(idNo).to.deep.equal([
            { id: 1, no: 'Ord1' },
            { id: 2, no: 'Ord2' },
            { id: 3, no: 'Ord3' },
            { id: 4, no: 'Ord4' },
            { id: 5, no: 'Ord5' }
        ]);
    });

    it('should select all details to one array', () => {
        const details = orders.asQueryable().selectMany(o => o.details).toArray();
        expect(details.length).to.equal(16);
    });

    it('should join two arrays', () => {
        const details = orders[0].details;
        const supCat = details.asQueryable().join(
            products,
            d => d.product,
            p => p.no,
            (d, p) => ({ supplier: d.supplier, category: p.category })
        ).toArray();

        expect(supCat).to.be.deep.equal([{ supplier: 'ABC', category: 'Cat01' }, { supplier: 'QWE', category: 'Cat02' }]);
    });

    it('should join and group two arrays', () => {
        const details = orders.asQueryable().selectMany(o => o.details).toArray();
        const prdCount = [products[0], products[1]].asQueryable().groupJoin(
            details,
            p => p.no,
            d => d.product,
            (p, ds) => ({ product: p.no, count: ds.length })
        ).toArray();

        expect(prdCount).to.be.deep.equal([{ product: 'Prd1', count: 2 }, { product: 'Prd2', count: 1 }]);
    });

    it('should sort order details', () => {
        const sortedDetails1 = orders[4].details.asQueryable()
            .orderBy(d => d.supplier)
            .thenByDescending(d => d.count)
            .toArray();

        expect(sortedDetails1[0]).property('count').to.be.equal(67);
        expect(sortedDetails1[1]).property('count').to.be.equal(13);
        expect(sortedDetails1[2]).property('count').to.be.equal(86);

        const sortedDetails2 = orders[4].details.asQueryable()
            .orderByDescending(d => d.supplier)
            .thenBy(d => d.count)
            .toArray();

        expect(sortedDetails2[0]).property('count').to.be.equal(8);
        expect(sortedDetails2[1]).property('count').to.be.equal(4);
        expect(sortedDetails2[2]).property('count').to.be.equal(34);
    });

    it('should take only first 3', () => {
        const firstThree = orders.asQueryable().take(3).toArray();

        expect(firstThree).property('length').to.be.equal(3);
        expect(firstThree[0]).property('id').to.be.equal(1);
        expect(firstThree[1]).property('id').to.be.equal(2);
        expect(firstThree[2]).property('id').to.be.equal(3);
    });

    it('should take when id is smaller than 3', () => {
        const firstTwo = orders.asQueryable().takeWhile(o => o.id < 3).toArray();

        expect(firstTwo).property('length').to.be.equal(2);
        expect(firstTwo[0]).property('id').to.be.equal(1);
        expect(firstTwo[1]).property('id').to.be.equal(2);
    });

    it('should skip first 3', () => {
        const skipThree = orders.asQueryable().skip(3).toArray();

        expect(skipThree).property('length').to.be.equal(2);
        expect(skipThree[0]).property('id').to.be.equal(4);
        expect(skipThree[1]).property('id').to.be.equal(5);
    });

    it('should skip when id is smaller than 3', () => {
        const biggerTwo = orders.asQueryable().skipWhile(o => o.id < 3).toArray();

        expect(biggerTwo).property('length').to.be.equal(3);
        expect(biggerTwo[0]).property('id').to.be.equal(3);
        expect(biggerTwo[1]).property('id').to.be.equal(4);
        expect(biggerTwo[2]).property('id').to.be.equal(5);
    });

    it('should group orders by customer', () => {
        const prodCat = products
            .asQueryable()
            .groupBy(p => p.category, g => ({ category: g.key, count: g.length }))
            .toArray();

        expect(prodCat).property('length').to.equal(3);
        expect(prodCat[0]).property('count').to.equal(3);
        expect(prodCat[1]).property('count').to.equal(2);
        expect(prodCat[2]).property('count').to.equal(4);
    });

    it('should eleminate recurring items', () => {
        const arr = [1, 2, 1, 3, 3, 2, 1, 3];
        const dist = arr.asQueryable().distinct().toArray();

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
        const distItems = items.asQueryable().distinct((i1, i2) => i1.id === i2.id).toArray();

        expect(distItems).property('length').to.equal(3);
    });

    it('should concat two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr1.asQueryable().concat(arr2).toArray();

        expect(concat).property('length').to.equal(5);
    });

    it('should zip two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }];
        const arr3 = [{ id: 5 }];

        const zip1 = arr1.asQueryable().zip(arr2, (i1, i2) => i1.id + i2.id).toArray();
        const zip2 = arr1.asQueryable().zip(arr3, (i1, i2) => i1.id + i2.id).toArray();

        expect(zip1).to.deep.equal([4, 6]);
        expect(zip2).to.deep.equal([6]);
    });

    it('should union two arrays with eliminating recurring items', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr1.asQueryable().union(arr2).toArray();

        expect(concat).property('length').to.equal(4);
    });

    it('should detect shared items between two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr1.asQueryable().intersect(arr2).toArray();

        expect(concat).property('length').to.equal(1);
    });

    it('should detect differing items between two arrays', () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 2 }, { id: 3 }, arr1[0]];

        const except1 = arr2.asQueryable().except(arr1).toArray();
        expect(except1).property('length').to.equal(2);

        const except2 = arr2.asQueryable().except(arr1, (i1, i2) => i1.id == i2.id).toArray();
        expect(except2).property('length').to.equal(1);
    });

    it('should return same sequence for defaultIfEmpty', () => {
        const arr = [{ id: 1 }, { id: 2 }];

        const defEmp = arr.asQueryable().defaultIfEmpty().toArray();

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
        expect(products.asQueryable().first()).to.equal(products[0]);
        expect(products.asQueryable().first(p => p.no === products[3].no)).to.equal(products[3]);
    });

    it('should return default for missing first item', () => {
        expect([].asQueryable().firstOrDefault()).to.equal(null);
        expect(products.asQueryable().firstOrDefault(p => p.category === 'None')).to.equal(null);
    });

    it('should throw error for missing first item', () => {
        expect(() => [].asQueryable().first()).to.throw();
        expect(() => products.asQueryable().first(p => p.category === 'None')).to.throw();
    });

    it('should return last item', () => {
        const idx = products.length - 1;
        expect(products.asQueryable().last()).to.equal(products[idx]);
        expect(products.asQueryable().last(p => p.no === products[idx].no)).to.equal(products[idx]);
    });

    it('should return default for missing last item', () => {
        expect([].asQueryable().lastOrDefault()).to.equal(null);
        expect(products.asQueryable().lastOrDefault(p => p.category === 'None')).to.equal(null);
    });

    it('should throw error for missing last item', () => {
        expect(() => [].asQueryable().last()).to.throw();
        expect(() => products.asQueryable().last(p => p.category === 'None')).to.throw();
    });

    it('should return single item', () => {
        expect([42].asQueryable().single()).to.equal(42);
        expect(products.asQueryable().single(p => p.no === products[3].no)).to.equal(products[3]);
    });

    it('should return default for missing single item', () => {
        expect([].asQueryable().singleOrDefault()).to.equal(null);
        expect(products.asQueryable().singleOrDefault(p => p.category === 'None')).to.equal(null);
    });

    it('should throw error for missing single item', () => {
        expect(() => products.asQueryable().single()).to.throw();
        expect(() => products.asQueryable().single(p => p.category === 'None')).to.throw();
    });

    it('should return given indexed item', () => {
        expect(products.asQueryable().elementAt(3)).to.equal(products[3]);
        expect(() => products.asQueryable().elementAt(products.length)).to.throw();
        expect(products.asQueryable().elementAtOrDefault(3)).to.equal(products[3]);
        expect(products.asQueryable().elementAtOrDefault(33)).to.equal(null);
    });

    it('should return if array contains the given item', () => {
        const arr = [1, 2, 1, 3, 3, 2, 1, 3];
        expect(arr.asQueryable().contains(arr[3])).to.be.true;
        expect(arr.asQueryable().contains(5)).to.be.false;

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
        expect(items.asQueryable().contains(<any>{ id: 3 }, (i1, i2) => i1.id === i2.id)).to.be.true;
    });

    it('should return if array is equal to given array', () => {
        expect([1, 2, 3, 4].asQueryable().sequenceEqual([1, 2, 3, 4])).to.be.true;
        expect([1, 2, 3, 4, 5].asQueryable().sequenceEqual([1, 2, 3, 4])).to.be.false;
        expect([1, 2, 3, 4].asQueryable().sequenceEqual([1, 2, 3, 4, 5])).to.be.false;
    });

    it('should return if any item matches the predicate', () => {
        expect([1, 2, 3, 4].asQueryable().any()).to.be.true;
        expect([1, 2, 3, 4].asQueryable().any(i => i > 3)).to.be.true;
        expect([1, 2, 3, 4].asQueryable().any(i => i > 4)).to.be.false;

        expect(products.asQueryable().any(p => p.name === products[4].name)).to.be.true;
        expect(products.asQueryable().any(p => p.name === 'None')).to.be.false;
    });

    it('should return if all items matches the predicate', () => {
        expect([1, 2, 3, 4].asQueryable().all(i => i > 0)).to.be.true;
        expect([1, 2, 3, 4].asQueryable().any(i => i > 4)).to.be.false;

        expect(products.asQueryable().all(p => p.category !== null)).to.be.true;
        expect(products.asQueryable().all(p => p.name === 'None')).to.be.false;
    });

    it('should return the count of items that matches the predicate', () => {
        expect([1, 2, 3, 4].asQueryable().count()).to.equal(4);
        expect([1, 2, 3, 4].asQueryable().count(i => i > 2)).to.equal(2);
    });

    it('should return the min value', () => {
        expect([1, 2, 3, 4].asQueryable().min()).to.equal(1);
        expect(products.asQueryable().min(p => p.no)).to.equal('Prd1');
    });

    it('should return the max value', () => {
        expect([2, 1, 3, 4].asQueryable().max()).to.equal(4);
        expect(products.asQueryable().max(p => p.no)).to.equal('Prd9');
    });

    it('should return the sum of values', () => {
        expect([1, 2, 3, 4].asQueryable().sum()).to.equal(10);
        expect(orders.asQueryable().sum(o => o.id)).to.equal(15);
    });

    it('should return the average of values', () => {
        expect([1, 2, 3, 4].asQueryable().average()).to.equal(2.5);
        expect(orders.asQueryable().average(o => o.id)).to.equal(3);
        expect([].asQueryable().average()).to.equal(0);
    });

    it('should return the aggregated value', () => {
        expect([1, 2, 3, 4].asQueryable().aggregate((seed, value) => seed + value)).to.equal(10);
        expect([1, 2, 3, 4].asQueryable().aggregate((seed, value) => seed + value, 32)).to.equal(42);

        const agg = orders.asQueryable().aggregate((seed, order) => seed + order.id, 69, v => v / 2);
        expect(agg).to.equal(42);
    });

    it('should calculate inlineCount', () => {
        const result1 = orders.asQueryable()
            .inlineCount()
            .where(c => c.id > 2)
            .skip(1)
            .take(2)
            .toArray();
        expect(result1).property('length').to.equal(2);
        expect(result1.$inlineCount).to.equal(3);

        const result2 = orders.asQueryable().inlineCount().toArray();
        expect(orders.length).to.equal(result2.$inlineCount);
    });

    it('should filter iterable', () => {
        const provider = new ArrayQueryProvider(orders[Symbol.iterator]());
        const result = provider.createQuery<Order>().where(c => c.id > 3).toArray();
        expect(result).property('length').to.equal(2);
        expect(result[0].id).to.equal(4);
        expect(result[1].no).to.equal('Ord5');

        expect(orders).to.deep.equal(new ArrayQueryProvider(orders).execute(null));
    });

    it('should sort order details when executed explicitly', () => {
        const query = orders[4].details.asQueryable()
            .orderBy(d => d.supplier)
            .thenByDescending(d => d.count);
        const sortedDetails = Array.from(query.provider.execute<Order[]>(query.parts));

        expect(sortedDetails[0]).property('count').to.be.equal(67);
        expect(sortedDetails[1]).property('count').to.be.equal(13);
        expect(sortedDetails[2]).property('count').to.be.equal(86);
    });

    it('should throw for unknown part', () => {
        const query = orders.asQueryable();
        query.parts.push({ type: '42', args: [], scopes: [] });

        expect(() => query.toArray()).to.throw();
    });

    it('should throw for null source', () => {
        expect(() => new ArrayQueryProvider(null)).to.throw();
    });

    it('should handle literal query part as function', () => {
        const items = [{ id: 1 }, { id: 2 }];
        expect(items.asQueryable().select('id').toArray()).to.deep.equal([1, 2]);
    });

    it('should QueryPart and PartArgument work as expected', () => {
        expect(() => new QueryPart('')).to.throw();
        expect(new QueryPart('where')).property('scopes').to.deep.equal([]);
        
        const part1 = new PartArgument(null, null, null);
        expect(part1.func).to.be.null;
        expect(part1.expStr).to.be.null;
        expect(part1.exp).to.be.null;
        expect(part1.scopes).to.be.null;

        const part2 = new PartArgument(c => c%2 == 0, null, null);
        expect(part2.expStr).not.null;
    });

    it('should iterate filtered array', () => {
        const query = orders.asQueryable().where(c => c.id > 3);

        let i = 3;
        for (let o of query) {
            expect(o).to.equal(orders[i++]);
        }
    });
});
