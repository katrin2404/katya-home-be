import { errorResponse, formatJSONResponse } from '@libs/api-gateway';
import { SQSEvent } from 'aws-lambda';
import { SQSRecord } from 'aws-lambda/trigger/sqs';
import { writeProductItem } from '../../database/dynamoDB';
import * as console from 'console';
import { Product } from '../../types/product';

const { SNS } = require('aws-sdk');
const sns = new SNS();

export const createProducts = async (records: SQSRecord[]) => {
    let numberOfUploadedProducts = 0;
    for (let record of records) {
        const products = JSON.parse(record.body);
        for(let product of products) {
            const response = await writeProductItem(product);

            if (response.isError) {
                console.log(response.error);
            } {
                numberOfUploadedProducts = numberOfUploadedProducts + 1;
                await iterateSQSMessage(product);
            }
        }
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
        console.log('event.Records: ', event.Records);
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
