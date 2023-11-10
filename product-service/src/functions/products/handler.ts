import { middyfy } from '@libs/lambda';
import { getProductById } from '@functions/products/getProductById';
import { getProducts } from '@functions/products/getProducts';
import { migrateProducts, migrateStocks } from '@functions/products/migration';
import { createProduct } from '@functions/products/createProduct';
import { createBatchOfProducts } from '@functions/products/catalogBatchProcess';

export const middyfiedProducts = middyfy(getProducts);
export const middyfiedProductById = middyfy(getProductById);
export const middyfiedMigrateProducts = middyfy(migrateProducts);
export const middyfiedMigrateStocks = middyfy(migrateStocks);
export const middyfiedCreateProduct = middyfy(createProduct);
export const catalogBatchProcess = createBatchOfProducts;
