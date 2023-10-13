import { middyfy } from '@libs/lambda';
import { getProductById } from '@functions/products/getProductById';
import { getProducts } from '@functions/products/getProducts';

export const middyfiedProducts = middyfy(getProducts);
export const middyfiedProductById = middyfy(getProductById);
