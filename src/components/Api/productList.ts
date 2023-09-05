import type { ClientResponse, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { apiRoot } from './apiRoot';

// Request Flow: request -> execute -> then -> catch
// Examples: https://docs.commercetools.com/sdk/sdk-example-code
// Customers: https://docs.commercetools.com/api/projects/customers#create-sign-up-customer

// type CategoryProductListFunc = () => Promise<ClientResponse<ProductProjectionPagedSearchResponse>>;

const getCategoryProductList = (categoryId: string): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: { filter: `${categoryId}` } })
    .execute();
};

const getSortedCategoryProductList = (
  categoryId: string,
  criteria: string
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: { filter: `${categoryId}`, sort: criteria } })
    .execute();
};

const getFilteredCategoryProductList = (
  categoryId: string,
  criteria: string[]
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: { filter: [`${categoryId}`, ...criteria] } })
    .execute();
};

const getFilteredSortedCategoryProductList = (
  categoryId: string,
  filter: string[],
  sort: string
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: { filter: [`${categoryId}`, ...filter], sort } })
    .execute();
};

// const getMenClothingList = getCategoryProductList('categories.id:subtree("94038ccd-10f8-4ccc-a616-cfa5438bcc9a")');
// const getWomenClothingList = getCategoryProductList('categories.id:subtree("e53f22b1-2fe3-4c30-991b-c7006c0562c1")');
// const getAccessoriesList = getCategoryProductList('categories.id:subtree("7c904e55-c3de-4c8c-814f-e073222b4187")');

export {
  getCategoryProductList,
  getSortedCategoryProductList,
  getFilteredCategoryProductList,
  getFilteredSortedCategoryProductList,
};
