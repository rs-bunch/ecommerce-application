import { configureStore, combineReducers } from '@reduxjs/toolkit';
import locationSlice from './locationSlice';
import authSlice from './authSlice';

const rootReducer = combineReducers({
  location: locationSlice.reducer,
  auth: authSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
export default store;
