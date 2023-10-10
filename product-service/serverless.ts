import type { AWS } from '@serverless/typescript';

import { getProducts, getProductById } from '@functions/products';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-auto-swagger', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'eu-west-1',
        stage: 'dev',
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    functions: {getProducts, getProductById},
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
