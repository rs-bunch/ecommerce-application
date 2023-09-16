import { CustomerToken, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import {
  Client,
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  ExistingTokenMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || '';
const CLIENT_SECRET = process.env.CTP_CLIENT_SECRET || '';
const CLIENT_ID = process.env.CTP_CLIENT_ID || '';
const AUTH_URL = process.env.CTP_AUTH_URL || '';
const API_URL = process.env.CTP_API_URL || '';
const SCOPES = process.env.CTP_SCOPES || '';

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: API_URL,
  fetch,
};

const authorization: string = CLIENT_SECRET;

const existingTokenFlowApiRoot = (): ByProjectKeyRequestBuilder => {
  const options: ExistingTokenMiddlewareOptions = {
    force: true,
  };

  const ctpClientExistingTokenFlow = new ClientBuilder().withExistingTokenFlow(authorization, options).build();

  const apiRoot = createApiBuilderFromCtpClient(ctpClientExistingTokenFlow).withProjectKey({ projectKey: PROJECT_KEY });

  return apiRoot;
};

export { existingTokenFlowApiRoot };

// const ctpClientCredentialFlow = getCredentialFlowCtpClient();
// const apiRoot = createApiBuilderFromCtpClient(ctpClientCredentialFlow).withProjectKey({ projectKey: PROJECT_KEY });
