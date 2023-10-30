import { errorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { createProductSchema } from '../../schemas/createProductSchema';
import { writeProductItem } from '../../database/dynamoDB';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof createProductSchema> = async (event) => {
    try {
        const productId = await writeProductItem(event.body);
        return formatJSONResponse({
            id: productId
        }, 201);
    }
    catch ( err ) {
        return errorResponse( err );
    }
};
