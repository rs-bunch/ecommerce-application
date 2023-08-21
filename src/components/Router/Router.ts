import type { Store } from '../Store/store';
import { initLocation, changeLocation } from '../Store/locationSlice';
import { initAuth } from '../Store/authSlice';
import type LocalStorage from '../LocalStorage/LocalStorage';

const location: { [index: string]: string } = {
  '/': 'main',
  '/login': 'login',
  '/signup': 'signup',
  '/cart': 'cart',
  '/profile': 'profile',
  '/favourites': 'favourites',
  '/men': 'men',
  '/women': 'women',
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

  private handleLocation(type: string): void {
    const path = window.location.pathname;
    const payload = {
      location: location[path] || location['/404'],
    };

    if (type === 'INIT_LOCATION') this.store.dispatch(initLocation(payload));
    if (type === 'CHANGE_LOCATION') this.store.dispatch(changeLocation(payload));
  }
}

export default Router;
