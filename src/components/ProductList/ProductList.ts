import { ProductProjection, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import ElementHTML from './product-list.html';
import { createElementFromHTML } from '../../utils/createElementFromHTML';
import type { RootState, AppDispatch } from '../Store/store';
import { changeLocation } from '../Store/locationSlice';
import { getProducts } from '../Store/productListSlice';
import ProductCard from '../ProductCard/ProductCard';

import productsContainer from './product-list.module.scss';

customElements.define('product-card', ProductCard);

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
      this.shadowRoot.adoptedStyleSheets = [productsContainer];
    }
  }

  public connectedCallback(): void {
    if (this.getProducts)
      this.getProducts({
        categoryId: 'categories.id:subtree("94038ccd-10f8-4ccc-a616-cfa5438bcc9a")',
      });
  }

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (!this.$element) return;
    switch (attributeName) {
      case 'location':
        this.style.display = '';
        break;
      default:
        this.style.display = 'none';
        break;
    }
  }

  private renderProductCards(productsData: ProductProjection[]): void {
    const slot = document.createElement('slot');
    slot.setAttribute('name', 'cards-slot');

    if (!this.shadowRoot) return;
    const container = this.shadowRoot.querySelector('.products-container');
    container?.appendChild(slot);

    for (let i = 0; i < productsData.length; i += 1) {
      const product = productsData[i];
      const card = document.createElement('product-card');

      const imagesObj = product.masterVariant.images;
      if (!imagesObj) return;

      const imageUrl = imagesObj[0].url;
      const name = product.name['en-US'];
      if (!product.metaTitle) return;
      const brand = product.metaTitle['en-US'];
      if (!product.masterVariant.prices) return;
      const price = product.masterVariant.prices[0].value.centAmount / 100;
      let discount = null;
      if (product.masterVariant.prices[0].discounted) {
        discount = product.masterVariant.prices[0].discounted.value.centAmount / 100;
      }

      card.setAttribute('slot', 'cards-slot');

      card.setAttribute('data-image', imageUrl);
      card.setAttribute('data-name', name);
      card.setAttribute('data-brand', brand);

      if (discount) {
        card.setAttribute('data-price', `${discount}$`);
        if (!card.shadowRoot) return;
        const priceField = card.shadowRoot.querySelector('.product-card__price');
        if (priceField) priceField.setAttribute('data-discount', `${price}$`);
      } else {
        card.setAttribute('data-price', `${price}$`);
      }

      this.append(card);
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    const { location } = newState.location;
    const { products } = newState.productList;
    if (location !== undefined) {
      this.attributeChangedCallback('location', '', String(location));
    }
    if (products) {
      this.renderProductCards((products as ProductProjectionPagedSearchResponse).results);
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
