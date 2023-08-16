import { bootstrap } from './styles/styles';
import store from './components/Store/store';
import Router from './components/Router/Router';
import Login from './components/login/Login';

document.adoptedStyleSheets = [bootstrap];

const router = new Router(store);

customElements.define('login-form', Login);

document.body.append(document.createElement('login-form'));
