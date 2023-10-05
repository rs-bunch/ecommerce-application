import ElementHTML from './start-page.html';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import stylesheet from './start-page.module.scss';
import { bootstrap } from '../../styles/styles';
import { RootState } from '../Store/store';

export default class StartPage extends HTMLElement {
  public node: Node | null;

  public $element: HTMLElement | null;

  public $men: HTMLElement | null | undefined;

  public $women: HTMLElement | null | undefined;

  constructor() {
    super();
    this.node = createNodeFromHtml(ElementHTML);
    if (this.node?.firstChild instanceof HTMLElement) this.$element = this.node.firstChild;
    else this.$element = null;
    this.$men = this.$element?.querySelector('.categories_men');
    this.$women = this.$element?.querySelector('.categories_women');
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet, bootstrap];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'location') {
      this.style.display = ['main', 'men', 'women'].includes(newValue) ? '' : 'none';
      if (!this.$men || !this.$women) return;
      this.$men.style.display = newValue === 'men' ? '' : 'none';
      this.$women.style.display = newValue === 'women' ? '' : 'none';
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    if (!oldState) return;
    if (oldState.location.location !== newState.location.location)
      this.attributeChangedCallback('location', oldState.location.location, newState.location.location);
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['location'];
  }
}
