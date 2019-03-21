import { expect } from 'chai';
import 'mocha';
import { QueryPart, PartArgument, ArrayQueryProvider } from '../index';
import { orders, Order, products, Product } from './fixture';

describe('Jinqu should', () => {

    it('filter iterable', () => {
        const provider = new ArrayQueryProvider(orders[Symbol.iterator]());
        const result = provider.createQuery<Order>().where(c => c.id > 3).toArray();
        expect(result).property('length').to.equal(2);
        expect(result[0].id).to.equal(4);
        expect(result[1].no).to.equal('Ord5');

        expect(orders).to.deep.equal(new ArrayQueryProvider(orders).execute(null));
    });

    it('iterate filtered array', () => {
        const query = orders.asQueryable().where(c => c.id > 3);

        let i = 3;
        for (let o of query) {
            expect(o).to.equal(orders[i++]);
        }
    });

    it('sort order details when executed explicitly', () => {
        const query = orders[4].details.asQueryable()
            .orderBy(d => d.supplier)
            .thenByDescending(d => d.count);
        const sortedDetails = Array.from(query.provider.execute<Order[]>(query.parts));

        expect(sortedDetails[0]).property('count').to.be.equal(67);
        expect(sortedDetails[1]).property('count').to.be.equal(13);
        expect(sortedDetails[2]).property('count').to.be.equal(86);
    });

    it('throw for unknown part', () => {
        const query = orders.asQueryable();
        query.parts.push({ type: '42', args: [], scopes: [] });

        expect(() => query.toArray()).to.throw();
    });

    it('throw for null source', () => {
        expect(() => new ArrayQueryProvider(null)).to.throw();
    });

    it('handle literal query part as function', () => {
        const items = [{ id: 1 }, { id: 2 }];
        expect(items.asQueryable().select('id').toArray()).to.deep.equal([1, 2]);
    });

    it('QueryPart and PartArgument work as expected', () => {
        expect(() => new QueryPart('')).to.throw();
        expect(new QueryPart('where')).property('scopes').to.deep.equal([]);

        const part1 = new PartArgument(null, null, null);
        expect(part1.func).to.be.null;
        expect(part1.expStr).to.be.null;
        expect(part1.exp).to.be.null;
        expect(part1.scopes).to.be.null;

        const part2 = new PartArgument(c => c % 2 == 0, null, null);
        expect(part2.expStr).not.null;
    });

    it('fix prototype 1', () => {
        const provider = new ArrayQueryProvider(products);
        const result = provider.createQuery<Product>(void 0, Product).toArray();

        result.forEach(r => expect(r).to.be.instanceOf(Product));
    });

    it('fix prototype 2', () => {
        const result = products.asQueryable(Product).toArray();

        result.forEach(r => expect(r).to.be.instanceOf(Product));
    });

    it('fix prototype 3', () => {
        const result = products.asQueryable().cast(Product).toArray();

        result.forEach(r => expect(r).to.be.instanceOf(Product));
    });

    it('fix prototype 4', () => {
        const result = products.asQueryable().toArray(Product);

        result.forEach(r => expect(r).to.be.instanceOf(Product));
    });

    it('fix prototype 5', async () => {
        const result = await products.asQueryable().toArrayAsync(Product);

        result.forEach(r => expect(r).to.be.instanceOf(Product));
    });
});
