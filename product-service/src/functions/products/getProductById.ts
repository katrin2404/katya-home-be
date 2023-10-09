import { errorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import schema from '@functions/products/schema';
import { Product } from '../../model';
import { getProductById  as getProductByIdService } from '../../services/products';

export const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const { productId = '' } = event.pathParameters;
        const product: Product = getProductByIdService(productId);

        return product ? formatJSONResponse({ ...product }) : formatJSONResponse({message: 'Product not found!!!'}, 404);
    }
    catch ( err ) {
        return errorResponse( err );
    }
};