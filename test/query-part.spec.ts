import { expect } from 'chai';
import 'mocha';
import '../index';
import { orders } from './fixture';

describe('Query part tests', () => {

    it('should filter the array', () => {
        const result = orders.where(c => c.id > 3).toArray();

        expect(result.length).to.equal(2);
        expect(result[0].id).to.equal(4);
        expect(result[1].no).to.equal('Ord5');
    });
});
