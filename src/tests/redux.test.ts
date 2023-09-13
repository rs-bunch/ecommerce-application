import { initLocation } from '../components/Store/locationSlice';
import { selectProduct, selectProductVariant } from '../components/Store/productSlice';
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
    expect(store.getState().product.product?.name).toEqual('test');
  });
  it('Try change variant', () => {
    store.dispatch(selectProductVariant({ id: 2 }));
    expect(store.getState().product.id).toEqual(2);
  });
});
