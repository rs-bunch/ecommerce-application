import './styles/typography.scss';
import { connect } from 'webcomponents-redux';
import { bootstrap } from './styles/styles';
import store from './components/Store/store';
import Router from './components/Router/Router';
import CustomOverlay from './components/Overlay/Overlay';
import ShopHeader from './components/Header/Header';

document.adoptedStyleSheets = [bootstrap];

const router: Router = new Router(store);

connect(CustomOverlay, store);
customElements.define('custom-overlay', CustomOverlay);

connect(ShopHeader, store);
customElements.define('nav-element', ShopHeader);
