import ElementHTML from './overlay.html';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import stylesheet from './overlay.module.scss';

export default class CustomOverlay extends HTMLElement {
  public $element: HTMLElement | null;

  private node: Node | null;

  constructor() {
    super();
    this.node = createNodeFromHtml(ElementHTML);
    if (this.node?.firstChild instanceof HTMLElement) this.$element = this.node.firstChild;
    else this.$element = null;
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.node) this.shadowRoot?.append(this.node);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet];
    this.setAttribute('active', 'false');
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'active') {
      this.style.display = newValue === 'true' ? '' : 'none';
    }
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['active'];
  }
}
