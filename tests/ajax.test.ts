import { AjaxOptions, mergeAjaxOptions } from "..";

describe("Ajax helper", () => {

    it("should return null for two null options", () => {
        expect(mergeAjaxOptions(null, null)).toBeNull;
    });

    it("should return first option when second is null", () => {
        const o1: AjaxOptions = {};
        expect(mergeAjaxOptions(o1, null)).toBe(o1);
    });

    it("should return second option when first is null", () => {
        const o2: AjaxOptions = {};
        expect(mergeAjaxOptions(null, o2)).toBe(o2);
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

        expect(o).toHaveProperty("data.id", 5);
        expect(o).toHaveProperty("data.name", "Zaphod");

        expect(o).toHaveProperty("headers.Content-Type", "application/json");
        expect(o).toHaveProperty("headers.Accept", "json");
        expect(o).toHaveProperty("headers.Auth", "12345");

        expect(o).toHaveProperty("method", "GET");

        const prms = [{ key: "$where", value: "a => a < 5" }, { key: "$orderBy", value: "a => a" }];
        expect(o).toHaveProperty("params", prms);

        expect(o).toHaveProperty("timeout", 1000);

        expect(o).toHaveProperty("url", "List");
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
        const merged = {
            data: { id: 1 },
            headers: { AUTH: "42" },
            method: "GET",
            params: [],
            timeout: 1000,
            url: "Companies",
        };

        expect(mergeAjaxOptions(o1, o2)).toEqual(merged);
    });

    it("should merge two options 3", () => {
        const o1: AjaxOptions = {
            data: { id: 1 },
        };
        const o2: AjaxOptions = {
        };

        expect(mergeAjaxOptions(o1, o2)).toHaveProperty("data", o1.data);
    });
});
