/**
 * @jest-environment jsdom
 */

import 'whatwg-fetch';
import '../styles/vars.scss';
import '../styles/mixins.scss';
import Cart, { createElementFromObj } from '../components/Cart/Cart';
import FavouriteItems from '../components/FavouriteItems/FavouriteItems';
import ShopHeader from '../components/Header/Header';
import CustomOverlay from '../components/Overlay/Overlay';
import ProfilePage from '../components/Profile/ProfilePage';
import StartPage from '../components/StartPage/StartPage';
import LoginForm from '../components/LoginForm/LoginForm';
import TestUtils from './utils/test-utils';
import Page404 from '../components/Page404/Page404';
import CartItem from '../components/Cart/CartItem/CartItem';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

customElements.define('custom-overlay', CustomOverlay);
customElements.define('nav-element', ShopHeader);
customElements.define('login-form', LoginForm);
customElements.define('start-page', StartPage);
customElements.define('favourite-items', FavouriteItems);
customElements.define('cart-element', Cart);
customElements.define('account-element', ProfilePage);
customElements.define('error-element', Page404);
customElements.define('cart-item', CartItem);

describe('Cart element tests', () => {
  it('Shadow root has cart element', async () => {
    const customElement = await TestUtils.render('cart-element');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.cart');
    expect(element).toBeTruthy();
  });
});

describe('Favourite items element tests', () => {
  it('Shadow root has favourite items element', async () => {
    const customElement = await TestUtils.render('favourite-items');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.favourite-items');
    expect(element).toBeTruthy();
  });
});

describe('Header element tests', () => {
  it('Shadow root has header container element', async () => {
    const customElement = await TestUtils.render('nav-element');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.header-container');
    expect(element).toBeTruthy();
  });
  it('Shadow root has side bar element', async () => {
    const customElement = await TestUtils.render('nav-element');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.side-bar');
    expect(element).toBeTruthy();
  });
});

describe('Login element tests', () => {
  it('Shadow root has sign in element', async () => {
    const customElement = await TestUtils.render('login-form');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.sign-in');
    expect(element).toBeTruthy();
  });
});

describe('Overlay element tests', () => {
  it('Shadow root has overlay element', async () => {
    const customElement = await TestUtils.render('custom-overlay');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.overlay');
    expect(element).toBeTruthy();
  });
});

describe('Profile element tests', () => {
  it('Shadow root has profile element', async () => {
    const customElement = await TestUtils.render('account-element');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.profile');
    expect(element).toBeTruthy();
  });
});

describe('Start Page element tests', () => {
  it('Shadow root has start page', async () => {
    const customElement = await TestUtils.render('start-page');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.start-page');
    expect(element).toBeTruthy();
  });
  it('Shadow root has men categories element', async () => {
    const customElement = await TestUtils.render('start-page');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.categories_men');
    expect(element).toBeTruthy();
  });
  it('Shadow root has women categories element', async () => {
    const customElement = await TestUtils.render('start-page');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.categories_women');
    expect(element).toBeTruthy();
  });
});

describe('Error 404 page tests', () => {
  it('Shadow root has page 404 element', async () => {
    const customElement = await TestUtils.render('error-element');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.page404');
    expect(element).toBeTruthy();
  });
});

describe('Address Card tests', () => {
  it('Shadow root has address-card element', async () => {
    const customElement = await TestUtils.render('address-card');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.card');
    expect(element).toBeTruthy();
  });
});

describe('Address Modal tests', () => {
  it('Shadow root has modal-card element', async () => {
    const customElement = await TestUtils.render('address-modal');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.modal');
    expect(element).toBeTruthy();
  });
});

describe('Contact Card tests', () => {
  it('Shadow root has contact-card element', async () => {
    const customElement = await TestUtils.render('contact-card');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.contact');
    expect(element).toBeTruthy();
  });
});

describe('Menu Carsd tests', () => {
  it('Shadow root has menu-card element', async () => {
    const customElement = await TestUtils.render('menu-card');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.menu');
    expect(element).toBeTruthy();
  });
});

describe('Cart item tests', () => {
  it('Shadow root has cart-item element', async () => {
    const customElement = await TestUtils.render('cart-item');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.item');
    expect(element).toBeTruthy();
  });
});

describe('Breadcrumb element tests', () => {
  it('Shadow root has breadcrumb-element element', async () => {
    const customElement = await TestUtils.render('breadcrumb-element');
    const { shadowRoot } = customElement as { shadowRoot: ShadowRoot };
    const element: HTMLElement | null = shadowRoot.querySelector('.breadcrumb');
    expect(element).toBeTruthy();
  });
});

describe('CreateElementFromObj', () => {
  const obj = {
    tag: 'div',
    attributes: {
      id: 'id00000',
    },
    children: [
      {
        tag: 'cart-item',
        attributes: {
          id: 'id12345',
          name: 'name',
          image: '/assets/images/placeholder-105x120.png',
          size: 'Default',
          color: 'Default',
          quantity: '1',
        },
      },
    ],
  };
  it('Should create a HTMLElement', async () => {
    const customElement = await createElementFromObj(obj);
    expect(customElement.getAttribute('id')).toBe('id00000');
    expect(customElement.querySelector('#id12345')?.getAttribute('image')).toBe(
      '/assets/images/placeholder-105x120.png'
    );
    expect(customElement.querySelector('#id12345')?.getAttribute('size')).toBe('Default');
    expect(customElement.querySelector('#id12345')?.getAttribute('color')).toBe('Default');
    expect(customElement.querySelector('#id12345')?.getAttribute('name')).toBe('name');
    expect(customElement.querySelector('#id12345')?.getAttribute('quantity')).toBe('1');
  });
});
