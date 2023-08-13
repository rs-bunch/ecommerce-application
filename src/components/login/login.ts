import '../../assets/images/Google.svg';

import ElementHTML from './login.html';
import { createElementFromHTML } from '../../utils/create-element';

export default class Login extends HTMLElement {
  private $element: HTMLElement | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createElementFromHTML(ElementHTML);
  }

  public connectedCallback(): void {
    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
    }
  }
}
