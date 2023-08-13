
import { bootstrap } from './styles/styles';
import store from './components/Store/store';
import Router from './components/Router/Router';

document.adoptedStyleSheets = [bootstrap];

const router = new Router(store);

import Login from './components/login/login';

customElements.define('login-form', Login);

document.body.append(document.createElement('login-form'));

