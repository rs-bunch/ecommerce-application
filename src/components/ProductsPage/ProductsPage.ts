import elementHTML from './products-page.html';
import { createElementFromHTML } from '../../utils/createElementFromHTML';
import productPage from './products-page.module.scss';

export default class ProductPage extends HTMLElement {
  private $element: HTMLElement | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createElementFromHTML(elementHTML);

    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
      this.shadowRoot.adoptedStyleSheets = [productPage];
    }
  }
}
