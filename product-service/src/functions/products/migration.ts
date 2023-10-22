import { errorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { getAllProducts } from '../../services/products';
import { defaultSchema } from '../../schemas/defaultSchema';
import * as process from 'process';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});
export const migrateProducts: ValidatedEventAPIGatewayProxyEvent<typeof defaultSchema> = async (_event) => {
    const products = getAllProducts();
    const migration = products.map(({count, ...productDb}) => populateData(productDb, process.env.DB_NAME_PRODUCTS));
    await Promise.all(migration);

    return formatJSONResponse({message: 'All products migrated!'}, 201);
};

export const migrateStocks: ValidatedEventAPIGatewayProxyEvent<typeof defaultSchema> = async (_event) => {
    const products = getAllProducts();
    const migration = products.map(({count, id}) => populateData({product_id: id, count}, process.env.DB_NAME_STOCK));
    await Promise.all(migration);

    return formatJSONResponse({message: 'All data migrated!'}, 201);
};

async function populateData(item, tableName) {
    try {
        return await dynamoDb.put({
            TableName: tableName,
            Item: item
        }).promise();
    } catch (err) {
        return errorResponse( err );
    }
}