import { APIGatewayAuthorizerResult } from 'aws-lambda';

export enum Effect {
  Allow = 'Allow',
  Deny = 'Deny',
}

export const generatePolicy = (
    principalId: string,
    resource: string,
    effect: Effect
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
