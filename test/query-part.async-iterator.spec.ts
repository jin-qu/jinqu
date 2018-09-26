import { expect } from 'chai';
import 'mocha';
import { orders, products } from './fixture';
import '..';

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Jinqu should be able to asynchronously iterate', () => {

    it('filtered array', async function() {
        let i = 0;
        for await (let order of orders.asQueryable().where(o => o.id > 3)) {
            expect(order.id).to.equal(4 + i);
            expect(order.no).to.equal('Ord' + (4 + i));
    
            i++;
        }
    });
});
