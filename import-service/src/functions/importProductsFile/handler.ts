import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { S3 } from 'aws-sdk';
import { BUCKET_NAME, REGION } from '../../constants';

const s3 = new S3({ region: REGION });
const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${event.queryStringParameters.name}`,
    Expires: 60,
    ContentType: 'text/csv'
  };
  const signedURL = await s3.getSignedUrlPromise('putObject', params);

  return formatJSONResponse({
    signedURL
  });
};

export const main = middyfy(importProductsFile);
