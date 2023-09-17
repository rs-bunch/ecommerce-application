import { type AuthMiddlewareOptions, type HttpMiddlewareOptions, ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { tokenCache } from './tokenCache/tokenCache';

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || '';
const CLIENT_SECRET = process.env.CTP_CLIENT_SECRET || '';
const CLIENT_ID = process.env.CTP_CLIENT_ID || '';
const AUTH_URL = process.env.CTP_AUTH_URL || '';
const API_URL = process.env.CTP_API_URL || '';
const SCOPES = process.env.CTP_SCOPES || '';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: AUTH_URL,
  projectKey: PROJECT_KEY,
  credentials: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  },
  scopes: [SCOPES],
  fetch,
  tokenCache,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: API_URL,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: PROJECT_KEY });

export { apiRoot };
