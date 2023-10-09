import { handlerPath } from '@libs/handler-resolver';

export const getProducts =  {
  handler: `${handlerPath(__dirname)}/handler.middyfiedProducts`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true
      },
    },
  ],
};

export const getProductById =  {
  handler: `${handlerPath(__dirname)}/handler.middyfiedProductById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        request: { parameters: { paths: { productId: true }}}
      },
    },
  ],
};
