import { configureStore, combineReducers, bindActionCreators } from '@reduxjs/toolkit';
import locationSlice from './slices/locationSlice';
import productSlice from './slices/productSlice';
import productListSlice from './slices/productListSlice';
import authSlice, { logout, updateCustomer, updatePassword } from './slices/authSlice';
import cartSlice, { activeCart, changeLineItemQuantity } from './slices/cartSlice';
// import tokenSlice from './tokenSlice';
// import { TokenState } from '../../dto/types';
import authMiddleware from './middlewares/authMiddleware';
import initMiddleware from './middlewares/initMiddleware';
import cartMiddleware from './middlewares/cartMiddleware';

const rootReducer = combineReducers({
  location: locationSlice.reducer,
  auth: authSlice.reducer,
  product: productSlice.reducer,
  productList: productListSlice.reducer,
  cart: cartSlice.reducer,
  // token: tokenSlice.reducer,
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

export {
  changeLineItemQuantityBindAction,
  activeCartBindAction,
  logoutBindAction,
  updateCustomerBindAction,
  updatePasswordBindAction,
};
