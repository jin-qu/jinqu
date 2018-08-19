import { expect } from 'chai';
import 'mocha';
import '../index';
import { customers } from './fixture';

describe('Query part tests', () => {

    it('should filter the array', () => {
        const result = customers.where(c => c.id > 4).toArray();

        expect(result.length).to.equal(3);
        expect(result[0].id).to.equal(5);
        expect(result[1].name).to.equal('Uber');
        expect(result[2].id).to.equal(7);
    });
});
