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
});
