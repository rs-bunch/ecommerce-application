import type { LineItem } from '@commercetools/platform-sdk';
import { Dispatch } from 'redux';
import ElementHTML from './cart.html';
import stylesheet from './cart.module.scss';
import { bootstrap } from '../../styles/styles';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import createFragmentFromHTML from '../../utils/createFragmentFromHTML';
import { RootState } from '../Store/store';
import BreadcrumbElement from './BreadcrumbElement/BreadcrumbElement';

customElements.define('breadcrumb-element', BreadcrumbElement);

type CreateElementFromObjOptions = {
  tag: string;
  classList?: string[];
  attributes?: { [name: string]: string };
  children?: CreateElementFromObjOptions[];
};

const createElementFomObj = (options: CreateElementFromObjOptions): HTMLElement => {
  const $element = document.createElement(options.tag);

  if (options?.classList) $element.classList.add(...options.classList);

  if (options?.attributes)
    Object.entries(options.attributes).forEach(([key, value]) => $element.setAttribute(key, value));

  if (options?.children?.length)
    options.children.forEach((childElementOptions) => $element.appendChild(createElementFomObj(childElementOptions)));

  return $element;
};

export default class Cart extends HTMLElement {
  // public $element: HTMLElement | null;

  private $element: DocumentFragment;

  private $cartItems: HTMLElement | null;

  // public node: Node | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$cartItems = this.$element.querySelector('#cart-items');

    // this.node = createNodeFromHtml(ElementHTML);
    // if (this.node && this.node.firstChild instanceof HTMLElement) this.$element = this.node.firstChild;
    // else this.$element = null;
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
            size: `${lineItem.variant.attributes?.find((attr) => attr.name === 'Size')?.value}` || 'Deafult',
            color: `${lineItem.variant.attributes?.find((attr) => attr.name === 'Color')?.value}` || 'Deafult',
            quantity: `${lineItem.quantity}`,
            'regular-price': `${lineItem.price.value.centAmount}`,
            'discounted-price': `${lineItem.price.discounted?.value.centAmount || ''}`,
            'subtotal-price': `${lineItem.totalPrice.centAmount}`,
          },
        },
      ],
    };

    const $lineRow = createElementFomObj(lineRowOptions);
    return $lineRow;
  }

  private render(lineItems: LineItem[]): void {
    if (this.$cartItems) this.$cartItems.innerHTML = '';

    if (lineItems.length) {
      lineItems.forEach((lineItem) => {
        if (this.$cartItems) this.$cartItems.appendChild(this.createCartItem(lineItem));
      });
    }
    // if (!lineItems.length) {}
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
    if (oldState.cart.cart.version !== newState.cart.cart.version) this.render(newState.cart.cart.lineItems);
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
