import { errorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { Product, ProductDB, StockDB } from '../../types/product';
import { defaultSchema } from '../../schemas/defaultSchema';
import * as process from 'process';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});

const scanForData = async (tableName) => {
    const params = {
        TableName: tableName
    };

    try {
        const result = await dynamoDb.scan(params).promise();

        return result.Items;
    } catch (error) {
        throw new Error(error);
    }
};

const joinData = (products: ProductDB[], stocks: StockDB[]): Product[] => {
    return products.map(product => {
        const { count } = stocks.find(item => item.product_id === product.id) || { count: 0 };
        return {
            ...product,
            count
        }
    });
}
export const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof defaultSchema> = async (_event) => {
    try {
        const products = await scanForData(process.env.DB_NAME_PRODUCTS);
        const stocks = await scanForData(process.env.DB_NAME_STOCK);
        const joinedResult = joinData(products, stocks);

        return formatJSONResponse({
            items: joinedResult,
            total: joinedResult.length
        });
    }
    catch ( err ) {
        return errorResponse( err );
    }
};
