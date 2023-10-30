const catalogItemsQueue = {
        Type: 'AWS::SQS::Queue',
        Properties: {
            QueueName: 'catalogItemsQueue',
            ReceiveMessageWaitTimeSeconds: 5
        }
};

export default catalogItemsQueue;