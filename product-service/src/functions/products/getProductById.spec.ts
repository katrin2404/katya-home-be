import products from '../../services/products.json';
import { APIGatewayProxyResult } from 'aws-lambda';
import { getProductById } from '@functions/products/getProductById';

describe('getProductById', () => {
    let event, mockContext, mockCallback;

    beforeEach(() => {
        event = {
            pathParameters: {},
        };
        mockContext = {};
        mockCallback = jest.fn();
    });

    it('should return the correct product when found', async () => {
        const product = products[0];
        event.pathParameters.productId = product.id;

        const response = (await getProductById(
            event,
            mockContext,
            mockCallback,
        )) as APIGatewayProxyResult;

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(JSON.stringify({ ...product }));
    });

    it('should return a 404 error when the product is not found', async () => {
        event.pathParameters.productId = 'unknown-id';

        const response = (await getProductById(
            event,
            mockContext,
            mockCallback,
        )) as APIGatewayProxyResult;

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(JSON.stringify({message: 'Product not found!'}));
    });
});
