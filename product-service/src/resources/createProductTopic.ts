const createProductTopic = {
        Type: 'AWS::SNS::Topic',
        Properties: {
            DisplayName: 'Create Product',
            TopicName: 'createProductTopic'
        }
};

export default createProductTopic;