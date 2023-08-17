import { Dispatch } from 'redux';
import ElementHTML from './index.html';
import stylesheet from './styles.module.scss';
import { bootstrap } from '../../styles/styles';
import { LocationState } from '../../types';
import createNodeFromHtml from '../../utils/createNodeFromHtml';

export default class MyAccount extends HTMLElement {
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

  private attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void {
    if (attributeName === 'location') {
      if (newValue) this.$element?.setAttribute('location', newValue);
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: LocationState, newState: LocationState): void {
    if (!oldState) return;
    if (oldState.location !== newState.location)
      this.attributeChangedCallback('location', oldState.location, newState.location);
  }

  // redux dispath action
  private mapDispatchToProps(dispatch: Dispatch): { [index: string]: () => ReturnType<Dispatch> } {
    return {
      action: () => dispatch({ type: 'ACTION' }),
    };
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['name'];
  }
}
