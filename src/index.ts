import './bootstrap.scss';
import store from './components/Store/store';
import Router from './components/Router/Router';
import ShopHeader from './components/Header';
import CustomOverlay from './components/Overlay';

const router: Router = new Router(store);
const overlay: CustomOverlay = new CustomOverlay();
const header: ShopHeader = new ShopHeader();
const body = document.querySelector('body') as HTMLElement;

if (overlay.$element) body.appendChild(overlay);
if (header.$element) body.appendChild(header);
