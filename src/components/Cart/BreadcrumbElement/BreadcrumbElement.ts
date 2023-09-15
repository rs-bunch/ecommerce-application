import ElementHTML from './breadcrumb-element.html';
import stylesheet from './breadcrumb-element.module.scss';
import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';

export default class extends HTMLElement {
  private $element: DocumentFragment;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {}

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['name'];
  }
}
