import * as productService from '../../services/products';
import { APIGatewayProxyResult } from 'aws-lambda';
import { getProducts } from '@functions/products/getProducts';
import { Product } from '../../types/product';

const PRODUCTS: Product[] = [{
    id: '1',
    description: 'Good cup for coffee',
    count: 10,
    price: 5,
    title: 'Cup',
    logo: 'http://example.com/1.jpg'
},
    {
        id: '2',
        description: 'Good pillow to sleep',
        count: 16,
        price: 9,
        title: 'Pillow',
        logo: 'http://example.com/2.jpg'
    }];

describe('getProducts', () => {
    let event, mockContext, mockCallback;

    beforeEach(() => {
        jest.spyOn(productService, 'getAllProducts').mockReturnValue(PRODUCTS);
        event = {};
        mockContext = {};
        mockCallback = jest.fn();
    });

    it('should return the list of products', async () => {
        const response = await getProducts(event, mockContext, mockCallback);

        expect((response as APIGatewayProxyResult).body).toEqual(JSON.stringify({
            items: PRODUCTS,
            total: PRODUCTS.length
        }));
    });
});