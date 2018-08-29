import { expect } from 'chai';
import 'mocha';
import { orders, products } from './fixture';
import '..';

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Query part async tests', () => {

    it('should filter the array', async function() {
        const result = await orders.asQueryable().where(c => c.id > 3).toArrayAsync();
        expect(result).property('length').to.equal(2);
        expect(result[0].id).to.equal(4);
        expect(result[1].no).to.equal('Ord5');
    });

    it('should return first item', async () => {
        expect(await products.asQueryable().firstAsync()).to.equal(products[0]);
        expect(await products.asQueryable().firstAsync(p => p.no === products[3].no)).to.equal(products[3]);
    });

    it('should return default for missing first item', async () => {
        expect(await [].asQueryable().firstOrDefaultAsync()).to.equal(null);
        expect(await products.asQueryable().firstOrDefaultAsync(p => p.category === 'None')).to.equal(null);
    });

    it('should throw error for missing first item', () => {
        expect([].asQueryable().firstAsync()).to.eventually.be.rejectedWith();
        expect(products.asQueryable().firstAsync(p => p.category === 'None')).to.eventually.be.rejectedWith();
    });

    it('should return last item', async () => {
        const idx = products.length - 1;
        expect(await products.asQueryable().lastAsync()).to.equal(products[idx]);
        expect(await products.asQueryable().lastAsync(p => p.no === products[idx].no)).to.equal(products[idx]);
    });

    it('should return default for missing last item', async () => {
        expect(await [].asQueryable().lastOrDefaultAsync()).to.equal(null);
        expect(await products.asQueryable().lastOrDefaultAsync(p => p.category === 'None')).to.equal(null);
    });

    it('should throw error for missing last item', async () => {
        expect([].asQueryable().lastAsync()).to.eventually.be.rejectedWith();
        expect(products.asQueryable().lastAsync(p => p.category === 'None')).to.eventually.be.rejectedWith();
    });

    it('should return single item', async () => {
        expect(await [42].asQueryable().singleAsync()).to.equal(42);
        expect(await products.asQueryable().singleAsync(p => p.no === products[3].no)).to.equal(products[3]);
    });

    it('should return default for missing single item', async () => {
        expect(await [].asQueryable().singleOrDefaultAsync()).to.equal(null);
        expect(await products.asQueryable().singleOrDefaultAsync(p => p.category === 'None')).to.equal(null);
    });

    it('should throw error for missing single item', () => {
        expect(products.asQueryable().singleAsync()).to.eventually.be.rejectedWith();
        expect(products.asQueryable().singleAsync(p => p.category === 'None')).to.eventually.be.rejectedWith();
    });

    it('should return given indexed item', async () => {
        expect(await products.asQueryable().elementAtAsync(3)).to.equal(products[3]);
        expect(await products.asQueryable().elementAtOrDefaultAsync(33)).to.equal(null);
    });

    it('should return if array contains the given item', async () => {
        expect(await products.asQueryable().containsAsync(products[3])).to.be.true;
        expect(await [1, 2, 3, 4].asQueryable().containsAsync(5)).to.be.false;
    });

    it('should return if array is equal to given array', async () => {
        expect(await [1, 2, 3, 4].asQueryable().sequenceEqualAsync([1, 2, 3, 4])).to.be.true;
        expect(await [1, 2, 3, 4, 5].asQueryable().sequenceEqualAsync([1, 2, 3, 4])).to.be.false;
        expect(await [1, 2, 3, 4].asQueryable().sequenceEqualAsync([1, 2, 3, 4, 5])).to.be.false;
    });

    it('should return if any item matches the predicate', async () => {
        expect(await [1, 2, 3, 4].asQueryable().anyAsync()).to.be.true;
        expect(await [1, 2, 3, 4].asQueryable().anyAsync(i => i > 3)).to.be.true;
        expect(await [1, 2, 3, 4].asQueryable().anyAsync(i => i > 4)).to.be.false;

        expect(await products.asQueryable().anyAsync(p => p.name === products[4].name)).to.be.true;
        expect(await products.asQueryable().anyAsync(p => p.name === 'None')).to.be.false;
    });

    it('should return if all items matches the predicate', async () => {
        expect(await [1, 2, 3, 4].asQueryable().allAsync(i => i > 0)).to.be.true;
        expect(await [1, 2, 3, 4].asQueryable().anyAsync(i => i > 4)).to.be.false;

        expect(await products.asQueryable().allAsync(p => p.category !== null)).to.be.true;
        expect(await products.asQueryable().allAsync(p => p.name === 'None')).to.be.false;
    });

    it('should return the count of items that matches the predicate', async () => {
        expect(await [1, 2, 3, 4].asQueryable().countAsync()).to.equal(4);
        expect(await [1, 2, 3, 4].asQueryable().countAsync(i => i > 2)).to.equal(2);
    });

    it('should return the min value', async () => {
        expect(await [1, 2, 3, 4].asQueryable().minAsync()).to.equal(1);
        expect(await products.asQueryable().minAsync(p => p.no)).to.equal('Prd1');
    });

    it('should return the max value', async () => {
        expect(await [1, 2, 3, 4].asQueryable().maxAsync()).to.equal(4);
        expect(await products.asQueryable().maxAsync(p => p.no)).to.equal('Prd9');
    });

    it('should return the sum of values', async () => {
        expect(await [1, 2, 3, 4].asQueryable().sumAsync()).to.equal(10);
        expect(await orders.asQueryable().sumAsync(o => o.id)).to.equal(15);
    });

    it('should return the average of values', async () => {
        expect(await [1, 2, 3, 4].asQueryable().averageAsync()).to.equal(2.5);
        expect(await orders.asQueryable().averageAsync(o => o.id)).to.equal(3);
    });

    it('should return the aggregated value', async () => {
        expect(await [1, 2, 3, 4].asQueryable().aggregateAsync((seed, value) => seed + value)).to.equal(10);
        expect(await [1, 2, 3, 4].asQueryable().aggregateAsync((seed, value) => seed + value, 32)).to.equal(42);

        const agg = await orders.asQueryable().aggregateAsync((seed, order) => seed + order.id, 69, v => v / 2);
        expect(agg).to.equal(42);
    });
});
