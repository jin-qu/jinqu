import { expect } from 'chai';
import 'mocha';
import { orders, products } from './fixture';
import '..';

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Jinqu should be able to asynchronously execute', () => {

    it('aggregate', () => {
        expect([1, 2, 3, 4].asQueryable().aggregateAsync((seed, value) => seed + value)).eventually.equal(10);
        expect([1, 2, 3, 4].asQueryable().aggregateAsync((seed, value) => seed + value, 32)).eventually.equal(42);
    });

    it('all', () => {
        expect([1, 2, 3, 4].asQueryable().allAsync(i => i > 0)).eventually.be.true;
        expect([1, 2, 3, 4].asQueryable().anyAsync(i => i > 4)).eventually.be.false;

        expect(products.asQueryable().allAsync(p => p.category !== null)).eventually.be.true;
        expect(products.asQueryable().allAsync(p => p.name === 'None')).eventually.be.false;
    });

    it('any', () => {
        expect([1, 2, 3, 4].asQueryable().anyAsync()).eventually.be.true;
        expect([1, 2, 3, 4].asQueryable().anyAsync(i => i > 3)).eventually.be.true;
        expect([1, 2, 3, 4].asQueryable().anyAsync(i => i > 4)).eventually.be.false;

        expect(products.asQueryable().anyAsync(p => p.name === products[4].name)).eventually.be.true;
        expect(products.asQueryable().anyAsync(p => p.name === 'None')).eventually.be.false;
    });

    it('average', () => {
        expect([1, 2, 3, 4].asQueryable().averageAsync()).eventually.equal(2.5);
        expect(orders.asQueryable().averageAsync(o => o.id)).eventually.equal(3);
        expect([].asQueryable().averageAsync()).eventually.equal(0);
    });

    it('contains', () => {
        const arr = [1, 2, 1, 3, 3, 2, 1, 3];
        expect(arr.asQueryable().containsAsync(arr[3])).eventually.be.true;
        expect(arr.asQueryable().containsAsync(5)).eventually.be.false;

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
        expect(items.asQueryable().containsAsync(<any>{ id: 3 }, (i1, i2) => i1.id === i2.id)).eventually.be.true;
    });

    it('count', () => {
        expect([1, 2, 3, 4].asQueryable().countAsync()).eventually.equal(4);
        expect([1, 2, 3, 4].asQueryable().countAsync(i => i > 2)).eventually.equal(2);
    });

    it('elementAt', () => {
        expect(products.asQueryable().elementAtAsync(3)).eventually.equal(products[3]);
        expect(products.asQueryable().elementAtAsync(products.length)).eventually.be.rejectedWith();
    });

    it('elementAtOrDefault', () => {
        expect(products.asQueryable().elementAtOrDefaultAsync(3)).eventually.equal(products[3]);
        expect(products.asQueryable().elementAtOrDefaultAsync(33)).eventually.equal(null);
    });

    it('first', () => {
        expect(products.asQueryable().firstAsync()).eventually.equal(products[0]);
        expect(products.asQueryable().firstAsync(p => p.no === products[3].no)).eventually.equal(products[3]);

        expect([].asQueryable().firstAsync()).to.eventually.be.rejectedWith();
        expect(products.asQueryable().firstAsync(p => p.category === 'None')).to.eventually.be.rejectedWith();
    });

    it('firstOrDefault', () => {
        expect(products.asQueryable().firstOrDefaultAsync()).eventually.equal(products[0]);
        expect([].asQueryable().firstOrDefaultAsync()).eventually.equal(null);
        expect(products.asQueryable().firstOrDefaultAsync(p => p.no == products[2].no)).eventually.equal(products[2]);
        expect(products.asQueryable().firstOrDefaultAsync(p => p.category === 'None')).eventually.equal(null);
    });

    it('last', () => {
        const idx = products.length - 1;
        expect(products.asQueryable().lastAsync()).eventually.equal(products[idx]);
        expect(products.asQueryable().lastAsync(p => p.no === products[idx].no)).eventually.equal(products[idx]);

        expect([].asQueryable().lastAsync()).to.eventually.be.rejectedWith();
        expect(products.asQueryable().lastAsync(p => p.category === 'None')).to.eventually.be.rejectedWith();
    });

    it('lastOrDefault', () => {
        expect([].asQueryable().lastOrDefaultAsync()).eventually.equal(null);
        expect(products.asQueryable().lastOrDefaultAsync(p => p.category === 'None')).eventually.equal(null);
    });

    it('max', () => {
        expect([2, 1, 3, 4].asQueryable().maxAsync()).eventually.equal(4);
        expect(products.asQueryable().maxAsync(p => p.no)).eventually.equal('Prd9');
    });

    it('min', () => {
        expect([2, 1, 3, 4].asQueryable().minAsync()).eventually.equal(1);
        expect(products.asQueryable().minAsync(p => p.no)).eventually.equal('Prd1');
    });

    it('sequenceEqual', () => {
        expect([1, 2, 3, 4].asQueryable().sequenceEqualAsync([1, 2, 3, 4])).eventually.be.true;
        expect([1, 2, 3, 4, 5].asQueryable().sequenceEqualAsync([1, 2, 3, 4])).eventually.be.false;
        expect([1, 2, 3, 4].asQueryable().sequenceEqualAsync([1, 2, 3, 4, 5])).eventually.be.false;

        expect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            .asQueryable()
            .sequenceEqualAsync([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], (i1, i2) => i1.id == i2.id)
        ).eventually.be.true;
    });

    it('single', () => {
        expect([42].asQueryable().singleAsync()).eventually.equal(42);
        expect(products.asQueryable().singleAsync(p => p.no === products[3].no)).eventually.equal(products[3]);

        expect(products.asQueryable().singleAsync()).to.eventually.be.rejectedWith();
        expect(products.asQueryable().take(0).singleAsync()).to.eventually.be.rejectedWith();
        expect(products.asQueryable().singleAsync(p => p.category !== 'None')).to.eventually.be.rejectedWith();
        expect(products.asQueryable().singleAsync(p => p.category === 'None')).to.eventually.be.rejectedWith();
    });

    it('singleOrDefault', () => {
        expect([].asQueryable().singleOrDefaultAsync()).eventually.equal(null);
        expect(products.asQueryable().singleOrDefaultAsync(p => p.category === 'None')).eventually.equal(null);

        expect(products.asQueryable().singleOrDefaultAsync()).eventually.be.rejectedWith();
        expect(products.asQueryable().singleOrDefaultAsync(p => p.category !== 'None')).eventually.be.rejectedWith();
    });

    it('sum', () => {
        expect([1, 2, 3, 4].asQueryable().sumAsync()).eventually.equal(10);
        expect(orders.asQueryable().sumAsync(o => o.id)).eventually.equal(15);
    });

    it('toArray', async function () {
        const result = await orders.asQueryable().where(c => c.id > 3).toArrayAsync();
        expect(result).property('length').to.equal(2);
        expect(result[0].id).to.equal(4);
        expect(result[1].no).to.equal('Ord5');
    });
});
