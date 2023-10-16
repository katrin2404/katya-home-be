export interface Product extends ProductDB {
    count: number
}
export interface ProductDB {
    id: string;
    title: string;
    description: string;
    price: number;
    logo: string;
}

export interface StockDB {
    product_id: string;
    count: number;
}

export type Products = Product[];
