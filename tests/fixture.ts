// tslint:disable:max-classes-per-file

export interface IOrder {
    id: number;
    no: string;
    price: number;
    customer?: ICustomer | null;
    date: Date;
    details?: IOrderDetail[] | null;
}

export interface IOrderDetail {
    product: string;
    supplier: string;
    count: number;
}

export interface ICustomer {
    no: string;
}

export interface IProduct {
    no: string;
    name: string;
    category: string;
}

export class Order implements IOrder {

    constructor(public id: number, public no: string, public price: number,
                public date: Date, public customer?: ICustomer | null, public details?: IOrderDetail[] | null) {
    }
}

export class ExtendedOrder extends Order {
}

export class OrderNo {
    public no: string;
}

export class Product implements IProduct {
    public no: string;
    public name: string;
    public category: string;
}

export const orders: IOrder[] = [
    new Order(1, "Ord1", 400, new Date("2013/8/6 12:34:56"), { no: "Cus4" }, [
        {
            count: 4,
            product: "Prd1",
            supplier: "ABC",
        },
        {
            count: 23,
            product: "Prd5",
            supplier: "QWE",
        },
    ]),
    {
        customer: { no: "Cus9" },
        date: new Date("2014/3/30 23:45:01"),
        details: [
            {
                count: 5,
                product: "Prd3",
                supplier: "FGH",
            },
            {
                count: 1,
                product: "Prd8",
                supplier: "QWE",
            },
            {
                count: 36,
                product: "Prd9",
                supplier: "QWE",
            },
        ],
        id: 2,
        no: "Ord2",
        price: 750.42,
    },
    new Order(3, "Ord3", 1125, new Date("2012/11/10 8:10:25"), { no: "Cus3" }, [
        {
            count: 63,
            product: "Prd2",
            supplier: "FGH",
        },
        {
            count: 5,
            product: "Prd4",
            supplier: "TYU",
        },
        {
            count: 18,
            product: "Prd6",
            supplier: "FGH",
        },
        {
            count: 22,
            product: "Prd9",
            supplier: "ABC",
        },
    ]),
    {
        customer: { no: "Cus1" },
        date: new Date("2011/5/1"),
        details: [
            {
                count: 4,
                product: "Prd7",
                supplier: "TYU",
            },
        ],
        id: 4,
        no: "Ord4",
        price: 231.58,
    },
    new Order(5, "Ord5", 1125, new Date("2010/1/28 14:42:33"), { no: "Cus3" }, [
        {
            count: 4,
            product: "Prd1",
            supplier: "QWE",
        },
        {
            count: 67,
            product: "Prd5",
            supplier: "BNM",
        },
        {
            count: 13,
            product: "Prd6",
            supplier: "BNM",
        },
        {
            count: 8,
            product: "Prd7",
            supplier: "TYU",
        },
        {
            count: 34,
            product: "Prd8",
            supplier: "FGH",
        },
        {
            count: 86,
            product: "Prd9",
            supplier: "FGH",
        },
    ]),
];

export const products: IProduct[] = [
    {
        category: "Cat01",
        name: "Product 01",
        no: "Prd1",
    },
    {
        category: "Cat01",
        name: "Product 02",
        no: "Prd2",
    },
    {
        category: "Cat01",
        name: "Product 03",
        no: "Prd3",
    },
    {
        category: "Cat02",
        name: "Product 04",
        no: "Prd4",
    },
    {
        category: "Cat02",
        name: "Product 05",
        no: "Prd5",
    },
    {
        category: "Cat03",
        name: "Product 06",
        no: "Prd6",
    },
    {
        category: "Cat03",
        name: "Product 07",
        no: "Prd7",
    },
    {
        category: "Cat03",
        name: "Product 08",
        no: "Prd8",
    },
    {
        category: "Cat03",
        name: "Product 09",
        no: "Prd9",
    },
];
