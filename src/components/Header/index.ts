import { connect } from 'webcomponents-redux';
import { Dispatch } from 'redux';
import ElementHTML from './index.html';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import store from '../Store/store';
import { StateLocation } from '../../types';

export default class ShopHeader extends HTMLElement {
  public $element: HTMLElement | null;

  private node: Node | null;

  public $favBtn: HTMLElement | null | undefined;

  public $profileBtn: HTMLElement | null | undefined;

  public $cartBtn: HTMLElement | null | undefined;

  public $loginDropdown: HTMLElement | null | undefined;

  constructor() {
    super();
    this.node = createNodeFromHtml(ElementHTML);
    if (this.node?.firstChild instanceof HTMLElement) this.$element = this.node.firstChild;
    else this.$element = null;
    this.$favBtn = this.$element?.querySelector('.button.fav');
    this.$profileBtn = this.$element?.querySelector('.button.profile');
    this.$cartBtn = this.$element?.querySelector('.button.cart');
    this.$loginDropdown = this.$element?.querySelector('.login-dropdown');
    this.initButtons();
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element && this.node) this.shadowRoot?.append(this.node);
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string): void {}

  private mapStateToProps(oldState: StateLocation, newState: StateLocation): void {}

  private mapDispatchToProps(dispatch: Dispatch): { [index: string]: () => ReturnType<Dispatch> } {
    return {
      action: () => dispatch({ type: 'ACTION' }),
    };
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['auth'];
  }

  private initButtons(): void {
    this.$profileBtn?.addEventListener('click', () => this.$loginDropdown?.classList.toggle('active'));
  }
}
connect(ShopHeader, store);
window.customElements.define('shop-header', ShopHeader);
