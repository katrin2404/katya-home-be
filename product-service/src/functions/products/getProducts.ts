import { errorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { PRODUCTS_TABLE_NAME, REGION, STOCKS_TABLE_NAME } from '../../constants';
import { Product, ProductDB, StockDB } from '../../types/product';
import { defaultSchema } from '../../schemas/defaultSchema';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: REGION});

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
        const products = await scanForData(PRODUCTS_TABLE_NAME);
        const stocks = await scanForData(STOCKS_TABLE_NAME);
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
