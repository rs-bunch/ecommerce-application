import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';
import ElementHTML from './dropdown-nav.html';
import stylesheet from './dropdown-nav.module.scss';

export default class DropdownNav extends HTMLElement {
  public $element: DocumentFragment;

  private $men: Element | null;

  private $women: Element | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$men = this.$element.querySelector('.men');
    this.$women = this.$element.querySelector('.women');
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    console.log(attributeName);
    if (attributeName === 'category')
      switch (newValue) {
        case 'men': {
          this.style.visibility = 'visible';
          this.$women?.classList.remove('visible');
          this.$men?.classList.add('visible');
          break;
        }
        case 'women': {
          this.style.visibility = 'visible';
          this.$women?.classList.add('visible');
          this.$men?.classList.remove('visible');
          break;
        }
        default: {
          this.style.visibility = 'hidden';
          this.$women?.classList.remove('visible');
          this.$men?.classList.remove('visible');
        }
      }
    if (attributeName === 'side' && newValue === 'true') {
      this.$men?.classList.add('side');
      this.$women?.classList.add('side');
    }
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['category', 'side'];
  }
}
