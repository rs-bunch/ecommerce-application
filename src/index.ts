import './styles/typography.scss';
import './styles/toastify.css';
import './index.scss';
import { connect } from 'webcomponents-redux';
import { bootstrap } from './styles/styles';
import store from './components/Store/store';
import Router from './components/Router/Router';
import CustomOverlay from './components/Overlay/Overlay';
import ShopHeader from './components/Header/Header';
import Login from './components/login/Login';
import Page404 from './components/Page404/Page404';

document.adoptedStyleSheets = [bootstrap];

const router: Router = new Router(store);

connect(CustomOverlay, store);
customElements.define('custom-overlay', CustomOverlay);

connect(ShopHeader, store);
customElements.define('nav-element', ShopHeader);

customElements.define('login-form', Login);

connect(Page404, store);
customElements.define('error-element', Page404);
