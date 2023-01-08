// tslint:disable-next-line:ordered-imports
import "../index";
import { ExtendedOrder, IOrder, IProduct, Order, OrderNo, orders, products } from "./fixture";

// tslint:disable:no-unused-expression
describe("Jinqu should be able to use", () => {

    it("aggregate", () => {
        expect([1, 2, 3, 4].asQueryable().aggregate((seed, value) => seed + value)).toBe(10);
        expect([1, 2, 3, 4].asQueryable().aggregate((seed, value) => seed + value, 32)).toBe(42);
    });

    it("all", () => {
        expect([1, 2, 3, 4].asQueryable().all((i) => i > 0)).toBe(true);
        expect([1, 2, 3, 4].asQueryable().all((i) => i > 4)).toBe(false);

        expect(products.asQueryable().all((p) => p.category !== null)).toBe(true);
        expect(products.asQueryable().all((p) => p.name === "None")).toBe(false);
    });

    it("any", () => {
        expect([1, 2, 3, 4].asQueryable().any()).toBe(true);
        expect([1, 2, 3, 4].asQueryable().any((i) => i > 3)).toBe(true);
        expect([1, 2, 3, 4].asQueryable().any((i) => i > 4)).toBe(false);

        expect(products.asQueryable().any((p) => p.name === products[4].name)).toBe(true);
        expect(products.asQueryable().any((p) => p.name === "None")).toBe(false);
    });

    it("average", () => {
        expect([1, 2, 3, 4].asQueryable().average()).toEqual(2.5);
        expect(orders.asQueryable().average((o) => o.id)).toBe(3);
        expect([].asQueryable().average()).toBe(0);
    });

    // tslint:disable:ban-types
    it("cast", () => {
        // primitive test
        const items: any[] = ["1", 2, "3", 4, "5"];
        const numbers = items.asQueryable().cast<Number>(Number).toArray();
        expect(numbers).toEqual([1, 2, 3, 4, 5]);

        // object test
        const classOrders = [orders[0], orders[2], orders[4]].asQueryable().cast<Order>(Order).toArray();
        expect(classOrders).toEqual([orders[0], orders[2], orders[4]]);

        const protoFixedOrders = orders.asQueryable().cast<Order>(Order).toArray();
        protoFixedOrders.forEach((pfo) => expect(pfo).toBeInstanceOf(Order));

        expect([null].asQueryable().cast<Number>(Number).toArray()).toEqual([null]);

        expect(() => orders.asQueryable().cast<ExtendedOrder>(ExtendedOrder).toArray()).toThrow();

        expect(() => ["Morty"].asQueryable().cast<Number>(Number).toArray()).toThrow();
    });
    // tslint:enable:ban-types

    it("concat", () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }, arr1[0]];

        const concat = arr1.asQueryable().concat(arr2).toArray();

        expect(concat).toHaveLength(5);
    });

    it("contains", () => {
        const arr = [1, 2, 1, 3, 3, 2, 1, 3];
        expect(arr.asQueryable().contains(arr[3])).toBe(true);
        expect(arr.asQueryable().contains(5)).toBe(false);

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
        expect(items.asQueryable().contains({ id: 3 } as any, (i1, i2) => i1.id === i2.id)).toBe(true);
    });

    it("count", () => {
        expect([1, 2, 3, 4].asQueryable().count()).toBe(4);
        expect([1, 2, 3, 4].asQueryable().count((i) => i > 2)).toBe(2);
    });

    it("defaultIfEmpty", () => {
        const arr = [{ id: 1 }, { id: 2 }];

        const defEmp1 = arr.asQueryable().defaultIfEmpty().toArray();
        expect(defEmp1).not.toBe(arr);
        expect(defEmp1).toEqual(arr);

        const defEmp2 = [].asQueryable().defaultIfEmpty({ id: 0 } as any).toArray();
        expect(defEmp2).toEqual([{ id: 0 }]);

        const defEmp3 = [].asQueryable().defaultIfEmpty(null).toArray();
        expect(defEmp3).toHaveLength(0);
    });

    it("distinct", () => {
        const arr = [1, 2, 1, 3, 3, 2, 1, 3];
        const dist = arr.asQueryable().distinct().toArray();
        expect(dist).toHaveLength(3);

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
        const distItems = items.asQueryable().distinct((i1, i2) => i1.id === i2.id).toArray();
        expect(distItems).toHaveLength(3);
    });

    it("elementAt", () => {
        expect(products.asQueryable().elementAt(3)).toBe(products[3]);
        expect(() => products.asQueryable().elementAt(products.length)).toThrow();
    });

    it("elementAtOrDefault", () => {
        expect(products.asQueryable().elementAtOrDefault(3)).toBe(products[3]);
        expect(products.asQueryable().elementAtOrDefault(33)).toBe(null);
    });

    it("except", () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 2 }, { id: 3 }, arr1[0]];

        const except1 = arr2.asQueryable().except(arr1).toArray();
        expect(except1).toHaveLength(2);

        const except2 = arr2.asQueryable().except(arr1, (i1, i2) => i1.id === i2.id).toArray();
        expect(except2).toHaveLength(1);
    });

    it("first", () => {
        expect(products.asQueryable().first()).toBe(products[0]);
        expect(products.asQueryable().first((p) => p.no === products[3].no)).toBe(products[3]);

        expect(() => [].asQueryable().first()).toThrow();
        expect(() => products.asQueryable().first((p) => p.category === "None")).toThrow();
    });

    it("firstOrDefault", () => {
        expect(products.asQueryable().firstOrDefault()).toBe(products[0]);
        expect([].asQueryable().firstOrDefault()).toBe(null);
        expect(products.asQueryable().firstOrDefault((p) => p.no === products[2].no)).toBe(products[2]);
        expect(products.asQueryable().firstOrDefault((p) => p.category === "None")).toBe(null);
    });

    it("groupBy", () => {
        const prodCat1 = products
            .asQueryable()
            .groupBy((p) => p.category, (k, g) => ({ category: k, count: g.length }))
            .toArray();

        expect(prodCat1).toHaveLength(3);
        expect(prodCat1[0]).toHaveProperty("count", 3);
        expect(prodCat1[1]).toHaveProperty("count", 2);
        expect(prodCat1[2]).toHaveProperty("count", 4);

        const prodCat2 = products
            .asQueryable()
            .groupBy((p) => p.category)
            .toArray();

        expect(prodCat2).toHaveLength(3);
        expect(prodCat2[2]).toHaveProperty("key", "Cat03");
        expect(prodCat2[2]).toHaveLength(4);
    });

    it("groupJoin", () => {
        const details = orders.asQueryable().selectMany((o) => o.details!).toArray();
        const prdCount = [products[0], products[1]].asQueryable().groupJoin(
            details,
            (p) => p.no,
            (d) => d.product,
            (p, ds) => ({ product: p.no, count: ds.length }),
        ).toArray();

        expect(prdCount).toEqual([{ product: "Prd1", count: 2 }, { product: "Prd2", count: 1 }]);
    });

    it("inlineCount", () => {
        const result1 = orders.asQueryable()
            .inlineCount()
            .where((c) => c.id > 2)
            .skip(1)
            .take(2)
            .toArray();
        expect(result1.value).toHaveLength(2);
        expect(result1.inlineCount).toBe(3);

        const result2 = orders.asQueryable().inlineCount().toArray();
        expect(result2.value).toHaveLength(5);
        expect(result2.inlineCount).toBe(orders.length);

        const result3 = orders.asQueryable().inlineCount().any();
        expect(result3.inlineCount).toBe(orders.length);
        expect(result3.value).toBe(true);
    });

    it("intersect", () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 2 }, { id: 3 }, arr1[0]];

        const concat1 = arr1.asQueryable().intersect(arr2).toArray();
        expect(concat1).toHaveLength(1);

        const concat2 = arr1.asQueryable().intersect(arr2, (i1, i2) => i1.id === i2.id).toArray();
        expect(concat2).toHaveLength(2);
    });

    it("join", () => {
        const details = orders[0].details;
        const supCat = details!.asQueryable().join(
            products,
            (d) => d.product,
            (p) => p.no,
            (d, p) => ({ supplier: d.supplier, category: p.category }),
        ).toArray();

        expect(supCat).toEqual([{ supplier: "ABC", category: "Cat01" }, { supplier: "QWE", category: "Cat02" }]);
    });

    it("last", () => {
        const idx = products.length - 1;
        expect(products.asQueryable().last()).toBe(products[idx]);
        expect(products.asQueryable().last((p) => p.no === products[idx].no)).toBe(products[idx]);

        expect(() => [].asQueryable().last()).toThrow();
        expect(() => products.asQueryable().last((p) => p.category === "None")).toThrow();
    });

    it("lastOrDefault", () => {
        expect([].asQueryable().lastOrDefault()).toBe(null);
        expect(products.asQueryable().lastOrDefault((p) => p.category === "None")).toBe(null);
    });

    it("max", () => {
        expect([2, 1, 3, 4].asQueryable().max()).toBe(4);
        expect(products.asQueryable().max((p) => p.no)).toBe("Prd9");
    });

    it("min", () => {
        expect([2, 1, 3, 4].asQueryable().min()).toBe(1);
        expect(products.asQueryable().min((p) => p.no)).toBe("Prd1");
    });

    it("ofGuardedType", () => {
        // type guard
        function isProduct(item): item is IProduct {
            return item && item.category != null;
        }

        const orderProducts = (orders as any).concat(products);
        const products2 = orderProducts.asQueryable().ofGuardedType(isProduct).toArray();

        expect(products).toEqual(products2);
    });

    it("ofType", () => {
        // primitive test
        const o1 = new Order(1, "1", 1, new Date(), null, []);
        const o2 = new Order(2, "2", 2, new Date(), null, []);
        const items = ["1", 2, "a3", o1, 4, false, "5", o2];

        const numbers1 = (items as any[]).asQueryable().ofType(Number).toArray();
        expect(numbers1).toEqual([2, 4]);
        const numbers2 = items.asQueryable().ofType(0).toArray();
        expect(numbers2).toEqual([2, 4]);

        const strings1 = (items as any[]).asQueryable().ofType(String).toArray();
        expect(strings1).toEqual(["1", "a3", "5"]);
        const strings2 = items.asQueryable().ofType("").toArray();
        expect(strings2).toEqual(["1", "a3", "5"]);

        expect(() => items.asQueryable().ofType(null as any)).toThrow();

        // object test
        const classOrders = orders.asQueryable().ofType<Order>(Order).toArray();
        expect(classOrders).toEqual([orders[0], orders[2], orders[4]]);

        expect(items.asQueryable().ofType(Order).toArray()).toEqual([o1, o2]);
        expect(items.asQueryable().ofType(o1).toArray()).toEqual([o1, o2]);
    });

    it("orderBy, orderByDescending, thenBy, thenByDescending", () => {
        const sortedDetails1 = orders[4].details!.asQueryable()
            .orderBy((d) => d.supplier)
            .thenByDescending((d) => d.count)
            .toArray();

        expect(sortedDetails1[0]).toHaveProperty("count", 67);
        expect(sortedDetails1[1]).toHaveProperty("count", 13);
        expect(sortedDetails1[2]).toHaveProperty("count", 86);

        const sortedDetails2 = orders[4].details!.asQueryable()
            .orderByDescending((d) => d.supplier)
            .thenBy((d) => d.count)
            .toArray();

        expect(sortedDetails2[0]).toHaveProperty("count", 8);
        expect(sortedDetails2[1]).toHaveProperty("count", 4);
        expect(sortedDetails2[2]).toHaveProperty("count", 34);
    });

    it("reverse", () => {
        const arr = [1, 2, 1, 3, 3, 2, 1, 3];
        const rev1 = arr.asQueryable().reverse().toArray();
        const rev2 = arr.splice(0, 0).reverse();

        expect(rev1).toEqual(rev2);
    });

    it("select", () => {
        const ids = orders.asQueryable().select((o) => o.id).toArray();
        expect(ids).toEqual([1, 2, 3, 4, 5]);

        const token = "abc";
        const idNo = orders.asQueryable().select((o) => ({ id: o.id, no: o.no, token }), { token }).toArray();
        expect(idNo).toEqual([
            { id: 1, no: "Ord1", token: "abc" },
            { id: 2, no: "Ord2", token: "abc" },
            { id: 3, no: "Ord3", token: "abc" },
            { id: 4, no: "Ord4", token: "abc" },
            { id: 5, no: "Ord5", token: "abc" },
        ]);

        const no = orders.asQueryable().select((o) => ({ no: o.no }), OrderNo).toArray();
        no.forEach((n) => expect(n).toBeInstanceOf(OrderNo));
    });

    it("selectMany", () => {
        const details = orders.asQueryable().selectMany((o) => o.details!).toArray();
        expect(details.length).toBe(16);
    });

    it("sequenceEqual", () => {
        expect([1, 2, 3, 4].asQueryable().sequenceEqual([1, 2, 3, 4])).toBe(true);
        expect([1, 2, 3, 4, 5].asQueryable().sequenceEqual([1, 2, 3, 4])).toBe(false);
        expect([1, 2, 3, 4].asQueryable().sequenceEqual([1, 2, 3, 4, 5])).toBe(false);

        expect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            .asQueryable()
            .sequenceEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], (i1, i2) => i1.id === i2.id),
        ).toBe(true);
    });

    it("single", () => {
        expect([42].asQueryable().single()).toBe(42);
        expect(products.asQueryable().single((p) => p.no === products[3].no)).toBe(products[3]);

        expect(() => products.asQueryable().single()).toThrow();
        expect(() => products.asQueryable().take(0).single()).toThrow();
        expect(() => products.asQueryable().single((p) => p.category !== "None")).toThrow();
        expect(() => products.asQueryable().single((p) => p.category === "None")).toThrow();
    });

    it("singleOrDefault", () => {
        expect([].asQueryable().singleOrDefault()).toBe(null);
        expect(products.asQueryable().singleOrDefault((p) => p.category === "None")).toBe(null);

        expect(() => products.asQueryable().singleOrDefault()).toThrow();
        expect(() => products.asQueryable().singleOrDefault((p) => p.category !== "None")).toThrow();
    });

    it("skip", () => {
        const skipThree = orders.asQueryable().skip(3).toArray();

        expect(skipThree).toHaveLength(2);
        expect(skipThree[0]).toHaveProperty("id", 4);
        expect(skipThree[1]).toHaveProperty("id", 5);
    });

    it("skipWhile", () => {
        const biggerTwo = orders.asQueryable().skipWhile((o) => o.id < 3).toArray();

        expect(biggerTwo).toHaveLength(3);
        expect(biggerTwo[0]).toHaveProperty("id", 3);
        expect(biggerTwo[1]).toHaveProperty("id", 4);
        expect(biggerTwo[2]).toHaveProperty("id", 5);
    });

    it("sum", () => {
        expect([1, 2, 3, 4].asQueryable().sum()).toBe(10);
        expect(orders.asQueryable().sum((o) => o.id)).toBe(15);
    });

    it("take", () => {
        const firstThree = orders.asQueryable().take(3).toArray();

        expect(firstThree).toHaveLength(3);
        expect(firstThree[0]).toHaveProperty("id", 1);
        expect(firstThree[1]).toHaveProperty("id", 2);
        expect(firstThree[2]).toHaveProperty("id", 3);
    });

    it("takeWhile", () => {
        const firstTwo = orders.asQueryable().takeWhile((o) => o.id < 3).toArray();

        expect(firstTwo).toHaveLength(2);
        expect(firstTwo[0]).toHaveProperty("id", 1);
        expect(firstTwo[1]).toHaveProperty("id", 2);
    });

    it("union", () => {
        const arr1 = [{ id: 1 }, { id: 2 }, { id: 1 }];
        const arr2 = [{ id: 2 }, { id: 3 }, arr1[0]];

        const union1 = arr1.asQueryable().union(arr2).toArray();
        expect(union1).toHaveLength(5);

        const union2 = arr1.asQueryable().union(arr2, (i1, i2) => i1.id === i2.id).toArray();
        expect(union2).toHaveLength(3);
    });

    it("where", () => {
        const result1 = orders.asQueryable().where((c) => c.id > 3).toArray();
        expect(result1).toHaveLength(2);
        expect(result1[0].id).toBe(4);
        expect(result1[1].no).toBe("Ord5");

        const details = orders.asQueryable().selectMany((o) => o.details!).toArray();
        const result2 = details.asQueryable()
            .where((d) => (d.count > 20 && d.supplier !== "QWE") || (d.count < 10 && d.supplier === "TYU"))
            .toArray();
        expect(result2).toHaveLength(8);
        expect(result2[0].count).toBe(63);
        expect(result2[1].product).toBe("Prd4");
        expect(result2[2].supplier).toBe("ABC");
    });

    it("zip", () => {
        const arr1 = [{ id: 1 }, { id: 2 }];
        const arr2 = [{ id: 3 }, { id: 4 }];
        const arr3 = [{ id: 5 }];

        const zip1 = arr1.asQueryable().zip(arr2, (i1, i2) => i1.id + i2.id).toArray();
        expect(zip1).toEqual([4, 6]);

        const zip2 = arr1.asQueryable().zip(arr3, (i1, i2) => i1.id + i2.id).toArray();
        expect(zip2).toEqual([6]);
    });
});
