import { configureStore, combineReducers, bindActionCreators } from '@reduxjs/toolkit';
import locationSlice from './slices/locationSlice';
import productSlice from './slices/productSlice';
import productListSlice from './slices/productListSlice';
import authSlice, { logout, updateCustomer, updatePassword } from './slices/authSlice';
import cartSlice, {
  deleteCart,
  activeCart,
  changeLineItemQuantity,
  removeLineItem,
  addDiscountCode,
  removeDiscountCode,
} from './slices/cartSlice';
import authMiddleware from './middlewares/authMiddleware';
import initMiddleware from './middlewares/initMiddleware';
import cartMiddleware from './middlewares/cartMiddleware';

const rootReducer = combineReducers({
  location: locationSlice.reducer,
  auth: authSlice.reducer,
  product: productSlice.reducer,
  productList: productListSlice.reducer,
  cart: cartSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(initMiddleware, authMiddleware, cartMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
export default store;

const logoutBindAction = bindActionCreators(logout, store.dispatch);
const updateCustomerBindAction = bindActionCreators(updateCustomer, store.dispatch);
const updatePasswordBindAction = bindActionCreators(updatePassword, store.dispatch);
const activeCartBindAction = bindActionCreators(activeCart, store.dispatch);
const changeLineItemQuantityBindAction = bindActionCreators(changeLineItemQuantity, store.dispatch);
const removeLineItemBindAction = bindActionCreators(removeLineItem, store.dispatch);
const deleteCartBindAction = bindActionCreators(deleteCart, store.dispatch);
const addDiscountCodeBindAction = bindActionCreators(addDiscountCode, store.dispatch);
const removeDiscountCodeBindAction = bindActionCreators(removeDiscountCode, store.dispatch);

export {
  changeLineItemQuantityBindAction,
  activeCartBindAction,
  logoutBindAction,
  updateCustomerBindAction,
  updatePasswordBindAction,
  removeLineItemBindAction,
  deleteCartBindAction,
  addDiscountCodeBindAction,
  removeDiscountCodeBindAction,
};
