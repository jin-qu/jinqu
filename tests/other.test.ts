import { ArrayQueryProvider, PartArgument, QueryPart } from "..";
import { Order, orders, Product, products } from "./fixture";

describe("Jinqu should", () => {

    it("filter iterable", () => {
        const provider = new ArrayQueryProvider(orders[Symbol.iterator]());
        const result = provider.createQuery<Order>().where(c => c.id > 3).toArray();
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(4);
        expect(result[1].no).toBe("Ord5");

        expect(orders).toBe(new ArrayQueryProvider(orders).execute(null));
    });

    it("iterate filtered array", () => {
        const query = orders.asQueryable().inlineCount().where(c => c.id > 3);

        let i = 3;
        for (const o of query) {
            expect(o).toBe(orders[i++]);
        }
    });

    it("sort order details when executed explicitly", () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const query = orders[4].details!.asQueryable()
            .orderBy(d => d.supplier)
            .thenByDescending(d => d.count);
        const sortedDetails = Array.from(query.provider.execute<Order[]>(query.parts));

        expect(sortedDetails[0]).toHaveProperty("count", 67);
        expect(sortedDetails[1]).toHaveProperty("count", 13);
        expect(sortedDetails[2]).toHaveProperty("count", 86);
    });

    it("throw for unknown part", () => {
        const query = orders.asQueryable();
        query.parts.push({ type: "42", args: [], scopes: [] });

        expect(() => query.toArray()).toThrow();
    });

    it("throw for null source", () => {
        expect(() => new ArrayQueryProvider(null)).toThrow();
    });

    it("handle literal query part as function", () => {
        const items = [{ id: 1 }, { id: 2 }];
        expect(items.asQueryable().select("id").toArray()).toEqual([1, 2]);
    });

    it("QueryPart and PartArgument work as expected", () => {
        expect(() => new QueryPart("")).toThrow();
        expect(new QueryPart("where")).toHaveProperty("scopes", []);

        const part1 = new PartArgument(null, null, undefined);
        expect(part1.func).toBeNull;
        expect(part1.expStr).toBeNull;
        expect(part1.exp).toBeNull;
        expect(part1.scopes).toBeNull;

        const part2 = new PartArgument(c => c % 2 === 0, null, undefined);
        expect(part2.expStr).not.toBeNull;
    });

    it("fix prototype 1", () => {
        const provider = new ArrayQueryProvider(products);
        const result = provider.createQuery<Product>(void 0, Product).toArray();

        result.forEach(r => expect(r).toBeInstanceOf(Product));
    });

    it("fix prototype 2", () => {
        const result = products.asQueryable(Product).toArray();

        result.forEach(r => expect(r).toBeInstanceOf(Product));
    });

    it("fix prototype 3", () => {
        const result = products.asQueryable().cast(Product).toArray();

        result.forEach(r => expect(r).toBeInstanceOf(Product));
    });

    it("fix prototype 4", () => {
        const result = products.asQueryable().toArray(Product);

        result.forEach(r => expect(r).toBeInstanceOf(Product));
    });

    it("fix prototype 5", async () => {
        const result = await products.asQueryable().toArrayAsync(Product);

        result.forEach(r => expect(r).toBeInstanceOf(Product));
    });
});
