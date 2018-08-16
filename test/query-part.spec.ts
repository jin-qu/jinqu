import { expect } from 'chai';
import 'mocha';
import '../lib/array-extensions';

interface Customer {
    id: number;
    name: string;
}

const customers: Customer[] = [
    { id: 1, name: 'Netflix' },
    { id: 2, name: 'Google' },
    { id: 3, name: 'Apple' },
    { id: 4, name: 'Microsoft' },
    { id: 5, name: 'Facebook' },
    { id: 6, name: 'Uber' },
    { id: 7, name: 'Lyft' }
];

describe('Query part tests', () => {

    it('should filter the array', () => {
        const result = customers.where('c => c.id > 4').toList();

        expect(result.length).to.equal(3);
        expect(result[0].id).to.equal(5);
        expect(result[1].name).to.equal('Uber');
        expect(result[2].id).to.equal(7);
    });
});