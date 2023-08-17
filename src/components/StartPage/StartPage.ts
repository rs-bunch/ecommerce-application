import { Dispatch } from 'redux';
import ElementHTML from './index.html';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import stylesheet from './styles.module.scss';
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

  private attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void {
    if (attributeName === 'location') {
      if (newValue) {
        this.$element?.setAttribute('location', newValue);
        this.$men?.setAttribute('location', newValue);
        this.$women?.setAttribute('location', newValue);
      }
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    if (!oldState) return;
    if (oldState.location.location !== newState.location.location)
      this.attributeChangedCallback('location', oldState.location.location, newState.location.location);
  }

  // redux dispath action
  private mapDispatchToProps(dispatch: Dispatch): { [index: string]: () => ReturnType<Dispatch> } {
    return {
      action: () => dispatch({ type: 'ACTION' }),
    };
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['location'];
  }
}
