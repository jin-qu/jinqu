interface Order {
    id: number;
    no: string;
    price: number;
    customer: Customer;
    date: Date;
    details: OrderDetail[];
}

interface OrderDetail {
    product: string;
    supplier: string;
    count: number;
}

interface Customer {
    no: string;
}

export const orders: Order[] = [
    {
        id: 1,
        no: 'Ord1',
        price: 400,
        date: new Date("2013/8/6 12:34:56"),
        customer: { no: 'Cus4' },
        details: [
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
        ]
    },
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
    {
        id: 3,
        no: 'Ord3',
        price: 1125,
        date: new Date("2012/11/10 8:10:25"),
        customer: { no: 'Cus3' },
        details: [
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
        ]
    },
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
    {
        id: 5,
        no: 'Ord5',
        price: 1125,
        date: new Date("2010/1/28 14:42:33"),
        customer: { no: 'Cus3' },
        details: [
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
        ]
    }
];
