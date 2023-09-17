import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder, AnonymousAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { tokenCache } from '../tokenCache/tokenCache';

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || '';
const CLIENT_SECRET = process.env.CTP_CLIENT_SECRET || '';
const CLIENT_ID = process.env.CTP_CLIENT_ID || '';
const AUTH_URL = process.env.CTP_AUTH_URL || '';
const SCOPES = process.env.CTP_SCOPES || '';

const options: AnonymousAuthMiddlewareOptions = {
  host: AUTH_URL,
  projectKey: PROJECT_KEY,
  credentials: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    anonymousId: process.env.CTP_ANONYMOUS_ID,
  },
  scopes: [SCOPES],
  fetch,
  tokenCache,
};

const anonymousSessionFlowCtpClient = new ClientBuilder().withAnonymousSessionFlow(options).build();

const anonymousSessionFlowApiRoot = createApiBuilderFromCtpClient(anonymousSessionFlowCtpClient).withProjectKey({
  projectKey: PROJECT_KEY,
});

export { anonymousSessionFlowCtpClient, anonymousSessionFlowApiRoot };
