import { expect } from 'chai';
import 'mocha';
import { mergeAjaxOptions, AjaxOptions } from '../lib/ajax';

describe('Ajax helper tests', () => {

    it('should return null for two null options', () => {
        expect(mergeAjaxOptions(null, null)).to.be.null;
    });

    it('should return first option when second is null', () => {
        const o1: AjaxOptions = {};
        expect(mergeAjaxOptions(o1, null)).to.equal(o1);
    });

    it('should return second option when first is null', () => {
        const o2: AjaxOptions = {};
        expect(mergeAjaxOptions(null, o2)).to.equal(o2);
    });

    it('should merge two options', () => {
        const o1: AjaxOptions = {
            data: { id: 5 },
            headers: { 
                'Content-Type': 'application/javascript',
                'Accept': 'json'
            },
            method: 'GET',
            params: [
                { key: '$where', value: 'a => a < 5' }
            ],
            timeout: 300
        };
        const o2: AjaxOptions = {
            data: { name: 'Zaphod' },
            headers: { 
                'Content-Type': 'application/json',
                'Auth': '12345'
            },
            params: [
                { key: '$orderBy', value: 'a => a' }
            ],
            timeout: 1000,
            url: 'List'
        }
        const o = mergeAjaxOptions(o1, o2);

        expect(o).property('data').property('id').to.equal(5);
        expect(o).property('data').property('name').to.equal('Zaphod');
        
        expect(o).property('headers').property('Content-Type').to.equal('application/json');
        expect(o).property('headers').property('Accept').to.equal('json');
        expect(o).property('headers').property('Auth').to.equal('12345');

        expect(o).property('method').to.equal('GET');

        const prms = [{ key: '$where', value: 'a => a < 5' }, { key: '$orderBy', value: 'a => a' }];
        expect(o).property('params').to.deep.equal(prms);

        expect(o).property('timeout').to.equal(1000);

        expect(o).property('url').to.equal('List');
    });
});
