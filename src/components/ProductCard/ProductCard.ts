import { LineItem } from '@commercetools/platform-sdk';
import ElementHTML from './product-card.html';
import createFragmentFromHTML from '../../utils/createFragmentFromHTML';
import { productCard } from '../../styles/styles';
import type { RootState, AppDispatch } from '../Store/store';
import { changeLocation } from '../Store/slices/locationSlice';
import { addLineItem } from '../Store/slices/cartSlice';
import type { LineItemPayload } from '../../dto/types';

export default class ProductCard extends HTMLElement {
  private $element: DocumentFragment;

  private $productImage: HTMLElement | null;

  private $productName: HTMLElement | null;

  private $productBrand: HTMLElement | null;

  private $productPrice: HTMLElement | null;

  private $productDesc: HTMLElement | null;

  private $cartBtn: HTMLElement | null;

  private addLineItem: ((payload: LineItemPayload) => void) | undefined;

  private productId = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createFragmentFromHTML(ElementHTML);

    this.$productImage = this.$element.querySelector('#product-image');
    this.$productName = this.$element.querySelector('#product-name');
    this.$productBrand = this.$element.querySelector('#product-brand');
    this.$productPrice = this.$element.querySelector('#product-price');
    this.$productDesc = this.$element.querySelector('#product-desc');
    this.$cartBtn = this.$element.querySelector('#cart-btn');

    this.$cartBtn?.addEventListener('click', (e) => {
      if (this.addLineItem) this.addLineItem({ productId: this.productId, quantity: 1, variantId: 1 });
      e.stopPropagation();
    });
  }

  public connectedCallback(): void {
    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
      this.shadowRoot.adoptedStyleSheets = [productCard];
    }
  }

  public attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    switch (attributeName) {
      case 'data-name':
        if (this.$productName) this.$productName.textContent = newValue;
        break;
      case 'data-brand':
        if (this.$productBrand) this.$productBrand.textContent = newValue;
        break;
      case 'data-discount':
        this.$productPrice?.classList.add('product-card__price_discounted');
        break;
      case 'data-desc':
        if (this.$productDesc) this.$productDesc.textContent = newValue;
        break;
      case 'data-price':
        if (this.$productPrice) this.$productPrice.textContent = newValue;
        break;
      case 'data-image':
        if (this.$productImage) this.$productImage.style.backgroundImage = `url("${newValue}")`;
        break;
      case 'data-link':
        this.productId = newValue;
        if (this.$productImage) this.$productImage.setAttribute('data-href', `/product/${newValue}`);
        break;
      case 'added-to-cart':
        if (this.$cartBtn && newValue === 'true') this.$cartBtn.style.display = 'none';
        if (this.$cartBtn && newValue === 'false') this.$cartBtn.style.display = '';
        break;
      default:
        break;
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    const { location } = newState;

    if (location !== undefined) {
      this.attributeChangedCallback('location', '', String(location));
    }

    if (oldState?.cart && oldState.cart.cart.version !== newState.cart.cart.version) {
      const lineItemId =
        newState.cart.cart.lineItems.find((item: LineItem) => item.productId === this.productId)?.id || null;
      if (lineItemId) this.attributeChangedCallback('added-to-cart', '', 'true');
      if (!lineItemId) this.attributeChangedCallback('added-to-cart', '', 'false');
    }
  }

  // redux dispath action
  private mapDispatchToProps(dispatch: AppDispatch): { [index: string]: ReturnType<AppDispatch> } {
    return {
      changeLocation: () => dispatch(changeLocation({ location: 'main' })),
      addLineItem: (payload: LineItemPayload) => dispatch(addLineItem(payload)),
    };
  }

  public static get observedAttributes(): string[] {
    return [
      'data-image',
      'data-name',
      'data-brand',
      'data-price',
      'data-discount',
      'data-desc',
      'data-link',
      'added-to-cart',
    ];
  }
}
