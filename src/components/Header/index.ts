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

  public $burgerBtn: HTMLElement | null | undefined;

  public $sideBar: HTMLElement | null | undefined;

  public $searchLine: HTMLElement | null | undefined;

  public bindedCloseMenu: () => void;

  constructor() {
    super();
    this.node = createNodeFromHtml(ElementHTML);
    if (this.node?.firstChild instanceof HTMLElement) this.$element = this.node.firstChild;
    else this.$element = null;
    this.$favBtn = this.$element?.querySelector('.button.fav');
    this.$profileBtn = this.$element?.querySelector('.button.profile');
    this.$cartBtn = this.$element?.querySelector('.button.cart');
    this.$loginDropdown = this.$element?.querySelector('.login-dropdown');
    this.$burgerBtn = this.$element?.querySelector('.burger-wrapper');
    this.$sideBar = this.$element?.querySelector('.side-bar');
    this.$searchLine = this.$element?.querySelector('.search-wrapper');
    this.bindedCloseMenu = this.closeMenu.bind(this);
    this.initButtons();
    this.initSizeChangeListener();
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
    const sideLinks: NodeListOf<Element> | undefined = this.$element?.querySelectorAll('.side-link');
    this.$profileBtn?.addEventListener('click', () => this.$loginDropdown?.classList.toggle('active'));
    this.$burgerBtn?.addEventListener('click', () => {
      const burger = this.$burgerBtn as HTMLElement;
      if (burger.classList.contains('open')) this.closeMenu();
      else this.openMenu();
    });
    if (sideLinks) sideLinks.forEach((link: Element) => link.addEventListener('click', this.closeMenu.bind(this)));
  }

  private initSizeChangeListener(): void {
    const mediaQuerryBurger: MediaQueryList = window.matchMedia('(min-width: 1024px)');
    const mediaQuerrySearch: MediaQueryList = window.matchMedia('(max-width: 768px)');
    const handleBurger = (e: MediaQueryListEvent): void => {
      if (e.matches) this.closeMenu();
    };
    const handleSearch = (e: MediaQueryListEvent): void => {
      if (!this.$searchLine) return;
      if (e.matches) {
        this.$sideBar?.appendChild(this.$searchLine);
        this.$searchLine.classList.add('search-aside');
      } else {
        this.$element?.appendChild(this.$searchLine);
        this.$searchLine.classList.remove('search-aside');
      }
    };
    mediaQuerryBurger.addEventListener('change', handleBurger);
    mediaQuerrySearch.addEventListener('change', handleSearch);
  }

  private closeMenu(): void {
    const overlay: HTMLElement | null = document.querySelector('custom-overlay');
    const burger = this.$burgerBtn as HTMLElement;
    burger.classList.remove('open');
    this.$sideBar?.classList.remove('open');
    overlay?.removeEventListener('click', this.bindedCloseMenu);
    overlay?.setAttribute('active', 'false');
  }

  private openMenu(): void {
    const overlay: HTMLElement | null = document.querySelector('custom-overlay');
    const burger = this.$burgerBtn as HTMLElement;
    burger.classList.add('open');
    this.$sideBar?.classList.add('open');
    overlay?.addEventListener('click', this.bindedCloseMenu, { once: true });
    overlay?.setAttribute('active', 'true');
  }
}
connect(ShopHeader, store);
window.customElements.define('shop-header', ShopHeader);
