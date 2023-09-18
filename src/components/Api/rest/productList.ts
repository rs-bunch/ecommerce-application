import type { ClientResponse, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { apiRoot } from '../apiRoot';
import { getCategoriesById } from './product';
import { CategoiesPathData } from '../../../dto/types';
import { PAGE_SIZE } from '../../../dto/constants';

// Request Flow: request -> execute -> then -> catch
// Examples: https://docs.commercetools.com/sdk/sdk-example-code
// Customers: https://docs.commercetools.com/api/projects/customers#create-sign-up-customer

// type CategoryProductListFunc = () => Promise<ClientResponse<ProductProjectionPagedSearchResponse>>;

const getCategoryProductList = (
  categoryId: string,
  page: number
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  console.log('products fetch');
  return apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: { filter: `${categoryId}`, limit: PAGE_SIZE, offset: page * PAGE_SIZE } })
    .execute();
};

const getSortedCategoryProductList = (
  categoryId: string,
  criteria: string,
  page: number
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: { filter: `${categoryId}`, sort: criteria, limit: PAGE_SIZE, offset: page * PAGE_SIZE } })
    .execute();
};

const getFilteredCategoryProductList = (
  categoryId: string,
  criteria: string[],
  page: number
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: { filter: [`${categoryId}`, ...criteria], limit: PAGE_SIZE, offset: page * PAGE_SIZE } })
    .execute();
};

const getFilteredSortedCategoryProductList = (
  categoryId: string,
  filter: string[],
  sort: string,
  page: number
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: { filter: [`${categoryId}`, ...filter], sort, limit: PAGE_SIZE, offset: page * PAGE_SIZE } })
    .execute();
};

// const getSearchProductList = (
//   categoryId: string,
//   text: string
// ): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
//   console.log('search');
//   return apiRoot
//     .productProjections()
//     .search()
//     .get({ queryArgs: { filter: categoryId, 'text.en-US': text, fuzzy: true, staged: true } })
//     .execute();
// };

const getSearchProductListTotal = (
  text: string,
  page: number
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: { 'text.en-US': text, fuzzy: true, staged: true, limit: PAGE_SIZE, offset: page * PAGE_SIZE } })
    .execute();
};

const getSortedProductList = (
  text: string,
  criteria: string,
  page: number
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        sort: criteria,
        'text.en-US': text,
        fuzzy: true,
        staged: true,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      },
    })
    .execute();
};

const getFilteredProductList = (
  text: string,
  criteria: string[],
  page: number
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        'text.en-US': text,
        fuzzy: true,
        staged: true,
        filter: [...criteria],
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      },
    })
    .execute();
};

const getFilteredSortedProductList = (
  text: string,
  filter: string[],
  sort: string,
  page: number
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        'text.en-US': text,
        fuzzy: true,
        staged: true,
        filter: [...filter],
        sort,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      },
    })
    .execute();
};

const getCategoriesPath = async (id: string, LOCALE_STRING: string): Promise<CategoiesPathData> => {
  const path: CategoiesPathData = [];
  const getParentCategory = async (categoryId: string): Promise<void> => {
    const category = (await getCategoriesById(categoryId)).body;
    path.push({ name: category.name[LOCALE_STRING], id: categoryId });
    if (category.parent) await getParentCategory(category.parent.id);
  };
  await getParentCategory(id);
  return path.reverse();
};

// const getMenClothingList = getCategoryProductList('categories.id:subtree("94038ccd-10f8-4ccc-a616-cfa5438bcc9a")');
// const getWomenClothingList = getCategoryProductList('categories.id:subtree("e53f22b1-2fe3-4c30-991b-c7006c0562c1")');
// const getAccessoriesList = getCategoryProductList('categories.id:subtree("7c904e55-c3de-4c8c-814f-e073222b4187")');

export {
  getCategoryProductList,
  getSortedCategoryProductList,
  getFilteredCategoryProductList,
  getFilteredSortedCategoryProductList,
  // getSearchProductList,
  getCategoriesPath,
  getSearchProductListTotal,
  getSortedProductList,
  getFilteredProductList,
  getFilteredSortedProductList,
};
