import { handlerPath } from '@libs/handler-resolver';
import { BUCKET_NAME, UPLOADED_FILES_FOLDER } from '../../constants';
import { AWS } from '@serverless/typescript';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            s3: {
                bucket: BUCKET_NAME,
                event: 's3:ObjectCreated:*',
                rules: [{
                    prefix: `${UPLOADED_FILES_FOLDER}`
                }],
                existing: true
            },
        },
    ],
} as AWS['functions'][''];
