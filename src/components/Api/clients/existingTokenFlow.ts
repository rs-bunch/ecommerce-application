import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ClientBuilder, ExistingTokenMiddlewareOptions } from '@commercetools/sdk-client-v2';

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || '';
const CLIENT_SECRET = process.env.CTP_CLIENT_SECRET || '';

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
