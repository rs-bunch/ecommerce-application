import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Customer, CustomerDraft, CustomerUpdate } from '@commercetools/platform-sdk';
import type { AuthState } from '../../dto/types';
import { createCustomer, loginCustomer, updateCustomerById } from '../Api/auth';
import { notifyError, notifyInfo } from '../../utils/notify/notify';
import { AuthPayload } from '../../dto/types';

const signup = createAsyncThunk('auth/signup', async (payload: CustomerDraft) => {
  return createCustomer(payload)
    .then((response) => {
      if (response.statusCode !== 201) {
        let message = '';
        if ('message' in response) message = String(response.message);
        throw new Error(message);
      }
      notifyInfo('New customer was created!').showToast();
      return response.body.customer;
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const login = createAsyncThunk('auth/login', async (payload: AuthPayload) => {
  return loginCustomer(payload)
    .then((response) => {
      if (response.statusCode !== 200) {
        let message = '';
        if ('message' in response) message = String(response.message);
        throw new Error(message);
      }
      notifyInfo('Successful login!').showToast();
      return response.body.customer;
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const update = createAsyncThunk('auth/update', async (payload: { id: string; query: CustomerUpdate }) => {
  return updateCustomerById(payload)
    .then((response) => {
      if (response.statusCode !== 200) {
        let message = '';
        if ('message' in response) message = String(response.message);
        throw new Error(message);
      }
      notifyInfo('Updated!').showToast();
      return response.body;
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const initialState: AuthState = {
  id: '',
  version: 0,
  createdAt: '',
  lastModifiedAt: '',
  email: '',
  addresses: [],
  isEmailVerified: false,
  authenticationMode: '',
  inProgress: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initAuth(state: AuthState, action: PayloadAction<AuthState>) {
      Object.assign(state, { ...action.payload });
    },

    logout(state: AuthState) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: {
    [signup.pending.type]: (state: AuthState) => {
      Object.assign(state, { inProgress: true });
    },
    [signup.fulfilled.type]: (state: AuthState, { payload }: PayloadAction<Customer>) => {
      Object.assign(state, { inProgress: false }, payload);
    },
    [signup.rejected.type]: (state: AuthState) => {
      Object.assign(state, initialState);
    },
    [login.pending.type]: (state: AuthState) => {
      Object.assign(state, { inProgress: true });
    },
    [login.fulfilled.type]: (state: AuthState, { payload }: PayloadAction<Customer>) => {
      Object.assign(state, { inProgress: false }, payload);
    },
    [login.rejected.type]: (state: AuthState) => {
      Object.assign(state, initialState);
    },
    [update.pending.type]: (state: AuthState) => {
      Object.assign(state, { inProgress: true });
    },
    [update.fulfilled.type]: (state: AuthState, { payload }: PayloadAction<Customer>) => {
      Object.assign(state, { inProgress: false }, payload);
    },
    [update.rejected.type]: (state: AuthState) => {
      Object.assign(state, initialState);
    },
  },
});

export { signup, login, update };
export const { initAuth, logout } = authSlice.actions;
export default authSlice;
