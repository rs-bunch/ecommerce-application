import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ProductState } from '../../../dto/types';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    productId: '',
    variantId: 1,
    product: null,
  },
  reducers: {
    selectProduct(state: ProductState, action: PayloadAction<ProductState>) {
      Object.assign(state, action.payload);
    },
    selectProductVariant(state: ProductState, action: PayloadAction<{ variantId: number }>) {
      Object.assign(state, { variantId: action.payload.variantId });
    },
  },
});

export const { selectProduct, selectProductVariant } = productSlice.actions;
export default productSlice;
