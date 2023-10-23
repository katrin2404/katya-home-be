import { errorResponse } from '@libs/api-gateway';
import { S3 } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import * as process from 'process';
import * as console from 'console';

const csv = require('csv-parser');
const s3 = new S3({region: process.env.REGION });
const S3_OBJECT_KEY_SEPARATOR = '/';
const CSV_PARSER_SEPARATOR = ';';
const importFileParser = async (event: S3Event) => {
    try {
        for (let record of event.Records) {
            const [, file] = record.s3.object.key.split(S3_OBJECT_KEY_SEPARATOR);
            const params = {
                Bucket: record.s3.bucket.name,
                Key: record.s3.object.key
            };
            const streamS3Response = s3.getObject(params).createReadStream();
            const data = streamS3Response.pipe(csv({separator: CSV_PARSER_SEPARATOR}));
            const chunks = [];

            for await (const chunk of data) {
                chunks.push(chunk);
            }

            await s3.putObject({
                Bucket: record.s3.bucket.name,
                Body: JSON.stringify(chunks),
                Key: `${process.env.PARSED_FILES_FOLDER}/${file.replace('csv', 'json')}`,
                ContentType: 'application/json'
            }).promise();

            await s3.deleteObject(params).promise();

            console.log(record)

        }

    } catch (err) {
        return errorResponse(err);
    }
};

export const main = importFileParser;
