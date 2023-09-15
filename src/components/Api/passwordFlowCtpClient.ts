import {
  Client,
  ClientBuilder,
  type PasswordAuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  type TokenStore,
} from '@commercetools/sdk-client-v2';
import { AuthPayload } from '../../dto/types';

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
    tokenCache: {
      get: () => {
        return { token: 'string', expirationTime: 0 };
      },
      set: (cache: TokenStore) => {
        // dispatch(updateToken(cache));
        console.log('Token is: ', cache);
      },
    },
    scopes: [SCOPES],
    fetch,
  };

  return new ClientBuilder()
    .withLoggerMiddleware()
    .withPasswordFlow(passwordAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();
};

export { passwordFlowCtpClient };

// const ctpClientCredentialFlow = getCredentialFlowCtpClient();
// const apiRoot = createApiBuilderFromCtpClient(ctpClientCredentialFlow).withProjectKey({ projectKey: PROJECT_KEY });
