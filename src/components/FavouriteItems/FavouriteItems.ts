import ElementHTML from './favourite-items.html';
import stylesheet from './favourite-items.module.scss';
import { bootstrap } from '../../styles/styles';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import { RootState } from '../Store/store';

export default class FavouriteItems extends HTMLElement {
  public $element: HTMLElement | null;

  public node: Node | null;

  constructor() {
    super();
    this.node = createNodeFromHtml(ElementHTML);
    if (this.node && this.node.firstChild instanceof HTMLElement) this.$element = this.node.firstChild;
    else this.$element = null;
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet, bootstrap];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'location') {
      this.style.display = newValue === 'favourites' ? '' : 'none';
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
    return ['name'];
  }
}
