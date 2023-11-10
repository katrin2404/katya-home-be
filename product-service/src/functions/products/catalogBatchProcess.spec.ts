import { APIGatewayProxyResult } from 'aws-lambda';
import * as createProductService from './catalogBatchProcess';
import { createBatchOfProducts } from './catalogBatchProcess';

describe('createBatchOfProducts', () => {
    let event;
    const NUMBER_OF_UPLOADED_PRODUCTS = 5;

    beforeEach(() => {
        jest.spyOn(createProductService, 'createProducts').mockReturnValue(Promise.resolve(NUMBER_OF_UPLOADED_PRODUCTS));
        event = {};
    });

    it('should return number of uploaded products', async () => {
        const response = await createBatchOfProducts(event);

        expect((response as APIGatewayProxyResult).body).toEqual(JSON.stringify({
            message: `${NUMBER_OF_UPLOADED_PRODUCTS} products have been uploaded`,
        }));
    });
});
