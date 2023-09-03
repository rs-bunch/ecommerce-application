import { configureStore, combineReducers } from '@reduxjs/toolkit';
import locationSlice from './locationSlice';
import authSlice from './authSlice';
import productSlice from './productSlice';

const rootReducer = combineReducers({
  location: locationSlice.reducer,
  auth: authSlice.reducer,
  product: productSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
export default store;
