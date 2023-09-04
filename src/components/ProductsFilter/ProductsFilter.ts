import elementHTML from './products-filter.html';
import { createElementFromHTML } from '../../utils/createElementFromHTML';
import productsFilter from './products-filter.module.scss';
import type { RootState, AppDispatch } from '../Store/store';
import { changeLocation } from '../Store/locationSlice';
import { bootstrap } from '../../styles/styles';

export default class ProductsFilter extends HTMLElement {
  private $element: HTMLElement | null;

  private $priceRange: HTMLInputElement | null;

  private $priceLabel: HTMLElement | null;

  private $sortName: HTMLElement | null;

  private $sortPrice: HTMLElement | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createElementFromHTML(elementHTML);
    this.$priceRange = this.$element.querySelector('#price-range');
    this.$priceLabel = this.$element.querySelector('#price-label');
    this.$sortName = this.$element.querySelector('#sort-name');
    this.$sortPrice = this.$element.querySelector('#sort-price');

    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
      this.shadowRoot.adoptedStyleSheets = [productsFilter, bootstrap];
    }
  }

  public connectedCallback(): void {
    if (!this.$priceRange || !this.$priceLabel) return;

    this.$priceRange.addEventListener('input', () => {
      if (!this.$priceRange || !this.$priceLabel) return;

      const val = this.$priceRange.value;
      this.$priceLabel.textContent = `${val}$`;
    });
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
      const searchParams = new URLSearchParams(window.location.search);
      const path = `${window.location.origin}${window.location.pathname}`;
      if (!searchParams.size) {
        if (!this.$sortName || !this.$sortPrice) return;
        this.$sortName.dataset.href = `${path}?sort=name.en-US&order=asc`;
        this.$sortPrice.dataset.href = `${path}?sort=price&order=asc`;
      } else if (searchParams.size) {
        if (!this.$sortName || !this.$sortPrice) return;
        const order = searchParams.get('order');
        if (!order) return;
        this.$sortName.dataset.href = `${path}?sort=name.en-US&order=${order === 'asc' ? 'desc' : 'asc'}`;
        this.$sortPrice.dataset.href = `${path}?sort=price&order=${order === 'asc' ? 'desc' : 'asc'}`;
      }
      this.style.display = newValue === 'products' ? '' : 'none';
    }
  }
}
