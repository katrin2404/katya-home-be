import { REGION } from '../../constants';
import { errorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import schema from '../../schemas/schema';
import { getAllProducts } from '../../services/products';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({region: REGION});
export const migrateProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (_event) => {
    const products = getAllProducts();
    const migration = products.map(({count, ...productDb}) => populateData(productDb, 'products'));
    await Promise.all(migration);

    return formatJSONResponse({message: 'All products migrated!'}, 201);
};

export const migrateStocks: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (_event) => {
    const products = getAllProducts();
    const migration = products.map(({count, id}) => populateData({product_id: id, count}, 'stocks'));
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