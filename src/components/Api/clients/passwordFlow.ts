import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  type PasswordAuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  Client,
  ClientBuilder,
  TokenStore,
} from '@commercetools/sdk-client-v2';
import { AuthPayload } from '../../../dto/types';

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

const passwordFlowCtpClient = (options: AuthPayload): Client => {
  const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
    host: AUTH_URL,
    projectKey: PROJECT_KEY,
    credentials: {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      user: {
        username: options.email,
        password: options.password,
      },
    },
    scopes: [SCOPES],
    fetch,
    tokenCache: {
      get: (): TokenStore => {
        return { token: '', expirationTime: 0 };
      },
      set: (cache: TokenStore): void => {
        localStorage.setItem('tokenCache', JSON.stringify(cache));
      },
    },
  };

  return new ClientBuilder()
    .withLoggerMiddleware()
    .withPasswordFlow(passwordAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();
};

const passwordFlowApiRoot = (options: AuthPayload): ByProjectKeyRequestBuilder => {
  return createApiBuilderFromCtpClient(passwordFlowCtpClient(options)).withProjectKey({ projectKey: PROJECT_KEY });
};

export { passwordFlowCtpClient, passwordFlowApiRoot, PROJECT_KEY };
