import './styles/typography.scss';
import './styles/toastify.css';
import './index.scss';
import { connect } from 'webcomponents-redux';
import { bootstrap } from './styles/styles';
import store from './components/Store/store';
import Router from './components/Router/Router';
import CustomOverlay from './components/Overlay/Overlay';
import ShopHeader from './components/Header/Header';
import Login from './components/Login/Login';

document.adoptedStyleSheets = [bootstrap];

const router: Router = new Router(store);

connect(CustomOverlay, store);
customElements.define('custom-overlay', CustomOverlay);

connect(ShopHeader, store);
customElements.define('nav-element', ShopHeader);

connect(Login, store);
customElements.define('login-form', Login);

document.body.append(document.createElement('login-form'));
