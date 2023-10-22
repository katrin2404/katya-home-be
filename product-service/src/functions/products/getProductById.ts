import { errorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { Product, ProductDB, StockDB } from '../../types/product';
import { defaultSchema } from '../../schemas/defaultSchema';
import * as process from 'process';

interface ExpressionAttributeValues {
    [key: string]: string;
}

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});
const ExpressionAttributeKeyMap = {
    product: ':id',
    stock: ':product_id'
};
const KeyConditionExpressionMap = {
    product: `id = ${ExpressionAttributeKeyMap.product}`,
    stock: `product_id = ${ExpressionAttributeKeyMap.stock}`
};
const scanForData = async (tableName: string, keyConditionExpression: string, expressionAttributeValues: ExpressionAttributeValues) => {
    const params = {
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };

    try {
        const result = await dynamoDb.query(params).promise();

        return result.Items[0];
    } catch (error) {
        throw new Error(error);
    }
};

const joinData = (product: ProductDB, stock: StockDB): Product => ({
        ...product,
        count: stock.count || 0
    });


export const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof defaultSchema> = async (event) => {
    try {
        const { productId = '' } = event.pathParameters;
        const product: ProductDB = await scanForData(process.env.DB_NAME_PRODUCTS, KeyConditionExpressionMap.product, {[ExpressionAttributeKeyMap.product]: productId});
        const stock: StockDB = await scanForData(process.env.DB_NAME_STOCK, KeyConditionExpressionMap.stock, {[ExpressionAttributeKeyMap.stock]: productId});
        const joinedResult = joinData(product, stock);

        return joinedResult ? formatJSONResponse({ ...joinedResult }) : formatJSONResponse({message: 'Product not found!'}, 404);
    }
    catch ( err ) {
        return errorResponse( err );
    }
};