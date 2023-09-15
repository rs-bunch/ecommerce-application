import { Dispatch } from 'redux';
import stylesheet from './loading-page.module.scss';
import { bootstrap } from '../../styles/styles';
import { RootState } from '../Store/store';
import { createElement } from '../../utils/createElement';

export default class LoadingPage extends HTMLElement {
  public $element: HTMLElement | null;

  private $loader: HTMLElement | null;

  constructor() {
    super();
    this.$element = createElement('div', 'loader-wrapper', []);
    this.$loader = createElement('div', 'loader', []);
    if (this.$loader) this.$element?.append(this.$loader);
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet, bootstrap];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'location') {
      this.style.display = newValue === 'loading' ? '' : 'none';
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
    return ['name'];
  }
}
