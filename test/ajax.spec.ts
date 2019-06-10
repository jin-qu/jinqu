import { expect } from "chai";
import "mocha";

import "./shim";
import { AjaxOptions, mergeAjaxOptions } from "../index";

// tslint:disable:no-unused-expression
describe("Ajax helper", () => {

    it("should return null for two null options", () => {
        expect(mergeAjaxOptions(null, null)).to.be.null;
    });

    it("should return first option when second is null", () => {
        const o1: AjaxOptions = {};
        expect(mergeAjaxOptions(o1, null)).to.equal(o1);
    });

    it("should return second option when first is null", () => {
        const o2: AjaxOptions = {};
        expect(mergeAjaxOptions(null, o2)).to.equal(o2);
    });

    it("should merge two options 1", () => {
        const o1: AjaxOptions = {
            data: { id: 5 },
            headers: {
                "Accept": "json",
                "Content-Type": "application/javascript",
            },
            method: "GET",
            params: [
                { key: "$where", value: "a => a < 5" },
            ],
            timeout: 300,
        };
        const o2: AjaxOptions = {
            data: { name: "Zaphod" },
            headers: {
                "Auth": "12345",
                "Content-Type": "application/json",
            },
            params: [
                { key: "$orderBy", value: "a => a" },
            ],
            timeout: 1000,
            url: "List",
        };
        const o = mergeAjaxOptions(o1, o2);

        expect(o).property("data").property("id").to.equal(5);
        expect(o).property("data").property("name").to.equal("Zaphod");

        expect(o).property("headers").property("Content-Type").to.equal("application/json");
        expect(o).property("headers").property("Accept").to.equal("json");
        expect(o).property("headers").property("Auth").to.equal("12345");

        expect(o).property("method").to.equal("GET");

        const prms = [{ key: "$where", value: "a => a < 5" }, { key: "$orderBy", value: "a => a" }];
        expect(o).property("params").to.deep.equal(prms);

        expect(o).property("timeout").to.equal(1000);

        expect(o).property("url").to.equal("List");
    });

    it("should merge two options 2", () => {
        const o1: AjaxOptions = {
            method: "GET",
            timeout: 1000,
            url: "Companies",
        };
        const o2: AjaxOptions = {
            data: { id: 1 },
            headers: { AUTH: "42" },
        };

        expect(mergeAjaxOptions(o1, o2)).to.deep.equal({
            data: { id: 1 },
            headers: { AUTH: "42" },
            method: "GET",
            params: [],
            timeout: 1000,
            url: "Companies",
        });
    });

    it("should merge two options 3", () => {
        const o1: AjaxOptions = {
            data: { id: 1 },
        };
        const o2: AjaxOptions = {
        };

        expect(mergeAjaxOptions(o1, o2)).property("data").to.equal(o1.data);
    });
});
