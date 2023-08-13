import { connect } from 'webcomponents-redux';
import CustomOverlay from './Overlay';
import store from '../Store/store';

connect(CustomOverlay, store);
window.customElements.define('custom-overlay', CustomOverlay);
