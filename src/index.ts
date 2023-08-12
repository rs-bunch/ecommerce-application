import './bootstrap.scss';
import store from './components/Store/store';
import Router from './components/Router/Router';
import ShopHeader from './components/Header';
import CustomOverlay from './components/Overlay';

const router = new Router(store);
const header = new ShopHeader();
const overlay = new CustomOverlay();
const body = document.querySelector('body');

if (body) {
  if (overlay.$element) body.appendChild(overlay);
  if (header.$element) body.appendChild(header);
}
