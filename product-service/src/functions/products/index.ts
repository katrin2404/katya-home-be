import { handlerPath } from '@libs/handler-resolver';
import { createProductSchema } from '../../schemas/createProductSchema';

export const getProducts =  {
  handler: `${handlerPath(__dirname)}/handler.middyfiedProducts`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        responses: {
          200: {
            description: 'Successful API Response',
            bodyType: 'ProductsListRes',
          },
        },
        cors: true
      },
    },
  ]
};

export const getProductById =  {
  handler: `${handlerPath(__dirname)}/handler.middyfiedProductById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        request: { parameters: { paths: { productId: true }}},
        responses: {
          200: {
            description: 'Successful API Response',
            bodyType: 'Product',
          },
        },
      },
    },
  ],
};

export const createProduct =  {
  handler: `${handlerPath(__dirname)}/handler.middyfiedCreateProduct`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        bodyType: 'ProductPayload',
        request: {
          schemas: {
            'application/json': createProductSchema
          }
        },
        responses: {
          200: {
            description: 'Product created',
            bodyType: 'ProductCreationRes',
          },
        },
      },
    },
  ],
};

export const migrateProductsToDB =  {
  handler: `${handlerPath(__dirname)}/handler.middyfiedMigrateProducts`,
  events: [
    {
      http: {
        method: 'get',
        path: 'migrate-products',
        cors: true,
        responses: {
          200: {
            description: 'Successful API Response'
          },
        },
      },
    },
  ],
};

export const migrateStocksToDB =  {
  handler: `${handlerPath(__dirname)}/handler.middyfiedMigrateStocks`,
  events: [
    {
      http: {
        method: 'get',
        path: 'migrate-stocks',
        cors: true,
        responses: {
          200: {
            description: 'Successful API Response'
          },
        },
      },
    },
  ],
};
