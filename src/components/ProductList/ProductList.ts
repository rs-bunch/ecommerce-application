import ElementHTML from './product-list.html';
import { createElementFromHTML } from '../../utils/createElementFromHTML';

import type { RootState, AppDispatch } from '../Store/store';
import { changeLocation } from '../Store/locationSlice';

import { getProducts } from '../Store/productListSlice';

export default class ProductList extends HTMLElement {
  private $element: HTMLElement | null;

  private changeLocation: (() => void) | undefined;

  private getProducts: ((payload: { categoryId: string }) => void) | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createElementFromHTML(ElementHTML);

    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
      //   this.shadowRoot.adoptedStyleSheets = [login, bootstrap];
    }
  }

  public connectedCallback(): void {
    if (this.getProducts)
      this.getProducts({
        categoryId: 'categories.id:subtree("94038ccd-10f8-4ccc-a616-cfa5438bcc9a")',
      });
  }

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {}

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
      getProducts: (payload: { categoryId: string }) => dispatch(getProducts(payload)),
    };
  }
}
