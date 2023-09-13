import type { LineItem } from '@commercetools/platform-sdk';
import { Dispatch } from 'redux';
import ElementHTML from './cart.html';
import stylesheet from './cart.module.scss';
import { bootstrap } from '../../styles/styles';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import { RootState } from '../Store/store';
import BreadcrumbElement from './BreadcrumbElement/BreadcrumbElement';

customElements.define('breadcrumb-element', BreadcrumbElement);

type CreateElementOptions = {
  classList?: string[];
  attrs?: { attr: string; value: string }[];
};

const createElement = (tag: string, options?: CreateElementOptions): HTMLElement => {
  const $element = document.createElement(tag);
  if (options?.classList) $element.classList.add(...options.classList);
  if (options?.attrs?.length) options.attrs.forEach((el) => $element.setAttribute(el.attr, el.value));
  return $element;
};

export default class Cart extends HTMLElement {
  public $element: HTMLElement | null;

  public node: Node | null;

  constructor() {
    super();
    this.node = createNodeFromHtml(ElementHTML);
    if (this.node && this.node.firstChild instanceof HTMLElement) this.$element = this.node.firstChild;
    else this.$element = null;
  }

  private createCartItem(lineItem: LineItem): HTMLElement {
    const $lineRow = createElement('div', { classList: ['line__row'] });
    const $lineItem = createElement('cart-item', {
      attrs: [
        {
          attr: 'id',
          value: lineItem.id,
        },
        {
          attr: 'productId',
          value: lineItem.productId,
        },
        {
          attr: 'name',
          value: `${lineItem.name}`,
        },
        // {
        //   attr: 'size',
        //   value: lineItem.variant.attributes,
        // },
      ],
    });
    $lineRow.appendChild($lineItem);
    return $lineRow;
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
