import { CustomerToken, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import {
  Client,
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
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

const credentialFlowCtpClientApiRoot = (options?: CustomerToken): ByProjectKeyRequestBuilder => {
  const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: AUTH_URL,
    projectKey: PROJECT_KEY,
    credentials: {
      clientId: options?.id || CLIENT_ID,
      clientSecret: options?.value || CLIENT_SECRET,
    },
    scopes: [SCOPES],
    fetch,
  };

  const ctpClientCredentialFlow = new ClientBuilder()
    .withHttpMiddleware(httpMiddlewareOptions)
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

  const apiRoot = createApiBuilderFromCtpClient(ctpClientCredentialFlow).withProjectKey({ projectKey: PROJECT_KEY });

  return apiRoot;
};

export { credentialFlowCtpClientApiRoot };

// const ctpClientCredentialFlow = getCredentialFlowCtpClient();
// const apiRoot = createApiBuilderFromCtpClient(ctpClientCredentialFlow).withProjectKey({ projectKey: PROJECT_KEY });
