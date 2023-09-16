import { ProductData } from '@commercetools/platform-sdk';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ProductState } from '../../../dto/types';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    product: null,
    id: null,
  },
  reducers: {
    selectProduct(state: ProductState, action: PayloadAction<{ product: ProductData }>) {
      Object.assign(state, { product: action.payload.product, id: action.payload.product.masterVariant.id });
    },
    selectProductVariant(state: ProductState, action: PayloadAction<{ id: number }>) {
      Object.assign(state, { id: action.payload.id });
    },
  },
});

export const { selectProduct, selectProductVariant } = productSlice.actions;
export default productSlice;
