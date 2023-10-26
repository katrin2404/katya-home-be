import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { errorResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
import * as process from 'process';
import schema from './schema';
import { PUT_OPERATION } from '../../constants';

const s3 = new S3({ region: process.env.REGION });
export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${process.env.UPLOADED_FILES_FOLDER}/${event.queryStringParameters.name}`,
      Expires: 60,
      ContentType: 'text/csv'
    };
    const signedURL = await s3.getSignedUrlPromise(PUT_OPERATION, params);

    return formatJSONResponse({
      signedURL
    });
  }
  catch ( err ) {
    return errorResponse( err );
  }
};

export const main = middyfy(importProductsFile);
