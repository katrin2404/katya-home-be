import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
import { AWS } from '@serverless/typescript';
import { BUCKET_NAME, CATALOG_ITEMS_QUEUE, PARSED_FILES_FOLDER, REGION, UPLOADED_FILES_FOLDER } from './src/constants';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      CATALOG_ITEMS_QUEUE,
      REGION,
      BUCKET_NAME,
      UPLOADED_FILES_FOLDER,
      PARSED_FILES_FOLDER
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:ListBucket'],
            Resource: 'arn:aws:s3:::katya-home-import-products'
          },
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: 'arn:aws:s3:::katya-home-import-products/*'
          }
        ]
      }
    }
  },
  functions: { importProductsFile, importFileParser },
  resources: {
    Resources: {
      s3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'katya-home-import-products',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['Content-Type'],
                AllowedMethods: ['GET', 'PUT'],
                AllowedOrigins: ['*']
              }
            ]
          }
        }
      },
      GatewayResponse: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
