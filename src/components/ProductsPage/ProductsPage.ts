import elementHTML from './products-page.html';
import { createElementFromHTML } from '../../utils/createElementFromHTML';
import productPage from './products-page.module.scss';
import type { RootState, AppDispatch } from '../Store/store';
import { changeLocation } from '../Store/locationSlice';

export default class ProductPage extends HTMLElement {
  private $element: HTMLElement | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createElementFromHTML(elementHTML);

    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
      this.shadowRoot.adoptedStyleSheets = [productPage];
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    const { location } = newState.location;
    if (location !== undefined) {
      this.attributeChangedCallback('location', '', String(location));
    }
  }

  // redux dispath action
  private mapDispatchToProps(dispatch: AppDispatch): { [index: string]: ReturnType<AppDispatch> } {
    return {
      changeLocation: () => dispatch(changeLocation({ location: 'main' })),
    };
  }

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (!this.$element) return;
    if (attributeName === 'location') {
      this.style.display = newValue === 'products' ? '' : 'none';
    }
  }
}
