import { ProductProjection, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import ElementHTML from './product-list.html';
import { createElementFromHTML } from '../../utils/createElementFromHTML';
import type { RootState, AppDispatch } from '../Store/store';
import { changeLocation } from '../Store/slices/locationSlice';
import { getProducts } from '../Store/slices/productListSlice';
// import ProductCard from '../ProductCard/ProductCard';
import productsContainer from './product-list.module.scss';
import { getCategoriesPath } from '../Api/rest/productList';
import Breadcrumb from '../BreadcrumbNavigation/BreadcrumbNavigation';
import { CartState } from '../../dto/types';

const LOCALE_STRING = 'en-US';

export default class ProductList extends HTMLElement {
  private $element: HTMLElement | null;

  private changeLocation: (() => void) | undefined;

  private getProducts: ((payload: { categoryId: string }) => void) | undefined;

  private cartState: CartState | undefined;

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

  public connectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {}

  private renderProductCards(productsData: ProductProjection[]): void {
    // console.log(productsData, 'render');

    if (!this.shadowRoot) return;
    const cards = this.querySelectorAll('[slot="cards-slot"]');
    for (let i = 0; i < cards.length; i += 1) {
      cards[i].remove();
    }

    for (let i = 0; i < productsData.length; i += 1) {
      const product = productsData[i];
      const card = document.createElement('product-card');
      const imagesObj = product.masterVariant.images;
      if (!imagesObj) return;

      const { id } = productsData[i];
      const imageUrl = imagesObj[0].url;
      const name = product.name[LOCALE_STRING];
      if (!product.metaTitle) return;
      const brand = product.masterVariant.attributes?.find((atr) => atr.name === 'Brand')?.value as string | undefined;
      if (!product.masterVariant.prices) return;
      const price = product.masterVariant.prices[0].value.centAmount / 100;
      let discount = null;
      if (product.masterVariant.prices[0].discounted) {
        discount = product.masterVariant.prices[0].discounted.value.centAmount / 100;
      }
      const { description } = product;
      if (description) {
        if (!card.shadowRoot) return;
        card.setAttribute('data-desc', description[LOCALE_STRING]);
      }

      card.setAttribute('slot', 'cards-slot');

      card.setAttribute('data-link', id);
      card.setAttribute('data-image', imageUrl);
      card.setAttribute('data-name', name);

      if (brand) card.setAttribute('data-brand', brand);

      if (discount) {
        card.setAttribute('data-price', `${discount}$`);
        if (!card.shadowRoot) return;
        const priceField = card.shadowRoot.querySelector('.product-card__price');
        if (priceField) priceField.setAttribute('data-discount', `${price}$`);
      } else {
        card.setAttribute('data-price', `${price}$`);
      }
      if (this.cartState?.cart) {
        // id => productId
        const lineItemId = this.cartState.cart.lineItems.find((item) => item.productId === id)?.id || null;
        card.setAttribute('added-to-cart', `${lineItemId ? 'true' : 'false'}`);
      }

      this.append(card);
    }
  }

  private renderNavigation(id: string): void {
    getCategoriesPath(id, LOCALE_STRING).then((res) => {
      const breadcrumb = new Breadcrumb(res, 'productList');
      this.shadowRoot?.querySelector('breadcrumb-nav')?.remove();
      this.shadowRoot?.querySelector('.wrapper')?.append(breadcrumb);
    });
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    if (oldState?.cart && oldState.cart.cart.version !== newState.cart.cart.version) {
      this.cartState = newState.cart;
    }

    const { location, productList } = newState;
    const { products } = productList;
    // console.log('productList', productList);
    if (location !== undefined) {
      this.attributeChangedCallback('location', '', String(location));
    }
    if (productList.id) this.renderNavigation(productList.id as string);
    if (products) {
      console.log('products render');
      this.renderProductCards((products as ProductProjectionPagedSearchResponse).results);
    }
  }

  // redux dispath action
  private mapDispatchToProps(dispatch: AppDispatch): { [index: string]: ReturnType<AppDispatch> } {
    return {
      changeLocation: () => dispatch(changeLocation({ location: 'main' })),
      getProducts: (payload: { categoryId: string; page: number }) => dispatch(getProducts(payload)),
    };
  }
}
