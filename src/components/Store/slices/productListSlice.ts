import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCategoryProductList,
  getSortedCategoryProductList,
  getFilteredCategoryProductList,
  getFilteredSortedCategoryProductList,
  getSearchProductListTotal,
  getSortedProductList,
  getFilteredProductList,
  getFilteredSortedProductList,
} from '../../Api/rest/productList';
import { notifyError } from '../../../utils/notify/notify';
import { ProductListState } from '../../../dto/types';

const getProducts = createAsyncThunk('/products/getall/', async (payload: { categoryId: string; page: number }) => {
  return getCategoryProductList(`categories.id:subtree("${payload.categoryId}")`, payload.page)
    .then((response) => {
      return { id: payload.categoryId, products: response.body };
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const getSortedProducts = createAsyncThunk(
  '/products/getsorted/',
  async (payload: { categoryId: string; criteria: string; page: number }) => {
    return getSortedCategoryProductList(
      `categories.id:subtree("${payload.categoryId}")`,
      payload.criteria,
      payload.page
    )
      .then((response) => {
        return { id: payload.categoryId, products: response.body };
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
);

const getFilteredProducts = createAsyncThunk(
  '/products/getfiltered/',
  async (payload: { categoryId: string; criteria: string[]; page: number }) => {
    return getFilteredCategoryProductList(
      `categories.id:subtree("${payload.categoryId}")`,
      payload.criteria,
      payload.page
    )
      .then((response) => {
        return { id: payload.categoryId, products: response.body };
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
);

const getFilteredSortedProducts = createAsyncThunk(
  '/products/getfs/',
  async (payload: { categoryId: string; filter: string[]; sort: string; page: number }) => {
    return getFilteredSortedCategoryProductList(
      `categories.id:subtree("${payload.categoryId}")`,
      payload.filter,
      payload.sort,
      payload.page
    )
      .then((response) => {
        return { id: payload.categoryId, products: response.body };
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
);

const getSearchedProductsTotal = createAsyncThunk('/search/', async (payload: { text: string; page: number }) => {
  return getSearchProductListTotal(payload.text, payload.page)
    .then((response) => {
      return { products: response.body };
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const getSortedProductsTotal = createAsyncThunk(
  '/search/sort',
  async (payload: { text: string; sort: string; page: number }) => {
    return getSortedProductList(payload.text, payload.sort, payload.page)
      .then((response) => {
        return { products: response.body };
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
);

const getFilteredProductsTotal = createAsyncThunk(
  '/search/filter/',
  async (payload: { text: string; criteria: string[]; page: number }) => {
    return getFilteredProductList(payload.text, payload.criteria, payload.page)
      .then((response) => {
        return { products: response.body };
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
);

const getFilteredSortedProductsTotal = createAsyncThunk(
  '/search/fs/',
  async (payload: { text: string; filter: string[]; sort: string; page: number }) => {
    return getFilteredSortedProductList(payload.text, payload.filter, payload.sort, payload.page)
      .then((response) => {
        return { products: response.body };
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
);

const productListSlice = createSlice({
  name: 'productList',
  initialState: {
    id: null,
    products: null,
  },
  reducers: {},
  extraReducers: {
    [getProducts.fulfilled.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, payload);
    },
    [getProducts.pending.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null, products: null });
    },
    [getProducts.rejected.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null });
    },
    [getSortedProducts.fulfilled.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, payload);
    },
    [getSortedProducts.pending.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null, products: null });
    },
    [getSortedProducts.rejected.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null });
    },
    [getFilteredProducts.fulfilled.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, payload);
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
      Object.assign(state, payload);
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
    [getSearchedProductsTotal.fulfilled.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, payload);
    },
    [getSearchedProductsTotal.pending.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, { id: null, products: null });
    },
    [getSearchedProductsTotal.rejected.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, { id: null });
    },

    [getSortedProductsTotal.fulfilled.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, payload);
    },
    [getSortedProductsTotal.pending.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null, products: null });
    },
    [getSortedProductsTotal.rejected.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null });
    },
    [getFilteredProductsTotal.fulfilled.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, payload);
    },
    [getFilteredProductsTotal.pending.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, { id: null, products: null });
    },
    [getFilteredProductsTotal.rejected.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, { id: null });
    },
    [getFilteredSortedProductsTotal.fulfilled.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, payload);
    },
    [getFilteredSortedProductsTotal.pending.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, { id: null, products: null });
    },
    [getFilteredSortedProductsTotal.rejected.type]: (
      state: ProductListState,
      { payload }: PayloadAction<ProductListState>
    ) => {
      Object.assign(state, { id: null });
    },
  },
});

export {
  getProducts,
  getSortedProducts,
  getFilteredProducts,
  getFilteredSortedProducts,
  getSearchedProductsTotal,
  getSortedProductsTotal,
  getFilteredProductsTotal,
  getFilteredSortedProductsTotal,
};
export default productListSlice;
