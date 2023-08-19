/**
 * @jest-environment jsdom
 */
import '../styles/vars.scss';
import '../styles/mixins.scss';
import Cart from '../components/Cart/Cart';
import FavouriteItems from '../components/FavouriteItems/FavouriteItems';
import ShopHeader from '../components/Header/Header';
import CustomOverlay from '../components/Overlay/Overlay';
import MyAccount from '../components/Profile/Profile';
import StartPage from '../components/StartPage/StartPage';
import Login from '../components/login/Login';
import TestUtils from './utils/test-utils';
import Page404 from '../components/Page404/Page404';

customElements.define('custom-overlay', CustomOverlay);
customElements.define('nav-element', ShopHeader);
customElements.define('login-form', Login);
customElements.define('start-page', StartPage);
customElements.define('favourite-items', FavouriteItems);
customElements.define('cart-element', Cart);
customElements.define('account-element', MyAccount);
customElements.define('error-element', Page404);

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
