import { bootstrap } from './styles/styles';
import store from './components/Store/store';
import Router from './components/Router/Router';

document.adoptedStyleSheets = [bootstrap];

const router = new Router(store);
