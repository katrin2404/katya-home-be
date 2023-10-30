import process from 'process';
import { v4 as uuidv4 } from 'uuid';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});

export const writeProductItem = async (body) => {
    const productId = uuidv4();

    await dynamoDb.transactWrite({
        TransactItems: [
            {
                Put: {
                    Item: {
                        id: productId,
                        title: body.title,
                        price: Number(body.price),
                        description: body.description,
                        logo: body?.logo || ''
                    },
                    TableName: process.env.DB_NAME_PRODUCTS
                },
            },
            {
                Put: {
                    Item: {
                        product_id: productId,
                        count: Number(body.count)
                    },
                    TableName: process.env.DB_NAME_STOCK
                },
            }
        ],
    }).promise();

    return productId;
};