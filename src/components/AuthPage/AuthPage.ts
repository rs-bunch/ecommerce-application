import createFragmentFromHTML from '../../utils/createFragmentFromHTML';
import type { RootState } from '../Store/store';
import ElementHTML from './auth-page.html';
import authStyleSheet from './auth-page.module.scss';
import '../../assets/images/signup-promo.png';
import '../../assets/images/login-promo.png';

export default class extends HTMLElement {
  private $element: DocumentFragment;

  private $image: HTMLElement | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);

    this.$image = this.$element.querySelector('#auth-image');
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [authStyleSheet];
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'location') {
      this.style.display = newValue === 'signup' || newValue === 'login' ? '' : 'none';
      if (newValue === 'signup' && this.$image?.style)
        this.$image.style.backgroundImage = `url('../../assets/images/signup-promo.png')`;
      if (newValue === 'login' && this.$image?.style)
        this.$image.style.backgroundImage = `url('../../assets/images/login-promo.png')`;
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    const { location } = newState.location;
    if (location !== undefined) {
      this.attributeChangedCallback('location', '', String(location));
    }
  }

  private static get observedAttributes(): string[] {
    return ['name', 'location'];
  }
}
