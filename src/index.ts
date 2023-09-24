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
import ProductDetails from './components/ProductDetails/ProductDetails';
import LoadingPage from './components/LoadingPage/LoadingPage';
import ProductList from './components/ProductList/ProductList';
import ProductsFilter from './components/ProductsFilter/ProductsFilter';
import ProductPagination from './components/ProductPagination/ProductPagination';
import ProductPage from './components/ProductsPage/ProductsPage';
import Breadcrumb from './components/BreadcrumbNavigation/BreadcrumbNavigation';
import AboutUs from './components/AboutUs/AboutUs';
import CartItem from './components/Cart/CartItem/CartItem';
import ProductCard from './components/ProductCard/ProductCard';

document.adoptedStyleSheets = [bootstrap];

const router: Router = new Router(store);

connect(ProductCard, store);
customElements.define('product-card', ProductCard);

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

connect(ProductsFilter, store);
customElements.define('products-filter', ProductsFilter);

connect(ProductPagination, store);
customElements.define('product-pagination', ProductPagination);

connect(ProductPage, store);
customElements.define('product-page', ProductPage);

connect(AboutUs, store);
customElements.define('about-us', AboutUs);

connect(CartItem, store);
customElements.define('cart-item', CartItem);
