import type { AWS } from '@serverless/typescript';
import {
    getProducts,
    getProductById,
    migrateProductsToDB,
    migrateStocksToDB,
    createProduct, catalogBatchProcess
} from '@functions/products';
import { PRODUCTS_TABLE_NAME, REGION, STOCKS_TABLE_NAME } from './src/constants';
import catalogItemsQueue from './src/resources/catalogItemsQueue';
import createProductTopic from './src/resources/createProductTopic';
import subscribers from './src/resources/subscribers';

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
            CREATE_PRODUCT_TOPIC: {
                Ref: 'createProductTopic'
            },
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: [
                            'dynamodb:DescribeTable',
                            'dynamodb:Query',
                            'dynamodb:Scan',
                            'dynamodb:GetItem',
                            'dynamodb:PutItem',
                            'dynamodb:UpdateItem',
                            'dynamodb:DeleteItem'
                        ],
                        Resource: 'arn:aws:dynamodb:eu-west-1:*:*'
                    },
                    {
                        Effect: 'Allow',
                        Action: ['sns:Publish'],
                        Resource: 'arn:aws:sns:eu-west-1:*:createProductTopic'
                    }
                ]
            }
        }
    },
    resources: {
        Resources: {
            catalogItemsQueue,
            createProductTopic,
            subscribers
        }
    },
    functions: {
        getProducts,
        getProductById,
        migrateProductsToDB,
        migrateStocksToDB,
        createProduct,
        catalogBatchProcess
    },
    package: {individually: true},
    custom: {
        autoswagger: {
            typefiles: ['./src/types/product.d.ts'],
            host: 'n2j4t1iqxh.execute-api.eu-west-1.amazonaws.com/dev',
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
