import { importProductsFile } from './handler';
import * as console from 'console';

const SIGNED_URL = 'https://s3.bucket/import';
const FILE_NAME = 'test.csv';

jest.mock('aws-sdk', () => {
    return {
        S3: class {
            async getSignedUrlPromise() {
                return `${SIGNED_URL}?name=${FILE_NAME}`;
            }
        }
    }
});

describe('importProductFile lambda function', () => {
    let event, mockContext, mockCallback;

    beforeEach(() => {
        event = {
            queryStringParameters: {
                name: FILE_NAME
            },
        };
        mockContext = {};
        mockCallback = jest.fn();
    });

    test('return signedURL', async () => {
        const result = await importProductsFile(event, mockContext, mockCallback);
        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify({
                signedURL: `${SIGNED_URL}?name=${FILE_NAME}`
            })
        };
        console.log(expectedResult.body);

        expect(JSON.parse(result['body'])).toEqual(JSON.parse(expectedResult.body));
        expect(result['statusCode']).toBe(expectedResult.statusCode);
    });

})