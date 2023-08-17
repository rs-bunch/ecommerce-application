import './styles/typography.scss';
import { connect } from 'webcomponents-redux';
import { bootstrap } from './styles/styles';
import store from './components/Store/store';
import Router from './components/Router/Router';
import CustomOverlay from './components/Overlay/Overlay';
import ShopHeader from './components/Header/Header';
import Login from './components/login/Login';
import StartPage from './components/StartPage/StartPage';
import FavouriteItems from './components/FavouriteItems/FavouriteItems';
import Cart from './components/Cart/Cart';

document.adoptedStyleSheets = [bootstrap];
const router: Router = new Router(store);

connect(CustomOverlay, store);
customElements.define('custom-overlay', CustomOverlay);

connect(ShopHeader, store);
customElements.define('nav-element', ShopHeader);

connect(Login, store);
customElements.define('login-form', Login);

connect(StartPage, store);
customElements.define('start-page', StartPage);

connect(FavouriteItems, store);
customElements.define('favourite-items', FavouriteItems);

connect(Cart, store);
customElements.define('cart-element', Cart);
