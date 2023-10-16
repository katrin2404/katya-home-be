export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    logo: string;
    count: number;
}

export interface ProductsListRes {
    items: Products;
    total: number;
}

export interface ProductPayload {
    title: string;
    description: string;
    price: number;
    logo: string;
    count: number;
}

export interface ProductCreationRes {
    id: string;
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
