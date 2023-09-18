import { Dispatch } from 'redux';
import ElementHTML from './about-us.html';
import stylesheet from './about-us.module.scss';
import createFragmentFromHTML from '../../utils/createFragmentFromHTML';
import { RootState } from '../Store/store';
import { bootstrap } from '../../styles/styles';

export default class AboutUs extends HTMLElement {
  public $element: DocumentFragment;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [bootstrap, stylesheet];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void {
    if (attributeName === 'location') {
      this.style.display = newValue === 'about-us' ? '' : 'none';
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
