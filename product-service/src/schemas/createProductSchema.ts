export const createProductSchema = {
    title: 'Create Product Validation',
    description: 'Payload used to validate create product functionality',
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        price: {
            type: 'integer'
        },
        logo: {
            type: 'string'
        },
        count: {
            type: 'integer'
        }
    },
    required: [
        'title',
        'description',
        'price',
        'count'
    ]
};
