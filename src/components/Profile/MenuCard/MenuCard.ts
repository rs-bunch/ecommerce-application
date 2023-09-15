import ElementHTML from './menu-card.html';
import stylesheet from './menu-card.module.scss';
import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';
import { logoutBindAction } from '../../Store/store';

export default class extends HTMLElement {
  private $element: DocumentFragment;

  private $firstName: HTMLSpanElement | null;

  private $logout: HTMLLIElement | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$firstName = this.$element.querySelector('#first-name');
    this.$logout = this.$element.querySelector('#logout');

    this.$logout?.addEventListener('click', (e) => this.handleLogout(e));
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'first-name' && this.$firstName) this.$firstName.innerText = newValue;
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['first-name'];
  }

  private handleLogout(e: Event): void {
    if (e.target instanceof HTMLElement && e.target.closest('li')) console.log(e.target);
    logoutBindAction();
  }
}
