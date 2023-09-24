import type { ClientResponse, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { apiRoot } from '../apiRoot';
import { getCategoriesById } from './product';
import { CategoiesPathData } from '../../../dto/types';
import { PAGE_SIZE } from '../../../dto/constants';

const getCategoryProductList = (
  categoryId: string,
  page: number
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
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

export {
  getCategoryProductList,
  getSortedCategoryProductList,
  getFilteredCategoryProductList,
  getFilteredSortedCategoryProductList,
  getCategoriesPath,
  getSearchProductListTotal,
  getSortedProductList,
  getFilteredProductList,
  getFilteredSortedProductList,
};
