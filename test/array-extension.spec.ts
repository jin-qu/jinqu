import { expect } from "chai";
import "mocha";

import "./shim";
import { QueryFunc } from "../index";

// tslint:disable:no-unused-expression
describe("Array extensions", () => {

    it("should create range", () => {
        expect(Array.from(Array.range(1, 5))).to.deep.equal([1, 2, 3, 4, 5]);
        expect(Array.from(Array.range(5))).to.deep.equal([0, 1, 2, 3, 4]);

        expect(() => Array.from(Array.range(1, -1))).to.throw();
        expect(() => Array.from(Array.range(-1))).to.throw();
    });

    it("should repeat given item", () => {
        expect(Array.from(Array.repeat("JS", 3))).to.deep.equal(["JS", "JS", "JS"]);
        expect(() => Array.from(Array.repeat("JS", -1))).to.throw();
    });

    it("should create all query functions on Array", () => {
        const arr = [];
        const haveItAll = Object.getOwnPropertyNames(QueryFunc).every((f) => f in arr)
            && "joinWith" in arr
            && "concatWith" in arr
            && "reverseTo" in arr;

        expect(haveItAll).to.be.true;
    });

    it("should work for a sample function", () => {
        const arr = [1, 2, 3, 4, 5];
        const query = arr.q();

        expect(query.where((i) => i > 3).count()).to.equal(2);
        expect(arr.where((i) => i > 3).count()).to.equal(2);
    });
});
