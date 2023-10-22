import { errorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { v4 as uuidv4 } from 'uuid';
import { PRODUCTS_TABLE_NAME, REGION, STOCKS_TABLE_NAME } from '../../constants';
import { createProductSchema } from '../../schemas/createProductSchema';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: REGION});

const writeProductItem = async (body) => {
    const productId = uuidv4();
    await dynamoDb.transactWrite({
        TransactItems: [
            {
                Put: {
                    Item: {
                        id: productId,
                        title: body.title,
                        price: body.price,
                        description: body.description
                    },
                    TableName: PRODUCTS_TABLE_NAME
                },
            },
            {
                Put: {
                    Item: {
                        product_id: productId,
                        count: body.count
                    },
                    TableName: STOCKS_TABLE_NAME
                },
            }
        ],
    }).promise();

    return productId;
};

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof createProductSchema> = async (event) => {
    try {
        const productId = await writeProductItem(event.body);
        return formatJSONResponse({
            id: productId
        }, 201);
    }
    catch ( err ) {
        return errorResponse( err );
    }
};
