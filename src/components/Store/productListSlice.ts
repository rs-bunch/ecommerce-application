import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import {
  getCategoryProductList,
  getSortedCategoryProductList,
  getFilteredCategoryProductList,
  getFilteredSortedCategoryProductList,
  getSearchProductList,
} from '../Api/productList';
import { notifyError, notifyInfo } from '../../utils/notify/notify';
import { ProductListState } from '../../dto/types';

const getProducts = createAsyncThunk('/products/accessories/', async (payload: { categoryId: string }) => {
  return getCategoryProductList(payload.categoryId)
    .then((response) => {
      return response.body;
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const getSortedProducts = createAsyncThunk(
  '/products/accessories/',
  async (payload: { categoryId: string; criteria: string }) => {
    return getSortedCategoryProductList(payload.categoryId, payload.criteria)
      .then((response) => {
        return response.body;
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
);

const getFilteredProducts = createAsyncThunk(
  '/products/accessories/',
  async (payload: { categoryId: string; criteria: string[] }) => {
    return getFilteredCategoryProductList(payload.categoryId, payload.criteria)
      .then((response) => {
        return response.body;
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
);

const getFilteredSortedProducts = createAsyncThunk(
  '/products/accessories/',
  async (payload: { categoryId: string; filter: string[]; sort: string }) => {
    return getFilteredSortedCategoryProductList(payload.categoryId, payload.filter, payload.sort)
      .then((response) => {
        return response.body;
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
);

const getSearchedProducts = createAsyncThunk('/products/accessories/', async (payload: { text: string }) => {
  return getSearchProductList(payload.text)
    .then((response) => {
      return response.body;
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const productListSlice = createSlice({
  name: 'productList',
  initialState: {
    id: null,
    products: null,
  },
  reducers: {},
  extraReducers: {
    [getProducts.fulfilled.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { products: payload });
    },
    [getProducts.pending.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null, products: null });
    },
    [getProducts.rejected.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null });
    },
    [getSortedProducts.fulfilled.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { products: payload });
    },
    [getSortedProducts.pending.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null, products: null });
    },
    [getSortedProducts.rejected.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null });
    },
    [getFilteredProducts.fulfilled.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { products: payload });
    },
    [getFilteredProducts.pending.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null, products: null });
    },
    [getFilteredProducts.rejected.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null });
    },
    [getFilteredSortedProducts.fulfilled.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, { products: payload });
    },
    [getFilteredSortedProducts.pending.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, { id: null, products: null });
    },
    [getFilteredSortedProducts.rejected.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, { id: null });
    },
    [getSearchedProducts.fulfilled.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { products: payload });
    },
    [getSearchedProducts.pending.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null, products: null });
    },
    [getSearchedProducts.rejected.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null });
    },
  },
});

export { getProducts, getSortedProducts, getFilteredProducts, getFilteredSortedProducts, getSearchedProducts };
export default productListSlice;
