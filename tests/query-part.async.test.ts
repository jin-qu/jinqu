import "../index";
import { orders, products } from "./fixture";

describe("Jinqu should be able to asynchronously execute", () => {

    it("aggregate", () => {
        expect([1, 2, 3, 4].asQueryable().aggregateAsync((seed, value) => seed + value)).resolves.toBe(10);
        expect([1, 2, 3, 4].asQueryable().aggregateAsync((seed, value) => seed + value, 32)).resolves.toBe(42);
    });

    it("all", () => {
        expect([1, 2, 3, 4].asQueryable().allAsync(i => i > 0)).resolves.toBe(true);
        expect([1, 2, 3, 4].asQueryable().anyAsync(i => i > 4)).resolves.toBe(false);

        expect(products.asQueryable().allAsync(p => p.category !== null)).resolves.toBe(true);
        expect(products.asQueryable().allAsync(p => p.name === "None")).resolves.toBe(false);
    });

    it("any", () => {
        expect([1, 2, 3, 4].asQueryable().anyAsync()).resolves.toBe(true);
        expect([1, 2, 3, 4].asQueryable().anyAsync(i => i > 3)).resolves.toBe(true);
        expect([1, 2, 3, 4].asQueryable().anyAsync(i => i > 4)).resolves.toBe(false);

        expect(products.asQueryable().anyAsync(p => p.name === products[4].name)).resolves.toBe(true);
        expect(products.asQueryable().anyAsync(p => p.name === "None")).resolves.toBe(false);
    });

    it("average", () => {
        expect([1, 2, 3, 4].asQueryable().averageAsync()).resolves.toEqual(2.5);
        expect(orders.asQueryable().averageAsync(o => o.id)).resolves.toBe(3);
        expect([].asQueryable().averageAsync()).resolves.toBe(0);
    });

    it("contains", () => {
        const arr = [1, 2, 1, 3, 3, 2, 1, 3];
        expect(arr.asQueryable().containsAsync(arr[3])).resolves.toBe(true);
        expect(arr.asQueryable().containsAsync(5)).resolves.toBe(false);

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
        expect(items.asQueryable().containsAsync({ id: 3 } as never, (i1, i2) => i1.id === i2.id)).resolves.toBe(true);
    });

    it("count", () => {
        expect([1, 2, 3, 4].asQueryable().countAsync()).resolves.toBe(4);
        expect([1, 2, 3, 4].asQueryable().countAsync(i => i > 2)).resolves.toBe(2);
    });

    it("elementAt", () => {
        expect(products.asQueryable().elementAtAsync(3)).resolves.toBe(products[3]);
        // expect(products.asQueryable().elementAtAsync(products.length)).rejects;
    });

    it("elementAtOrDefault", () => {
        expect(products.asQueryable().elementAtOrDefaultAsync(3)).resolves.toBe(products[3]);
        expect(products.asQueryable().elementAtOrDefaultAsync(33)).resolves.toBe(null);
    });

    it("first", () => {
        expect(products.asQueryable().firstAsync()).resolves.toBe(products[0]);
        expect(products.asQueryable().firstAsync(p => p.no === products[3].no)).resolves.toBe(products[3]);
    });

    it("firstOrDefault", () => {
        expect(products.asQueryable().firstOrDefaultAsync()).resolves.toBe(products[0]);
        expect([].asQueryable().firstOrDefaultAsync()).resolves.toBe(null);
        expect(products.asQueryable().firstOrDefaultAsync(p => p.no === products[2].no))
            .resolves.toBe(products[2]);
        expect(products.asQueryable().firstOrDefaultAsync(p => p.category === "None")).resolves.toBe(null);
    });

    it("last", () => {
        const idx = products.length - 1;
        expect(products.asQueryable().lastAsync()).resolves.toBe(products[idx]);
        expect(products.asQueryable().lastAsync(p => p.no === products[idx].no)).resolves.toBe(products[idx]);

        expect([].asQueryable().lastAsync()).rejects.not.toEqual(null);
        expect(products.asQueryable().lastAsync(p => p.category === "None")).rejects.not.toEqual(null);
    });

    it("lastOrDefault", () => {
        expect([].asQueryable().lastOrDefaultAsync()).resolves.toBe(null);
        expect(products.asQueryable().lastOrDefaultAsync(p => p.category === "None")).resolves.toBe(null);
    });

    it("max", () => {
        expect([2, 1, 3, 4].asQueryable().maxAsync()).resolves.toBe(4);
        expect(products.asQueryable().maxAsync(p => p.no)).resolves.toBe("Prd9");
    });

    it("min", () => {
        expect([2, 1, 3, 4].asQueryable().minAsync()).resolves.toBe(1);
        expect(products.asQueryable().minAsync(p => p.no)).resolves.toBe("Prd1");
    });

    it("sequenceEqual", () => {
        expect([1, 2, 3, 4].asQueryable().sequenceEqualAsync([1, 2, 3, 4])).resolves.toBe(true);
        expect([1, 2, 3, 4, 5].asQueryable().sequenceEqualAsync([1, 2, 3, 4])).resolves.toBe(false);
        expect([1, 2, 3, 4].asQueryable().sequenceEqualAsync([1, 2, 3, 4, 5])).resolves.toBe(false);

        expect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            .asQueryable()
            .sequenceEqualAsync([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], (i1, i2) => i1.id === i2.id),
        ).resolves.toBe(true);
    });

    it("single", () => {
        expect([42].asQueryable().singleAsync()).resolves.toBe(42);
        expect(products.asQueryable().singleAsync(p => p.no === products[3].no)).resolves.toBe(products[3]);

        expect(products.asQueryable().singleAsync()).rejects.not.toEqual(null);
        expect(products.asQueryable().take(0).singleAsync()).rejects.not.toEqual(null);
        expect(products.asQueryable().singleAsync(p => p.category !== "None")).rejects.not.toEqual(null);
        expect(products.asQueryable().singleAsync(p => p.category === "None")).rejects.not.toEqual(null);
    });

    it("singleOrDefault", () => {
        expect([].asQueryable().singleOrDefaultAsync()).resolves.toBe(null);
        expect(products.asQueryable().singleOrDefaultAsync(p => p.category === "None")).resolves.toBe(null);

        expect(products.asQueryable().singleOrDefaultAsync()).rejects.not.toEqual(null);
        expect(products.asQueryable().singleOrDefaultAsync(p => p.category !== "None")).rejects.not.toEqual(null);
    });

    it("sum", () => {
        expect([1, 2, 3, 4].asQueryable().sumAsync()).resolves.toBe(10);
        expect(orders.asQueryable().sumAsync(o => o.id)).resolves.toBe(15);
    });

    it("toArray", async () => {
        const result = await orders.asQueryable().where(c => c.id > 3).toArrayAsync();
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(4);
        expect(result[1].no).toBe("Ord5");
    });
});
