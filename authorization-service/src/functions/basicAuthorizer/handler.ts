import { APIGatewayAuthorizerCallback } from 'aws-lambda';
import { Effect, generatePolicy } from '@libs/generate-policy';

const basicAuthorizer = async (event, _ctx, callback: APIGatewayAuthorizerCallback) => {
  const token = event.authorizationToken.split(' ')[1];

  if (token === 'null') {
    const policy = generatePolicy(null, event.methodArn, Effect.Deny);

    callback(null, policy);
  }

  const [username, password] = Buffer.from(token, 'base64').toString('utf-8').split(':');
  const effect = !process.env[username] || process.env[username] !== password ? Effect.Deny : Effect.Allow;
  const policy = generatePolicy(username, event.methodArn, effect);

  callback(null, policy);
};

export const main = basicAuthorizer;
