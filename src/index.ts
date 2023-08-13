import './bootstrap.scss';
import { connect } from 'webcomponents-redux';
import store from './components/Store/store';
import Router from './components/Router/Router';
import CustomOverlay from './components/Overlay/Overlay';
import ShopHeader from './components/Header/Header';

const router: Router = new Router(store);
connect(CustomOverlay, store);
connect(ShopHeader, store);
window.customElements.define('custom-overlay', CustomOverlay);
customElements.define('shop-header', ShopHeader);
