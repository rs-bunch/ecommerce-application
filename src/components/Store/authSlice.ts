import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState } from '../../dto/types';
import { createCustomer, loginCustomer } from '../Api/auth';
import { notifyError, notifyInfo } from '../../utils/notify/notify';
import { Payload } from '../../dto/types';

const signup = createAsyncThunk('auth/signup', async (payload: Payload) => {
  return createCustomer(payload)
    .then((response) => {
      if (response.statusCode !== 201) {
        let message = '';
        if ('message' in response) message = String(response.message);
        throw new Error(message);
      }
      notifyInfo('New customer was created!').showToast();
      return response.body.customer.id;
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const signin = createAsyncThunk('auth/signin', async (payload: Payload) => {
  return loginCustomer(payload)
    .then((response) => {
      if (response.statusCode !== 200) {
        let message = '';
        if ('message' in response) message = String(response.message);
        throw new Error(message);
      }
      notifyInfo('Successful login!').showToast();
      return response.body.customer.id;
    })
    .catch((error) => {
      notifyError(String(error.message)).showToast();
    });
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    id: null,
    inProgress: false,
  },
  reducers: {
    changeAuthStatus(state: AuthState, action: PayloadAction<{ id: string | null }>) {
      Object.assign(state, { id: action.payload.id });
    },
  },
  extraReducers: {
    [signup.pending.type]: (state: AuthState) => {
      Object.assign(state, { inProgress: true });
    },
    [signup.fulfilled.type]: (state: AuthState, { payload }: PayloadAction<string>) => {
      Object.assign(state, { inProgress: false, id: payload });
    },
    [signup.rejected.type]: (state: AuthState) => {
      Object.assign(state, { inProgress: false, id: null });
    },
    [signin.pending.type]: (state: AuthState) => {
      Object.assign(state, { inProgress: true });
    },
    [signin.fulfilled.type]: (state: AuthState, { payload }: PayloadAction<string>) => {
      Object.assign(state, { inProgress: false, id: payload });
    },
    [signin.rejected.type]: (state: AuthState) => {
      Object.assign(state, { inProgress: false, id: null });
    },
  },
});

export { signup, signin };
export const { changeAuthStatus } = authSlice.actions;
export default authSlice;
