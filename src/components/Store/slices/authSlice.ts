import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Customer, CustomerDraft, CustomerUpdate, CustomerChangePassword } from '@commercetools/platform-sdk';
import type { AuthState } from '../../../dto/types';
import { createCustomer, updateCustomerById, updateCustomerPassword } from '../../Api/rest/auth';
import { notifyError, notifyInfo } from '../../../utils/notify/notify';
import { AuthPayload } from '../../../dto/types';

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

const updatePassword = createAsyncThunk('auth/updatePassword', async (payload: CustomerChangePassword) => {
  return updateCustomerPassword(payload)
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

const updateCustomer = createAsyncThunk(
  'auth/updateCustomer',
  async (payload: { id: string; query: CustomerUpdate }) => {
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
  }
);

const initialState: AuthState = {
  id: '',
  version: 0,
  createdAt: '',
  lastModifiedAt: '',
  email: '',
  addresses: [],
  isEmailVerified: false,
  authenticationMode: '',
  lastModifiedBy: {},
  createdBy: {},
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  password: '',
  shippingAddressIds: [],
  billingAddressIds: [],
  stores: [],
  inProgress: false,
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initAuth(state: AuthState) {
      Object.assign(state, {});
    },

    updateAuth(state: AuthState, action: PayloadAction<Customer>) {
      Object.assign(state, { ...action.payload });
    },

    logout(state: AuthState) {
      Object.assign(state);
    },

    clearAuth(state: AuthState) {
      Object.assign(state, initialState);
    },

    login(state: AuthState, action: PayloadAction<AuthPayload>) {
      Object.assign(state, {});
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        Object.assign(state, { inProgress: true });
      })
      .addCase(signup.fulfilled, (state, action) => {
        Object.assign(state, { inProgress: false }, action.payload);
      })
      .addCase(signup.rejected, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(updateCustomer.pending, (state) => {
        Object.assign(state, { inProgress: true });
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        Object.assign(state, { inProgress: false }, action.payload);
      })
      .addCase(updateCustomer.rejected, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(updatePassword.pending, (state) => {
        Object.assign(state, { inProgress: true });
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        Object.assign(state, { inProgress: false }, action.payload);
      })
      .addCase(updatePassword.rejected, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export { signup, updateCustomer, updatePassword };
export const { login, initAuth, updateAuth, clearAuth, logout } = authSlice.actions;
export default authSlice;
