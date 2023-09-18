import type { Store } from '../Store/store';
import { initLocation, changeLocation } from '../Store/slices/locationSlice';
import { initAuth } from '../Store/slices/authSlice';
import { getProductDetailsById } from '../Api/rest/product';
import { notifyError } from '../../utils/notify/notify';
import { selectProduct } from '../Store/slices/productSlice';

import {
  getProducts,
  getSortedProducts,
  getFilteredProducts,
  getFilteredSortedProducts,
  getSearchedProductsTotal,
  getSortedProductsTotal,
  getFilteredProductsTotal,
  getFilteredSortedProductsTotal,
} from '../Store/slices/productListSlice';

const location: { [index: string]: string } = {
  '/': 'main',
  '/login': 'login',
  '/signup': 'signup',
  '/cart': 'cart',
  '/profile': 'profile',
  '/favourites': 'favourites',
  '/men': 'men',
  '/women': 'women',
  '/product': 'product',
  '/products': 'products',
  '/search': 'search',
  '/404': 'error',
};

class Router {
  private store;

  constructor(store: Store) {
    this.store = store;

    window.addEventListener('DOMContentLoaded', () => {
      this.store.dispatch(initAuth());
      this.handleLocation('INIT_LOCATION');
    });

    window.addEventListener('popstate', () => {
      this.handleLocation('CHANGE_LOCATION');
    });

    document.addEventListener('click', (e) => {
      const eventPathArr = e.composedPath();
      if (eventPathArr.find((el) => el instanceof HTMLAnchorElement)) e.preventDefault();
      const target = eventPathArr.find((el) => el instanceof HTMLElement && el.dataset.href);
      if (target instanceof HTMLElement) {
        window.history.pushState({}, '', String(target.dataset.href));
        this.handleLocation('CHANGE_LOCATION');
      }
    });
  }

  private async handleLocation(type: string): Promise<void> {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const locationPath = `/${path.split('/')[1]}`;
    const payload = {
      location: location[locationPath] || location['/404'],
    };
    switch (payload.location) {
      case 'product': {
        const productId = path.split('/')[2];
        if (!productId) {
          payload.location = 'error';
          break;
        }
        if (type === 'INIT_LOCATION') this.store.dispatch(initLocation({ location: 'loading' }));
        if (type === 'CHANGE_LOCATION') this.store.dispatch(changeLocation({ location: 'loading' }));
        const response = await getProductDetailsById(productId).catch((error) => {
          notifyError(String(error.message)).showToast();
          payload.location = 'error';
        });
        if (response && response.statusCode === 200) {
          const productState = {
            productId,
            product: response.body.masterData.current,
            variantId: response.body.masterData.current.masterVariant.id,
          };
          this.store.dispatch(selectProduct(productState));
          break;
        }
        break;
      }
      case 'products': {
        const categoriesId = path.split('/')[2];
        if (!categoriesId) {
          payload.location = 'error';
          break;
        }

        if (urlParams.size <= 1) {
          payload.location = 'products';
          const page = urlParams.get('page');
          this.store.dispatch(
            getProducts({
              categoryId: categoriesId,
              page: Number(page) ?? 0,
            })
          );
        } else {
          payload.location = 'products';

          const page = urlParams.get('page');
          const sort = urlParams.get('sort');
          const order = urlParams.get('order');
          const priceRange = urlParams.get('price');
          const color = urlParams.get('color');
          const size = urlParams.get('size');

          const filter = [];

          if (priceRange) filter.push(`variants.price.centAmount:range (* to ${priceRange})`);
          if (color) filter.push(`variants.attributes.Color:"${color}"`);
          if (size) filter.push(`variants.attributes.Size:"${size}"`);

          if (filter.length && sort && order) {
            this.store.dispatch(
              getFilteredSortedProducts({
                categoryId: categoriesId,
                filter,
                sort: `${sort} ${order}`,
                page: Number(page) ?? 0,
              })
            );
          } else if (filter.length) {
            this.store.dispatch(
              getFilteredProducts({
                categoryId: categoriesId,
                criteria: filter,
                page: Number(page) ?? 0,
              })
            );
          } else if (sort && order) {
            this.store.dispatch(
              getSortedProducts({
                categoryId: categoriesId,
                criteria: `${sort} ${order}`,
                page: Number(page) ?? 0,
              })
            );
          }
        }
        break;
      }
      case 'search': {
        payload.location = 'search';
        const page = urlParams.get('page');
        const search = urlParams.get('text.en');

        const sort = urlParams.get('sort');
        const order = urlParams.get('order');
        const priceRange = urlParams.get('price');
        const color = urlParams.get('color');
        const size = urlParams.get('size');

        const filter = [];

        if (priceRange) filter.push(`variants.price.centAmount:range (* to ${priceRange})`);
        if (color) filter.push(`variants.attributes.Color:"${color}"`);
        if (size) filter.push(`variants.attributes.Size:"${size}"`);

        if (search && filter.length && sort) {
          this.store.dispatch(
            getFilteredSortedProductsTotal({
              text: search,
              filter,
              sort: `${sort} ${order}`,
              page: Number(page) ?? 0,
            })
          );
        } else if (search && filter.length) {
          this.store.dispatch(
            getFilteredProductsTotal({
              text: search,
              criteria: filter,
              page: Number(page) ?? 0,
            })
          );
        } else if (search && sort) {
          this.store.dispatch(
            getSortedProductsTotal({
              text: search,
              sort: `${sort} ${order}`,
              page: Number(page) ?? 0,
            })
          );
        } else if (search) {
          this.store.dispatch(
            getSearchedProductsTotal({
              text: search,
              page: Number(page) ?? 0,
            })
          );
        }
        break;
      }

      default:
        payload.location = location[locationPath];
    }
    if (type === 'INIT_LOCATION') this.store.dispatch(initLocation(payload));
    if (type === 'CHANGE_LOCATION') this.store.dispatch(changeLocation(payload));
  }
}

export default Router;
