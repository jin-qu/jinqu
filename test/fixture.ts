export class Order implements IOrder {

    constructor(public id: number, public no: string, public price: number,
        public date: Date, public customer: Customer, public details: IOrderDetail[]) {
    }
}

export interface IOrder {
    id: number;
    no: string;
    price: number;
    customer: Customer;
    date: Date;
    details: IOrderDetail[];
}

export interface IOrderDetail {
    product: string;
    supplier: string;
    count: number;
}

export interface Customer {
    no: string;
}

export interface Product {
    no: string;
    name: string;
    category: string;
}

export const orders: IOrder[] = [
    new Order(1, 'Ord1', 400, new Date("2013/8/6 12:34:56"), { no: 'Cus4' }, [
        {
            product: 'Prd1',
            supplier: 'ABC',
            count: 4
        },
        {
            product: 'Prd5',
            supplier: 'QWE',
            count: 23
        }
    ]),
    {
        id: 2,
        no: 'Ord2',
        price: 750.42,
        date: new Date("2014/3/30 23:45:01"),
        customer: { no: 'Cus9' },
        details: [
            {
                product: 'Prd3',
                supplier: 'FGH',
                count: 5
            },
            {
                product: 'Prd8',
                supplier: 'QWE',
                count: 1
            },
            {
                product: 'Prd9',
                supplier: 'QWE',
                count: 36
            }
        ]
    },
    new Order(3, 'Ord3', 1125, new Date("2012/11/10 8:10:25"), { no: 'Cus3' }, [
        {
            product: 'Prd2',
            supplier: 'FGH',
            count: 63
        },
        {
            product: 'Prd4',
            supplier: 'TYU',
            count: 5
        },
        {
            product: 'Prd6',
            supplier: 'FGH',
            count: 18
        },
        {
            product: 'Prd9',
            supplier: 'ABC',
            count: 22
        }
    ]),
    {
        id: 4,
        no: 'Ord4',
        price: 231.58,
        date: new Date("2011/5/1"),
        customer: { no: 'Cus1' },
        details: [
            {
                product: 'Prd7',
                supplier: 'TYU',
                count: 4
            }
        ]
    },
    new Order(5, 'Ord5', 1125, new Date("2010/1/28 14:42:33"), { no: 'Cus3' }, [
        {
            product: 'Prd1',
            supplier: 'QWE',
            count: 4
        },
        {
            product: 'Prd5',
            supplier: 'BNM',
            count: 67
        },
        {
            product: 'Prd6',
            supplier: 'BNM  ',
            count: 13
        },
        {
            product: 'Prd7',
            supplier: 'TYU',
            count: 8
        },
        {
            product: 'Prd8',
            supplier: 'FGH',
            count: 34
        },
        {
            product: 'Prd9',
            supplier: 'FGH',
            count: 86
        }
    ])
];

export const products: Product[] = [
    {
        no: 'Prd1',
        name: 'Product 01',
        category: 'Cat01'
    },
    {
        no: 'Prd2',
        name: 'Product 02',
        category: 'Cat01'
    },
    {
        no: 'Prd3',
        name: 'Product 03',
        category: 'Cat01'
    },
    {
        no: 'Prd4',
        name: 'Product 04',
        category: 'Cat02'
    },
    {
        no: 'Prd5',
        name: 'Product 05',
        category: 'Cat02'
    },
    {
        no: 'Prd6',
        name: 'Product 06',
        category: 'Cat03'
    },
    {
        no: 'Prd7',
        name: 'Product 07',
        category: 'Cat03'
    },
    {
        no: 'Prd8',
        name: 'Product 08',
        category: 'Cat03'
    },
    {
        no: 'Prd9',
        name: 'Product 09',
        category: 'Cat03'
    },
];