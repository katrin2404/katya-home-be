import type { AWS } from '@serverless/typescript';
import {
    getProducts,
    getProductById,
    migrateProductsToDB,
    migrateStocksToDB,
    createProduct
} from '@functions/products';
import { PRODUCTS_TABLE_NAME, REGION, STOCKS_TABLE_NAME } from './src/constants';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-auto-swagger', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: REGION,
        stage: 'dev',
        environment: {
            DB_NAME_PRODUCTS: PRODUCTS_TABLE_NAME,
            DB_NAME_STOCK: STOCKS_TABLE_NAME,
            REGION,
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    functions: { getProducts, getProductById, migrateProductsToDB, migrateStocksToDB, createProduct },
    package: {individually: true},
    custom: {
        autoswagger: {
            typefiles: ['./src/types/product.d.ts'],
            host: 'hsqn69e5k1.execute-api.eu-west-1.amazonaws.com/dev',
        },
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        }
    },
};

module.exports = serverlessConfiguration;
