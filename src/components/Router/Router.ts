import { StoreType } from '../Store/store';
import { initLocation, changeLocation } from '../Store/locationSlice';

const location: { [index: string]: string } = {
  '/': 'main',
  '/login': 'login',
  '/register': 'register',
  '/404': 'error',
};

class Router {
  private store;

  constructor(store: StoreType) {
    this.store = store;

    window.addEventListener('DOMContentLoaded', () => {
      this.handleLocation('INIT_LOCATION');
    });

    window.addEventListener('popstate', () => {
      this.handleLocation('CHANGE_LOCATION');
    });

    document.addEventListener('click', (e) => {
      const target = e.composedPath()[0];
      if (target instanceof HTMLAnchorElement) e.preventDefault();
      if (target instanceof HTMLElement && target.dataset.href) {
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
