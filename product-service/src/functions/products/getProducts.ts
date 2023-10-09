import { errorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import schema from '@functions/products/schema';
import { getAllProducts } from '../../services/products';
export const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (_event) => {
    try {
        const products = getAllProducts();

        return formatJSONResponse({
            items: products,
            total: products.length
        });
    }
    catch ( err ) {
        return errorResponse( err );
    }
};
