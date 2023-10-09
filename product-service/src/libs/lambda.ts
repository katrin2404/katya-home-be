import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import httpUrlEncodePathParser from '@middy/http-urlencode-path-parser';

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(httpUrlEncodePathParser()).use(cors())
}
