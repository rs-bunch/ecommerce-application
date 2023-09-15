import { configureStore, combineReducers, bindActionCreators } from '@reduxjs/toolkit';
import locationSlice from './locationSlice';
import productSlice from './productSlice';
import productListSlice from './productListSlice';
import authSlice, { logout, updateCustomer, updatePassword } from './authSlice';
// import tokenSlice from './tokenSlice';
// import { TokenState } from '../../dto/types';
import authMiddleware from './authMiddleware';
import initMiddleware from './initMiddleware';

const rootReducer = combineReducers({
  location: locationSlice.reducer,
  auth: authSlice.reducer,
  product: productSlice.reducer,
  productList: productListSlice.reducer,
  // token: tokenSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(initMiddleware, authMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
export default store;

const logoutBindAction = bindActionCreators(logout, store.dispatch);
const updateCustomerBindAction = bindActionCreators(updateCustomer, store.dispatch);
const updatePasswordBindAction = bindActionCreators(updatePassword, store.dispatch);

export { logoutBindAction, updateCustomerBindAction, updatePasswordBindAction };
