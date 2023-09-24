import 'dotenv/config';
import { CustomerPagedQueryResponse } from '@commercetools/platform-sdk';
import { apiRoot } from '../components/Api/apiRoot';
import { getCategoriesById, getProductDetailsById, getProductDetailsByKey } from '../components/Api/rest/product';
import {
  getCategoryProductList,
  getFilteredCategoryProductList,
  getFilteredProductList,
  getFilteredSortedCategoryProductList,
  getFilteredSortedProductList,
  getSearchProductListTotal,
  getSortedCategoryProductList,
  getSortedProductList,
} from '../components/Api/rest/productList';
import LocalStorageMock from './mocks/LocalStorageMock';

const TEST_PAGE = 0;
const TEST_PRODUCT_ID = 'b33865b0-c943-498b-a30e-e8edcd03255b';
const TEST_CATEGORY_ID = '94038ccd-10f8-4ccc-a616-cfa5438bcc9a';
const SORT_TEST_CRITERIA = `price desc`;
const FILTER_TEST_CRITERIA = [`variants.attributes.Size:"M"`, `variants.attributes.Color:"Red"`];
const TEST_SEARCHSTRING = 'jacket';

global.localStorage = new LocalStorageMock();

describe('Testing customer API', () => {
  it('Try to recieve a customer', async () => {
    const customerResponse = (await apiRoot
      .customers()
      .get({
        queryArgs: {
          where: 'email="user@example.com"',
        },
      })
      .execute()
      .then((data) => data.body)
      .catch(console.error)) as CustomerPagedQueryResponse;

    expect(customerResponse.count).toEqual(1);
  });
});
describe('Testing productData API', () => {
  it('Try to recieve a list of products by id', async () => {
    const productData = await getProductDetailsById(TEST_PRODUCT_ID);
    expect(productData.statusCode).toEqual(200);
  });
  it('Try to recieve a list of products by key', async () => {
    const productData = await getProductDetailsByKey('jacket-1');
    expect(productData.statusCode).toEqual(200);
  });
  it('Try to recieve a category data', async () => {
    const categoryData = await getCategoriesById(TEST_CATEGORY_ID);
    expect(categoryData.statusCode).toEqual(200);
  });
});

describe('Testing ProductList API', () => {
  it('Try to recieve a category product list', async () => {
    const productList = await getCategoryProductList(`categories.id:subtree("${TEST_CATEGORY_ID}")`, TEST_PAGE);
    expect(productList.statusCode).toEqual(200);
  });
  it('Try to recieve a sorted product list', async () => {
    const productList = await getSortedCategoryProductList(
      `categories.id:subtree("${TEST_CATEGORY_ID}")`,
      SORT_TEST_CRITERIA,
      TEST_PAGE
    );
    expect(productList.statusCode).toEqual(200);
  });
  it('Try to recieve a filtered product list', async () => {
    const productList = await getFilteredCategoryProductList(
      `categories.id:subtree("${TEST_CATEGORY_ID}")`,
      FILTER_TEST_CRITERIA,
      TEST_PAGE
    );
    expect(productList.statusCode).toEqual(200);
  });
  it('Try to recieve a filtered sorted product list', async () => {
    const productList = await getFilteredSortedCategoryProductList(
      `categories.id:subtree("${TEST_CATEGORY_ID}")`,
      FILTER_TEST_CRITERIA,
      SORT_TEST_CRITERIA,
      TEST_PAGE
    );
    expect(productList.statusCode).toEqual(200);
  });
  it('Try to recieve a searched product list', async () => {
    const productList = await getSearchProductListTotal('test', TEST_PAGE);
    expect(productList.statusCode).toEqual(200);
  });
  it('Try to recieve a sorted product list', async () => {
    const productList = await getSortedProductList(TEST_SEARCHSTRING, SORT_TEST_CRITERIA, TEST_PAGE);
    expect(productList.statusCode).toEqual(200);
  });
  it('Try to recieve a filtered product list', async () => {
    const productList = await getFilteredProductList(TEST_SEARCHSTRING, FILTER_TEST_CRITERIA, TEST_PAGE);
    expect(productList.statusCode).toEqual(200);
  });
  it('Try to recieve a filtered sorted product list', async () => {
    const productList = await getFilteredSortedProductList(
      TEST_SEARCHSTRING,
      FILTER_TEST_CRITERIA,
      SORT_TEST_CRITERIA,
      TEST_PAGE
    );
    expect(productList.statusCode).toEqual(200);
  });
});
