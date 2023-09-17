import { MyCartDraft, MyCartUpdateAction } from '@commercetools/platform-sdk';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notifyError } from '../../../utils/notify/notify';
import { CartState, LineItemPayload } from '../../../dto/types';
import { getActiveCart, createCart, updateCart } from '../../Api/rest/me';

const activeCart = createAsyncThunk('cart/activeCart', async () => {
  return getActiveCart()
    .then(() => createCart())
    .then((response) => response.body)
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

// const addLineItem = createAsyncThunk(
//   'cart/activeCart',
//   async (payload: { productId: string; quantity: number; variantId: number }) => {
//     const myCartUpdateAction: MyCartUpdateAction = { action: 'addLineItem', ...payload };

//     return updateCart({ actions: [myCartUpdateAction], version: 0 })
//       .then((response) => response.body)
//       .catch((error) => {
//         notifyError(String(error.message)).showToast();
//       });
//   }
// );

const initialState = {
  inProgress: false,
  error: '',
  cart: {
    id: '',
    customerId: '',
    lineItems: [],
    totalPrice: '',
    billingAddress: {
      country: '',
    },
    shippingAddress: {
      country: '',
    },
    discountCodes: [],
    version: 0,
  },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initCart(state, action) {
      Object.assign(state, { ...action.payload });
    },

    addLineItem(state, action: PayloadAction<LineItemPayload>) {
      Object.assign(state, {});
    },

    removeLineItem(state, action: PayloadAction<{ lineItemId: string }>) {
      Object.assign(state, {});
    },

    clearCart(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(activeCart.pending, (state) => {
        Object.assign(state, { inProgress: true });
      })
      .addCase(activeCart.fulfilled, (state, action) => {
        Object.assign(state, { inProgress: false }, action.payload);
      })
      .addCase(activeCart.rejected, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export { activeCart };
export const { initCart, clearCart, addLineItem, removeLineItem } = cartSlice.actions;
export default cartSlice;
