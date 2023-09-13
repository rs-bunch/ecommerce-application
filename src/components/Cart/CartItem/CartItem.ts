import ElementHTML from './cart-item.html';
import stylesheet from './cart-item.module.scss';
import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';
import { RootState, AppDispatch } from '../../Store/store';
// import { action } from '../Store/actoinSlice';

export default class extends HTMLElement {
  // webcomponent-redux callback action
  private action: ((payload: { [I: string]: string }) => void) | undefined;

  private $element: DocumentFragment;

  private $image: HTMLElement | null;

  private $title: HTMLElement | null;

  private $color: HTMLElement | null;

  private $size: HTMLElement | null;

  private $regularPrice: HTMLElement | null;

  private $discountedPrice: HTMLElement | null;

  private $reduceButton: HTMLButtonElement | null;

  private $increaseButton: HTMLButtonElement | null;

  private $counterValue: HTMLSpanElement | null;

  private $subtotalPrice: HTMLElement | null;

  private $actionButton: HTMLButtonElement | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$image = this.$element.querySelector('#image');
    this.$title = this.$element.querySelector('#title');
    this.$color = this.$element.querySelector('#color');
    this.$size = this.$element.querySelector('#size');
    this.$regularPrice = this.$element.querySelector('#regular-price');
    this.$discountedPrice = this.$element.querySelector('#discounted-price');
    this.$reduceButton = this.$element.querySelector('#reduce-button');
    this.$increaseButton = this.$element.querySelector('#increase-button');
    this.$counterValue = this.$element.querySelector('#counter-value');
    this.$subtotalPrice = this.$element.querySelector('#subtotal-price');
    this.$actionButton = this.$element.querySelector('#action-button');
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

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {}

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
    return ['name'];
  }
}
