import './styles/typography.scss';
import './styles/toastify.css';
import './index.scss';
import { connect } from 'webcomponents-redux';
import { bootstrap } from './styles/styles';
import store from './components/Store/store';
import Router from './components/Router/Router';
import CustomOverlay from './components/Overlay/Overlay';
import ShopHeader from './components/Header/Header';
import Page404 from './components/Page404/Page404';
import StartPage from './components/StartPage/StartPage';
import FavouriteItems from './components/FavouriteItems/FavouriteItems';
import Cart from './components/Cart/Cart';
import ProfilePage from './components/Profile/ProfilePage';
import AuthPage from './components/AuthPage/AuthPage';
import SignupForm from './components/SignupForm/SignupForm';
import LoginForm from './components/LoginForm/LoginForm';
import LocalStorage from './components/LocalStorage/LocalStorage';
import ProductDetails from './components/ProductDetails/ProductDetails';
import LoadingPage from './components/LoadingPage/LoadingPage';
import ProductList from './components/ProductList/ProductList';
import ProductPage from './components/ProductsPage/ProductsPage';
import Breadcrumb from './components/BreadcrumbNavigation/BreadcrumbNavigation';

document.adoptedStyleSheets = [bootstrap];

const localStoarge = new LocalStorage();
const router: Router = new Router(store, localStoarge);

window.addEventListener('beforeunload', () => {
  localStoarge.saveState(store.getState());
});

customElements.define('breadcrumb-nav', Breadcrumb);

connect(CustomOverlay, store);
customElements.define('custom-overlay', CustomOverlay);

connect(ShopHeader, store);
customElements.define('nav-element', ShopHeader);

connect(Page404, store);
customElements.define('error-element', Page404);

connect(StartPage, store);
customElements.define('start-page', StartPage);

connect(FavouriteItems, store);
customElements.define('favourite-items', FavouriteItems);

connect(Cart, store);
customElements.define('cart-element', Cart);

connect(ProfilePage, store);
customElements.define('profile-page', ProfilePage);

connect(AuthPage, store);
customElements.define('auth-page', AuthPage);

connect(LoginForm, store);
customElements.define('login-form', LoginForm);

connect(SignupForm, store);
customElements.define('signup-form', SignupForm);

connect(ProductDetails, store);
customElements.define('product-details', ProductDetails);

connect(LoadingPage, store);
customElements.define('loading-element', LoadingPage);

connect(ProductList, store);
customElements.define('product-list', ProductList);

connect(ProductPage, store);
customElements.define('product-page', ProductPage);
