const subscribers = {
    Type: 'AWS::SNS::Subscription',
    Properties: {
        Protocol: 'email',
        TopicArn: {
            Ref: 'createProductTopic'
        },
        Endpoint: 'sachko.ekaterina@gmail.com'
    }
};

export default subscribers;