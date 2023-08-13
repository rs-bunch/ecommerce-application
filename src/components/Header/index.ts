import { connect } from 'webcomponents-redux';
import store from '../Store/store';
import ShopHeader from './Header';

connect(ShopHeader, store);
window.customElements.define('shop-header', ShopHeader);
