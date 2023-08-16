import { Dispatch } from 'redux';
import ElementHTML from './index.html';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import { StateLocation } from '../../types';
import stylesheet from './StartPage.module.scss';
import { bootstrap } from '../../styles/styles';

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
      console.log(this.$men, this.$women);
      console.log(oldValue, newValue);
      if (newValue) {
        this.$men?.setAttribute('location', newValue);
        this.$women?.setAttribute('location', newValue);
      }
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: StateLocation, newState: StateLocation): void {
    console.log(oldState, newState);
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
