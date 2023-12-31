import { initLocation } from '../components/Store/slices/locationSlice';
import { selectProduct, selectProductVariant } from '../components/Store/slices/productSlice';
import { updateAuth, clearAuth } from '../components/Store/slices/authSlice';
import store from '../components/Store/store';
import LocalStorageMock from './mocks/LocalStorageMock';

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

global.localStorage = new LocalStorageMock();

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
    store.dispatch(selectProduct({ productId: '12345', variantId: 1, product: productMock }));
    expect(store.getState().product.product).toBeTruthy();
  });
  it('Try change variant', () => {
    store.dispatch(selectProductVariant({ variantId: 2 }));
    expect(store.getState().product.variantId).toEqual(2);
  });
});

describe('Testing authSlice.actions', () => {
  it('Try set up updateAuth', () => {
    store.dispatch(updateAuth(state));
    expect(store.getState().auth.id).toEqual('id12345');
    expect(store.getState().auth.version).toEqual(1);
    expect(store.getState().auth.createdAt).toEqual('2222-11-11');
    expect(store.getState().auth.lastModifiedAt).toEqual('2222-11-11');
    expect(store.getState().auth.email).toEqual('email@domain.com');
    expect(store.getState().auth.authenticationMode).toEqual('email');
  });
  it('Try to logout', () => {
    store.dispatch(clearAuth());
    expect(store.getState().auth.id).toEqual('');
    expect(store.getState().auth.version).toEqual(0);
    expect(store.getState().auth.createdAt).toEqual('');
    expect(store.getState().auth.lastModifiedAt).toEqual('');
    expect(store.getState().auth.email).toEqual('');
    expect(store.getState().auth.authenticationMode).toEqual('');
  });
});
