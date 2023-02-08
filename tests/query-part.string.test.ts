/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "../index";
import { OrderNo, orders, products } from "./fixture";

describe("Jinqu should be able to use string expressions with", () => {

    it("aggregate", () => {
        expect([1, 2, 3, 4].asQueryable().aggregate("(seed, value) => seed + value")).toBe(10);
        expect([1, 2, 3, 4].asQueryable().aggregate("(seed, value) => seed + value", 32)).toBe(42);
    });

    it("all", () => {
        expect([1, 2, 3, 4].asQueryable().all("i => i > 0")).toBe(true);
        expect([1, 2, 3, 4].asQueryable().any("i => i > 4")).toBeFalsy;

        expect(products.asQueryable().all("p => p.category !== null")).toBe(true);
        expect(products.asQueryable().all('p => p.name === "None"')).toBeFalsy;
    });

    it("any", () => {
        expect([1, 2, 3, 4].asQueryable().any("i => i > 3")).toBe(true);
        expect([1, 2, 3, 4].asQueryable().any("i => i > 4")).toBeFalsy;

        const p5 = products[5];
        expect(products.asQueryable().any("p => p.name === p5.name", { p5 })).toBe(true);
        expect(products.asQueryable().any('p => p.name === "None"')).toBeFalsy;
    });

    it("average", () => {
        expect(orders.asQueryable().average("o => o.id")).toBe(3);
    });

    it("count", () => {
        expect([1, 2, 3, 4].asQueryable().count("i => i > 2")).toBe(2);
    });

    it("distinct", () => {
        const items = [
            { id: 1, name: "i1" },
            { id: 2, name: "i2" },
            { id: 1, name: "i3" },
            { id: 3, name: "i4" },
            { id: 3, name: "i5" },
            { id: 2, name: "i6" },
            { id: 1, name: "i7" },
            { id: 3, name: "i8" },
        ];
        const distItems = items.asQueryable().distinct("(i1, i2) => i1.id === i2.id").toArray();

        expect(distItems).toHaveLength(3);
    });

    it("except", () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 2 }, { id: 3 }, arr1[0]];

        const except = arr2.asQueryable().except(arr1, "(i1, i2) => i1.id == i2.id").toArray();
        expect(except).toHaveLength(1);
    });

    it("first", () => {
        const p4 = products[3];
        expect(products.asQueryable().first("p => p.no === p4.no", { p4 })).toBe(products[3]);
        expect(() => products.asQueryable().first('p => p.category === "None"')).toThrow;
    });

    it("firstOrDefault", () => {
        const p3 = products[2];
        expect(products.asQueryable().firstOrDefault("p => p.no == p3.no", { p3 })).toBe(products[2]);
        expect(products.asQueryable().firstOrDefault('p => p.category === "None"')).toBe(null);
    });

    it("groupBy", () => {
        const prodCat1 = products
            .asQueryable()
            .groupBy("p => p.category", "(k, g) => ({ category: k, count: g.length })")
            .toArray();

        expect(prodCat1).toHaveLength(3);
        expect(prodCat1[0]).toHaveProperty("count", 3);
        expect(prodCat1[1]).toHaveProperty("count", 2);
        expect(prodCat1[2]).toHaveProperty("count", 4);

        const prodCat2 = products
            .asQueryable()
            .groupBy("p => p.category")
            .toArray();

        expect(prodCat2).toHaveLength(3);
        expect(prodCat2[2]).toHaveProperty("key", "Cat03");
        expect(prodCat2[2]).toHaveLength(4);
    });

    it("groupJoin", () => {
        const details = orders.asQueryable().selectMany(o => o.details!).toArray();
        const prdCount = [products[0], products[1]].asQueryable().groupJoin(
            details,
            "p => p.no",
            "d => d.product",
            "(p, ds) => { product: p.no, count: ds.length }",
        ).toArray();

        expect(prdCount).toEqual([{ product: "Prd1", count: 2 }, { product: "Prd2", count: 1 }]);
    });

    it("intersect", () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 2 }, { id: 3 }, arr1[0]];

        const concat = arr1.asQueryable().intersect(arr2, "(i1, i2) => i1.id == i2.id").toArray();
        expect(concat).toHaveLength(2);
    });

    it("join", () => {
        const details = orders[0].details;
        const supCat = details!.asQueryable().join(
            products,
            "d => d.product",
            "p => p.no",
            "(d, p) => { supplier: d.supplier, category: p.category }",
        ).toArray();

        expect(supCat).toEqual([{ supplier: "ABC", category: "Cat01" }, { supplier: "QWE", category: "Cat02" }]);
    });

    it("last", () => {
        const last = products[products.length - 1];
        expect(products.asQueryable().last("p => p.no === lastNo", { lastNo: last.no })).toBe(last);
        expect(() => products.asQueryable().last('p => p.category === "None"')).toThrow();
    });

    it("lastOrDefault", () => {
        expect(products.asQueryable().lastOrDefault('p => p.category === "None"')).toBe(null);
    });

    it("max", () => {
        expect(products.asQueryable().max("p => p.no")).toBe("Prd9");
    });

    it("min", () => {
        expect(products.asQueryable().min("p => p.no")).toBe("Prd1");
    });

    it("orderBy, orderByDescending, thenBy, thenByDescending", () => {
        const sortedDetails1 = orders[4].details!.asQueryable()
            .orderBy("d => d.supplier")
            .thenByDescending("d => d.count")
            .toArray();

        expect(sortedDetails1[0]).toHaveProperty("count", 67);
        expect(sortedDetails1[1]).toHaveProperty("count", 13);
        expect(sortedDetails1[2]).toHaveProperty("count", 86);

        const sortedDetails2 = orders[4].details!.asQueryable()
            .orderByDescending("d => d.supplier")
            .thenBy("d => d.count")
            .toArray();

        expect(sortedDetails2[0]).toHaveProperty("count", 8);
        expect(sortedDetails2[1]).toHaveProperty("count", 4);
        expect(sortedDetails2[2]).toHaveProperty("count", 34);
    });

    it("select", () => {
        const ids = orders.asQueryable().select("o => o.id").toArray();
        expect(ids).toEqual([1, 2, 3, 4, 5]);

        const token = "abc";
        const idNo = orders.asQueryable().select("o => ({ id: o.id, no: o.no, token: token })", { token }).toArray();
        expect(idNo).toEqual([
            { id: 1, no: "Ord1", token: "abc" },
            { id: 2, no: "Ord2", token: "abc" },
            { id: 3, no: "Ord3", token: "abc" },
            { id: 4, no: "Ord4", token: "abc" },
            { id: 5, no: "Ord5", token: "abc" },
        ]);

        const no = orders.asQueryable().select<OrderNo>("o => ({ no: o.no })", OrderNo).toArray();
        no.forEach(n => expect(n).toBeInstanceOf(OrderNo));
    });

    it("selectMany", () => {
        const details = orders.asQueryable().selectMany("o => o.details").toArray();
        expect(details.length).toBe(16);
    });

    it("sequenceEqual", () => {
        expect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            .asQueryable()
            .sequenceEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], "(i1, i2) => i1.id == i2.id"),
        ).toBe(true);
    });

    it("single", () => {
        const p4 = products[3];
        expect(products.asQueryable().single("p => p.no === p4No", { p4No: p4.no })).toBe(p4);
        expect(() => products.asQueryable().single('p => p.category === "None"')).toThrow();
        expect(() => products.asQueryable().single('p => p.category !== "None"')).toThrow();
    });

    it("singleOrDefault", () => {
        expect(products.asQueryable().singleOrDefault('p => p.category === "None"')).toBe(null);
        expect(() => products.asQueryable().singleOrDefault('p => p.category !== "None"')).toThrow();
    });

    it("skipWhile", () => {
        const biggerTwo = orders.asQueryable().skipWhile("o => o.id < 3").toArray();

        expect(biggerTwo).toHaveLength(3);
        expect(biggerTwo[0]).toHaveProperty("id", 3);
        expect(biggerTwo[1]).toHaveProperty("id", 4);
        expect(biggerTwo[2]).toHaveProperty("id", 5);
    });

    it("sum", () => {
        expect(orders.asQueryable().sum("o => o.id")).toBe(15);
    });

    it("takeWhile", () => {
        const firstTwo = orders.asQueryable().takeWhile("o => o.id < 3").toArray();

        expect(firstTwo).toHaveLength(2);
        expect(firstTwo[0]).toHaveProperty("id", 1);
        expect(firstTwo[1]).toHaveProperty("id", 2);
    });

    it("union", () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 2 }, { id: 3 }, arr1[0]];

        const union = arr1.asQueryable().union(arr2, "(i1, i2) => i1.id == i2.id").toArray();
        expect(union).toHaveLength(3);
    });

    it("where", () => {
        const result1 = orders.asQueryable().where("c => c.id > 3").toArray();
        expect(result1).toHaveLength(2);
        expect(result1[0].id).toBe(4);
        expect(result1[1].no).toBe("Ord5");

        const details = orders.asQueryable().selectMany(o => o.details!).toArray();
        const result2 = details.asQueryable()
            .where('d => (d.count > 20 && d.supplier != "QWE") || (d.count < 10 && d.supplier == "TYU")')
            .toArray();
        expect(result2).toHaveLength(8);
        expect(result2[0]).toHaveProperty("count", 63);
        expect(result2[1]).toHaveProperty("product", "Prd4");
        expect(result2[2]).toHaveProperty("supplier", "ABC");
    });

    it("zip", () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }];
        const arr3 = [{ id: 5 }];

        const zip1 = arr1.asQueryable().zip(arr2, "(i1, i2) => i1.id + i2.id").toArray();
        expect(zip1).toEqual([4, 6]);

        const zip2 = arr1.asQueryable().zip(arr3, "(i1, i2) => i1.id + i2.id").toArray();
        expect(zip2).toEqual([6]);
    });
});
