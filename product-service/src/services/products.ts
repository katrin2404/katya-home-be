import { Product } from '../types/product';
import products from './products.json';

export const getProductById = ( id: string ): Product => products.find( product => product.id === id );
export const getAllProducts = (): Product[] => products;
