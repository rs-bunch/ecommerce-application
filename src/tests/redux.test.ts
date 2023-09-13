import { ProductData } from '@commercetools/platform-sdk';
import { initLocation } from '../components/Store/locationSlice';
import { selectProduct, selectProductVariant } from '../components/Store/productSlice';
import { initAuth, logout } from '../components/Store/authSlice';
import store from '../components/Store/store';

const productMock = {
  name: { 'en-US': 'test' },
  categories: [],
  slug: { 'en-US': 'test' },
  masterVariant: {
    id: 1,
  },
  variants: [],
  searchKeywords: {},
};

const state = {
  id: 'id12345',
  version: 1,
  createdAt: '2222-11-11',
  lastModifiedAt: '2222-11-11',
  email: 'email@domain.com',
  addresses: [],
  isEmailVerified: false,
  authenticationMode: 'email',
  inProgress: false,
};

describe('Testing Location', () => {
  it('Try init location', () => {
    store.dispatch(initLocation({ location: 'test' }));
    expect(store.getState().location.location).toEqual('test');
  });
  it('Try change location', () => {
    store.dispatch(initLocation({ location: 'test2' }));
    expect(store.getState().location.location).toEqual('test2');
  });
});

describe('Testing ProductData', () => {
  it('Try set product', () => {
    store.dispatch(selectProduct({ product: productMock }));
    expect(store.getState().product.product).toBeTruthy();
  });
  it('Try change variant', () => {
    store.dispatch(selectProductVariant({ id: 2 }));
    expect(store.getState().product.id).toEqual(2);
  });
});

describe('Testing authSlice.actions', () => {
  it('Try set up initAuth', () => {
    store.dispatch(initAuth(state));
    expect(store.getState().auth.id).toEqual('id12345');
    expect(store.getState().auth.version).toEqual(1);
    expect(store.getState().auth.createdAt).toEqual('2222-11-11');
    expect(store.getState().auth.lastModifiedAt).toEqual('2222-11-11');
    expect(store.getState().auth.email).toEqual('email@domain.com');
    expect(store.getState().auth.authenticationMode).toEqual('email');
  });
  it('Try to logout', () => {
    store.dispatch(logout());
    expect(store.getState().auth.id).toEqual('');
    expect(store.getState().auth.version).toEqual(0);
    expect(store.getState().auth.createdAt).toEqual('');
    expect(store.getState().auth.lastModifiedAt).toEqual('');
    expect(store.getState().auth.email).toEqual('');
    expect(store.getState().auth.authenticationMode).toEqual('');
  });
});
