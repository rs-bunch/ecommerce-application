import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notifyError } from '../../../utils/notify/notify';
import { CartState } from '../../../dto/types';
import { getActiveCart, createCart } from '../../Api/rest/me';

const activeCart = createAsyncThunk('cart/activeCart', async () => {
  return getActiveCart()
    .then(() => createCart())
    .then((response) => response.body)
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

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
export const { initCart } = cartSlice.actions;
export default cartSlice;
