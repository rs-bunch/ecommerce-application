import type { Store } from '../Store/store';
import { initLocation, changeLocation } from '../Store/locationSlice';
import { initAuth } from '../Store/authSlice';
import type LocalStorage from '../LocalStorage/LocalStorage';
import { getProductDetailsById } from '../Api/product';
import { notifyError } from '../../utils/notify/notify';
import { selectProduct } from '../Store/productSlice';

import {
  getProducts,
  getSortedProducts,
  getFilteredProducts,
  getFilteredSortedProducts,
  getSearchedProducts,
} from '../Store/productListSlice';

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
  '/404': 'error',
};

class Router {
  private store;

  constructor(store: Store, localStorage: LocalStorage) {
    this.store = store;

    window.addEventListener('DOMContentLoaded', () => {
      const localState = localStorage.loadState();
      if (localState) this.store.dispatch(initAuth(localState.auth));
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
          this.store.dispatch(selectProduct({ product: response.body.masterData.current }));
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
        // Insert

        if (!urlParams.size) {
          payload.location = 'products';
          this.store.dispatch(
            getProducts({
              // categoryId: `categories.id:subtree("${categoriesId}")`,
              categoryId: categoriesId,
            })
          );
        } else {
          payload.location = 'products';
          const sort = urlParams.get('sort');
          const order = urlParams.get('order');
          const priceRange = urlParams.get('price');
          const color = urlParams.get('color');
          const size = urlParams.get('size');

          const search = urlParams.get('text.en');
          if (search) {
            this.store.dispatch(
              getSearchedProducts({
                categoryId: categoriesId,
                text: search,
              })
            );
          }

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
              })
            );
          } else if (filter.length) {
            this.store.dispatch(
              getFilteredProducts({
                categoryId: categoriesId,
                criteria: filter,
              })
            );
          } else if (sort && order) {
            this.store.dispatch(
              getSortedProducts({
                categoryId: categoriesId,
                criteria: `${sort} ${order}`,
              })
            );
          }
        }

        // this.store.dispatch(getProducts({ categoryId: categoriesId }));
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
