import ElementHTML from './cart-item.html';
import stylesheet from './cart-item.module.scss';
import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';
import { RootState, AppDispatch, changeLineItemQuantityBindAction, removeLineItemBindAction } from '../../Store/store';
// import { action } from '../Store/actoinSlice';

export default class extends HTMLElement {
  // webcomponent-redux callback action
  private action: ((payload: { [I: string]: string }) => void) | undefined;

  private $element: DocumentFragment;

  private $image: HTMLImageElement | null;

  private $title: HTMLElement | null;

  private $color: HTMLElement | null;

  private $size: HTMLElement | null;

  private $itemPrices: HTMLElement | null;

  private $reduceButton: HTMLButtonElement | null;

  private $increaseButton: HTMLButtonElement | null;

  private $counterValue: HTMLSpanElement | null;

  private $subtotalPrice: HTMLElement | null;

  private $actionButton: HTMLButtonElement | null;

  private lineItemId = '';

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$image = this.$element.querySelector('#image');
    this.$title = this.$element.querySelector('#title');
    this.$color = this.$element.querySelector('#color');
    this.$size = this.$element.querySelector('#size');
    this.$itemPrices = this.$element.querySelector('#item-prices');
    this.$reduceButton = this.$element.querySelector('#reduce-button');
    this.$increaseButton = this.$element.querySelector('#increase-button');
    this.$counterValue = this.$element.querySelector('#counter-value');
    this.$subtotalPrice = this.$element.querySelector('#subtotal-price');
    this.$actionButton = this.$element.querySelector('#action-button');

    this.$reduceButton?.addEventListener('click', () =>
      this.changeQuantityHandle(Number(this.$counterValue?.innerText) - 1)
    );
    this.$increaseButton?.addEventListener('click', () =>
      this.changeQuantityHandle(Number(this.$counterValue?.innerText) + 1)
    );
    this.$actionButton?.addEventListener('click', () => this.removeItemFromCartHandle());
  }

  private changeQuantityHandle(quantity: number): void {
    changeLineItemQuantityBindAction({ quantity, lineItemId: this.lineItemId });
  }

  private removeItemFromCartHandle(): void {
    removeLineItemBindAction({ lineItemId: this.lineItemId });
  }

  private createItemPriceElement(value: string): HTMLElement {
    const $itemPrice = document.createElement('div');
    $itemPrice.classList.add('price__value');
    $itemPrice.innerText = `$${(Number(value) / 100).toFixed(2)}`;
    return $itemPrice;
  }

  public get config(): unknown {
    return this.config;
  }

  public set config(obj: unknown) {
    this.config = obj;
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    switch (attributeName) {
      case 'id':
        this.lineItemId = newValue;
        break;
      case 'name':
        if (this.$title) this.$title.innerText = newValue;
        break;
      case 'image':
        if (this.$image) this.$image.src = newValue;
        break;
      case 'size':
        if (this.$size) this.$size.innerText = newValue;
        break;
      case 'color':
        if (this.$color) this.$color.innerText = newValue;
        break;
      case 'quantity':
        if (this.$counterValue) this.$counterValue.textContent = newValue;
        break;
      case 'regular-price':
        if (this.$itemPrices) this.$itemPrices.prepend(this.createItemPriceElement(newValue));
        break;
      case 'discounted-price':
        if (this.$itemPrices && newValue) this.$itemPrices.append(this.createItemPriceElement(newValue));
        break;
      case 'subtotal-price':
        if (this.$subtotalPrice && newValue) this.$subtotalPrice.append(this.createItemPriceElement(newValue));
        break;
      default:
        break;
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {}

  // redux dispath action
  private mapDispatchToProps(dispatch: AppDispatch): { [index: string]: ReturnType<AppDispatch> } {
    return {
      // action: (payload: { data: string }) => dispatch(action(payload)),
    };
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['id', 'name', 'image', 'size', 'color', 'quantity', 'regular-price', 'discounted-price', 'subtotal-price'];
  }
}
