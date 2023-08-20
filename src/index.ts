import './styles/typography.scss';
import './styles/toastify.css';
import './index.scss';
import { connect } from 'webcomponents-redux';
import { bootstrap } from './styles/styles';
import store from './components/Store/store';
import Router from './components/Router/Router';
import CustomOverlay from './components/Overlay/Overlay';
import ShopHeader from './components/Header/Header';

import LoginForm from './components/Login/Login';
import Page404 from './components/Page404/Page404';
import StartPage from './components/StartPage/StartPage';
import FavouriteItems from './components/FavouriteItems/FavouriteItems';
import Cart from './components/Cart/Cart';
import MyAccount from './components/Profile/Profile';

document.adoptedStyleSheets = [bootstrap];

const router: Router = new Router(store);

connect(CustomOverlay, store);
customElements.define('custom-overlay', CustomOverlay);

connect(ShopHeader, store);
customElements.define('nav-element', ShopHeader);

connect(LoginForm, store);
customElements.define('login-form', LoginForm);

connect(Page404, store);
customElements.define('error-element', Page404);

connect(StartPage, store);
customElements.define('start-page', StartPage);

connect(FavouriteItems, store);
customElements.define('favourite-items', FavouriteItems);

connect(Cart, store);
customElements.define('cart-element', Cart);

connect(MyAccount, store);
customElements.define('account-element', MyAccount);
