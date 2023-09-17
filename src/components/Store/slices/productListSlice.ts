import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import {
  getCategoryProductList,
  getSortedCategoryProductList,
  getFilteredCategoryProductList,
  getFilteredSortedCategoryProductList,
  // getSearchProductList,
  getSearchProductListTotal,
  getSortedProductList,
  getFilteredProductList,
  getFilteredSortedProductList,
} from '../../Api/rest/productList';
import { notifyError, notifyInfo } from '../../../utils/notify/notify';
import { ProductListState } from '../../../dto/types';

const getProducts = createAsyncThunk('/products/getall/', async (payload: { categoryId: string }) => {
  return getCategoryProductList(`categories.id:subtree("${payload.categoryId}")`)
    .then((response) => {
      return { id: payload.categoryId, products: response.body };
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const getSortedProducts = createAsyncThunk(
  '/products/getsorted/',
  async (payload: { categoryId: string; criteria: string }) => {
    return getSortedCategoryProductList(`categories.id:subtree("${payload.categoryId}")`, payload.criteria)
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
  async (payload: { categoryId: string; criteria: string[] }) => {
    console.log('filter', payload);
    return getFilteredCategoryProductList(`categories.id:subtree("${payload.categoryId}")`, payload.criteria)
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
  async (payload: { categoryId: string; filter: string[]; sort: string }) => {
    return getFilteredSortedCategoryProductList(
      `categories.id:subtree("${payload.categoryId}")`,
      payload.filter,
      payload.sort
    )
      .then((response) => {
        return { id: payload.categoryId, products: response.body };
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
);

// const getSearchedProducts = createAsyncThunk(
//   '/products/getsearched/',
//   async (payload: { categoryId: string; text: string }) => {
//     return getSearchProductList(`categories.id:subtree("${payload.categoryId}")`, payload.text)
//       .then((response) => {
//         return { id: payload.categoryId, products: response.body };
//       })
//       .catch((error) => {
//         notifyError(String(error.message)).showToast();
//       });
//   }
// );

const getSearchedProductsTotal = createAsyncThunk('/search/', async (payload: { text: string }) => {
  return getSearchProductListTotal(payload.text)
    .then((response) => {
      return { products: response.body };
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const getSortedProductsTotal = createAsyncThunk('/search/sort', async (payload: { text: string; sort: string }) => {
  return getSortedProductList(payload.text, payload.sort)
    .then((response) => {
      return { products: response.body };
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const getFilteredProductsTotal = createAsyncThunk(
  '/search/filter/',
  async (payload: { text: string; criteria: string[] }) => {
    return getFilteredProductList(payload.text, payload.criteria)
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
  async (payload: { text: string; filter: string[]; sort: string }) => {
    return getFilteredSortedProductList(payload.text, payload.filter, payload.sort)
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
    // [getSearchedProducts.fulfilled.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
    //   Object.assign(state, payload);
    // },
    // [getSearchedProducts.pending.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
    //   Object.assign(state, { id: null, products: null });
    // },
    // [getSearchedProducts.rejected.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
    //   Object.assign(state, { id: null });
    // },
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
  // getSearchedProducts,
  getSearchedProductsTotal,
  getSortedProductsTotal,
  getFilteredProductsTotal,
  getFilteredSortedProductsTotal,
};
export default productListSlice;
