import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notifyError } from '../../../utils/notify/notify';
import { CartState, LineItemPayload } from '../../../dto/types';
import { getActiveCart, createCart } from '../../Api/rest/me';

const activeCart = createAsyncThunk('cart/activeCart', async () => {
  return getActiveCart()
    .then(() => createCart())
    .then((response) => response.body)
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const initialState: CartState = {
  inProgress: false,
  error: '',
  cart: {
    id: '',
    customerId: '',
    lineItems: [],
    billingAddress: {
      country: '',
    },
    shippingAddress: {
      country: '',
    },
    discountCodes: [],
    version: 0,
    customLineItems: [],
    totalPrice: {
      type: 'centPrecision',
      currencyCode: '',
      centAmount: 0,
      fractionDigits: 0,
    },
    taxMode: '',
    taxRoundingMode: '',
    taxCalculationMode: '',
    inventoryMode: '',
    cartState: '',
    shippingMode: '',
    shipping: [],
    itemShippingAddresses: [],
    directDiscounts: [],
    refusedGifts: [],
    origin: '',
    createdAt: '',
    lastModifiedAt: '',
  },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initCart(state, action) {
      Object.assign(state, { ...action.payload });
    },

    updateCartState(state, action) {
      Object.assign(state, { ...action.payload });
    },

    addLineItem(state, action: PayloadAction<LineItemPayload>) {
      Object.assign(state, {});
    },

    removeLineItem(state, action: PayloadAction<{ lineItemId: string }>) {
      Object.assign(state, {});
    },

    changeLineItemQuantity(state, action: PayloadAction<{ lineItemId: string; quantity: number }>) {
      Object.assign(state, {});
    },

    clearCart(state) {
      Object.assign(state, initialState);
    },

    deleteCart(state) {
      Object.assign(state, {});
    },

    addDiscountCode(state, action: PayloadAction<{ code: string }>) {
      Object.assign(state, {});
    },

    removeDiscountCode(state, action: PayloadAction<{ id: string }>) {
      Object.assign(state, {});
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
export const {
  addDiscountCode,
  removeDiscountCode,
  initCart,
  updateCartState,
  clearCart,
  deleteCart,
  addLineItem,
  removeLineItem,
  changeLineItemQuantity,
} = cartSlice.actions;
export default cartSlice;
