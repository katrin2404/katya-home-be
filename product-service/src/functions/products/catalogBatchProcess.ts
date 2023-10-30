import { errorResponse, formatJSONResponse } from '@libs/api-gateway';
import { SQSEvent } from 'aws-lambda';
import { SQSRecord } from 'aws-lambda/trigger/sqs';
import { writeProductItem } from '../../database/dynamoDB';
import * as console from 'console';
import { Product } from '../../types/product';

const { SNS } = require('aws-sdk');
const sns = new SNS();

export const createProducts = async (records: SQSRecord[]) => {
    let numberOfUploadedProducts;
    for (let record of records) {
        const products = JSON.parse(record.body);
        const creatingProductQueue = products.map(product => {
            numberOfUploadedProducts = numberOfUploadedProducts + 1;
            return {
                iterateSQSMessage: iterateSQSMessage(product),
                writeProductItem: writeProductItem(product)
            };
        });
        await Promise.all(creatingProductQueue.map(item => writeProductItem(item)));
        await Promise.all(creatingProductQueue.map(item => iterateSQSMessage(item)));
    }

    return numberOfUploadedProducts;
};

const iterateSQSMessage = async (product: Product) => {
    await sns.publish({
        TopicArn: process.env.CREATE_PRODUCT_TOPIC,
        Message: `${product.count} of ${product.title} were uploaded`,
        Subject: 'Hello Katya',
        MessageAttributes: {
            count: {
                DataType: 'String',
                StringValue: product.count,
            },
        },
    }).promise();
}

export const createBatchOfProducts = async (event: SQSEvent) => {
    try {
        const numberOfUploadedProducts = await createProducts(event.Records);
        return formatJSONResponse({
            message: `${numberOfUploadedProducts} products have been uploaded`
        }, 204);
    }
    catch ( err ) {
        console.log('createBatchOfProducts_ERROR: ', err);
        return errorResponse( err );
    }
};
