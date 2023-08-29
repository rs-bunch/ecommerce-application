import { ClientResponse, Product } from '@commercetools/platform-sdk';
import { apiRoot } from './apiRoot';

const getProductDetails = (key: string): Promise<ClientResponse<Product>> => {
  return apiRoot.products().withKey({ key }).get().execute();
};

export { getProductDetails };
