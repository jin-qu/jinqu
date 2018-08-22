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
});
