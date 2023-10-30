import { AWS } from '@serverless/typescript';

const dynamoResources: AWS['resources']['Resources'] = {
    products: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: 'products',
            AttributeDefinitions: [{
                AttributeName: 'id',
                AttributeType: 'S'
            }],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            },
            KeySchema: [{
                AttributeName: 'id',
                KeyType: 'HASH'
            }]
        }
    }
};

export default dynamoResources;