import type { LineItem } from '@commercetools/platform-sdk';
import { Dispatch } from 'redux';
import ElementHTML from './cart.html';
import stylesheet from './cart.module.scss';
import { bootstrap } from '../../styles/styles';
import createFragmentFromHTML from '../../utils/createFragmentFromHTML';
import {
  type RootState,
  deleteCartBindAction,
  addDiscountCodeBindAction,
  removeDiscountCodeBindAction,
} from '../Store/store';
import BreadcrumbElement from './BreadcrumbElement/BreadcrumbElement';
import type { CartState } from '../../dto/types';

customElements.define('breadcrumb-element', BreadcrumbElement);

type CreateElementFromObjOptions = {
  tag: string;
  classList?: string[];
  attributes?: { [name: string]: string };
  children?: CreateElementFromObjOptions[];
};

const createElementFromObj = (options: CreateElementFromObjOptions): HTMLElement => {
  const $element = document.createElement(options.tag);

  if (options?.classList) $element.classList.add(...options.classList);

  if (options?.attributes)
    Object.entries(options.attributes).forEach(([key, value]) => $element.setAttribute(key, value));

  if (options?.children?.length)
    options.children.forEach((childElementOptions) => $element.appendChild(createElementFromObj(childElementOptions)));

  return $element;
};

export default class Cart extends HTMLElement {
  private $element: DocumentFragment;

  private $cartItems: HTMLElement | null;

  private $subtotalPrice: HTMLElement | null;

  private $totalPrice: HTMLElement | null;

  private $cartEmpty: HTMLElement | null;

  private $cartList: HTMLElement | null;

  private $cartAuth: HTMLElement | null;

  private $loginMessage: HTMLElement | null;

  private $clearCart: HTMLButtonElement | null;

  private $confirmClear: HTMLButtonElement | null;

  private $couponInput: HTMLInputElement | null;

  private $applyCouponButton: HTMLButtonElement | null;

  private $removeDiscount: HTMLElement | null;

  private discountId = '';

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$cartItems = this.$element.querySelector('#cart-items');
    this.$subtotalPrice = this.$element.querySelector('#subtotal-price');
    this.$totalPrice = this.$element.querySelector('#total-price');
    this.$cartEmpty = this.$element.querySelector('#cart-empty');
    this.$cartList = this.$element.querySelector('#cart-list');
    this.$cartAuth = this.$element.querySelector('#cart-auth');
    this.$loginMessage = this.$element.querySelector('#login-message');
    this.$couponInput = this.$element.querySelector('#coupon-input');

    this.$clearCart = this.$element.querySelector('#clear-cart');
    this.$clearCart?.addEventListener('click', () => this.clearCartHandle());

    this.$confirmClear = this.$element.querySelector('#confirm-clear');
    this.$confirmClear?.addEventListener('click', () => this.confirmClearHandle());

    this.$applyCouponButton = this.$element.querySelector('#apply-coupon');
    this.$applyCouponButton?.addEventListener('click', () => this.applyCouponHandler());

    this.$removeDiscount = this.$element.querySelector('#remove-discount');
    this.$removeDiscount?.addEventListener('click', () => this.removeDiscountHandler());

    document.addEventListener('click', (e) => {
      if (e.composedPath()[0] !== this.$clearCart && e.composedPath()[0] !== this.$confirmClear) {
        if (this.$clearCart) this.$clearCart.style.display = 'block';
        if (this.$confirmClear) this.$confirmClear.style.display = 'none';
      }
    });
  }

  private applyCouponHandler(): void {
    const code = this.$couponInput?.value || '';
    if (code) addDiscountCodeBindAction({ code });
  }

  private removeDiscountHandler(): void {
    removeDiscountCodeBindAction({ id: this.discountId });
  }

  private clearCartHandle(): void {
    if (this.$clearCart) this.$clearCart.style.display = 'none';
    if (this.$confirmClear) this.$confirmClear.style.display = 'block';
  }

  private confirmClearHandle(): void {
    deleteCartBindAction();
  }

  private createCartItem(lineItem: LineItem): HTMLElement {
    const lineRowOptions: CreateElementFromObjOptions = {
      tag: 'div',
      children: [
        {
          tag: 'cart-item',
          attributes: {
            id: lineItem.id,
            name: lineItem.name['en-US'],
            image: `${
              lineItem.variant.images?.length
                ? lineItem.variant.images[0].url
                : '/assets/images/placeholder-105x120.png'
            }`,
            size: `${lineItem.variant.attributes?.find((attr) => attr.name === 'Size')?.value}` || 'Default',
            color: `${lineItem.variant.attributes?.find((attr) => attr.name === 'Color')?.value}` || 'Default',
            quantity: `${lineItem.quantity}`,
            'regular-price': `${lineItem.price.value.centAmount}`,
            'discounted-price': `${lineItem.price.discounted?.value.centAmount || ''}`,
            'subtotal-price': `${lineItem.totalPrice.centAmount}`,
          },
        },
      ],
    };

    const $lineRow = createElementFromObj(lineRowOptions);
    return $lineRow;
  }

  private render(cartState: CartState): void {
    if (this.$cartItems) this.$cartItems.innerHTML = '';

    if (this.$clearCart) this.$clearCart.style.display = 'block';
    if (this.$confirmClear) this.$confirmClear.style.display = 'none';

    if (cartState.cart.lineItems.length) {
      cartState.cart.lineItems.forEach((lineItem) => {
        if (this.$cartItems) this.$cartItems.appendChild(this.createCartItem(lineItem));
      });

      if (this.$subtotalPrice) {
        const subtotalPrice = cartState.cart.lineItems.reduce(
          (acc, el) => acc + Number(el.price.value.centAmount) * Number(el.quantity),
          0
        );
        this.$subtotalPrice.innerText = `$${(subtotalPrice / 100).toFixed(2)}`;
      }

      if (this.$totalPrice)
        this.$totalPrice.innerText = `$${(Number(cartState.cart.totalPrice.centAmount) / 100).toFixed(2)}`;

      if (this.$cartList && this.$cartList.style.display === 'none') this.$cartList.style.display = '';
      if (this.$cartEmpty && this.$cartEmpty.style.display !== 'none') this.$cartEmpty.style.display = 'none';
      if (this.$cartAuth && this.$cartAuth.style.display !== 'flex') this.$cartAuth.style.display = 'flex';
    }

    if (!cartState.cart.lineItems.length) {
      if (this.$cartList && this.$cartList.style.display !== 'none') this.$cartList.style.display = 'none';
      if (this.$cartEmpty && this.$cartEmpty.style.display !== 'flex') this.$cartEmpty.style.display = 'flex';
      if (this.$cartAuth && this.$cartAuth.style.display !== 'none') this.$cartAuth.style.display = 'none';
    }
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet, bootstrap];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    switch (attributeName) {
      case 'location':
        this.style.display = newValue === 'cart' ? '' : 'none';
        break;
      default:
        break;
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    if (!oldState) return;
    if (oldState.cart.cart.version !== newState.cart.cart.version) {
      if (this.$loginMessage) this.$loginMessage.style.display = newState.auth.id ? 'none' : 'inline';
      this.render(newState.cart);
    }
    if (oldState.location.location !== newState.location.location)
      this.attributeChangedCallback('location', oldState.location.location, newState.location.location);

    if (oldState.cart.cart.discountCodes.length !== newState.cart.cart.discountCodes.length) {
      if (newState.cart.cart.discountCodes.length) {
        this.discountId = newState.cart.cart.discountCodes[0].discountCode.id;
      }
      if (this.$removeDiscount)
        this.$removeDiscount.style.display = newState.cart.cart.discountCodes.length ? 'flex' : 'none';
    }
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

export { createElementFromObj };
