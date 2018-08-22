import { expect } from 'chai';
import 'mocha';
import { QueryFunc } from '../lib/query-part';
import '../lib/array-extensions';

describe('Array extension tests', () => {

    it('should create range', () => {
        expect(Array.from(Array.range(1, 5))).to.deep.equal([1, 2, 3, 4, 5]);
        expect(Array.from(Array.range(5))).to.deep.equal([0, 1, 2, 3, 4]);
    });

    it('should should repeat given item', () => {
        expect(Array.from(Array.repeat('JS', 3))).to.deep.equal(['JS', 'JS', 'JS']);
    });

    it('should create all query functions on Array', () => {
        const arr = [];
        const haveItAll = Object.getOwnPropertyNames(QueryFunc).every(f => f in arr);

        expect(haveItAll).to.be.true;
    });
});
