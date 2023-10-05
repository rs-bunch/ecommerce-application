import { Category, ClientResponse, Product } from '@commercetools/platform-sdk';
import { apiRoot } from '../apiRoot';

const getProductDetailsByKey = (key: string): Promise<ClientResponse<Product>> => {
  return apiRoot.products().withKey({ key }).get().execute();
};

const getProductDetailsById = (id: string): Promise<ClientResponse<Product>> => {
  return apiRoot.products().withId({ ID: id }).get().execute();
};

const getCategoriesById = (id: string): Promise<ClientResponse<Category>> => {
  return apiRoot.categories().withId({ ID: id }).get().execute();
};

export { getProductDetailsByKey, getProductDetailsById, getCategoriesById };
