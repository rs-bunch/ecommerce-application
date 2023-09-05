import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategoryProductList } from '../Api/productList';
import { notifyError } from '../../utils/notify/notify';
import { ProductListState } from '../../dto/types';

const getProducts = createAsyncThunk('/products/accessories/', async (payload: { categoryId: string }) => {
  return getCategoryProductList(`categories.id:subtree("${payload.categoryId}")`)
    .then((response) => {
      return { id: payload.categoryId, products: response.body };
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
