import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import { getCategoryProductList } from '../Api/productList';
import { notifyError, notifyInfo } from '../../utils/notify/notify';
import { ProductListState } from '../../dto/types';

const getProducts = createAsyncThunk('/products/accessories/', async (payload: { categoryId: string }) => {
  return getCategoryProductList(payload.categoryId)
    .then((response) => {
      console.log(response);
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
      Object.assign(state, payload);
    },
    [getProducts.pending.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null, products: null });
    },
    [getProducts.rejected.type]: (state: ProductListState, { payload }: PayloadAction<ProductListState>) => {
      Object.assign(state, { id: null });
    },
  },
});

export { getProducts };
export default productListSlice;
