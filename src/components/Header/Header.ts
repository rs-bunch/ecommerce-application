import { Dispatch } from 'redux';
import ElementHTML from './index.html';
import SideBarHTML from './side-bar.html';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import { StateLocation } from '../../types';
import stylesheet from './styles.module.scss';
import { createElementFromHTML } from '../../utils/create-element';

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

  public burgerCloseBtn: Element | null | undefined;

  constructor() {
    super();
    this.node = createNodeFromHtml(ElementHTML);
    if (this.node?.firstChild instanceof HTMLElement) this.$element = this.node.firstChild;
    else this.$element = null;
    this.$sideBar = createNodeFromHtml(SideBarHTML)?.firstChild as HTMLElement;
    console.log(this.$sideBar);
    this.$favBtn = this.$element?.querySelector('.button.button__fav');
    this.$profileBtn = this.$element?.querySelector('.button.button__profile');
    this.$cartBtn = this.$element?.querySelector('.button.button__cart');
    this.$loginDropdown = this.$element?.querySelector('.header__login');
    this.$burgerBtn = this.$element?.querySelector('.header__burger');
    this.burgerCloseBtn = this.$sideBar.querySelector('.header__burger close.close');
    this.$searchLine = this.$element?.querySelector('.header__search');
    this.bindedCloseMenu = this.closeMenu.bind(this);
    this.initButtons();
    this.initSizeChangeListener();
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.node) this.shadowRoot?.append(this.node);
    if (this.$sideBar) this.shadowRoot?.append(this.$sideBar);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet];
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
    const sideLinks: NodeListOf<Element> | undefined = this.$sideBar?.querySelectorAll('.link__side-bar');
    this.$profileBtn?.addEventListener('click', () => this.$loginDropdown?.classList.toggle('active'));
    this.$burgerBtn?.addEventListener('click', () => this.openMenu());
    this.burgerCloseBtn?.addEventListener('click', this.bindedCloseMenu);
    if (sideLinks) sideLinks.forEach((link: Element) => link.addEventListener('click', this.bindedCloseMenu));
  }

  private initSizeChangeListener(): void {
    const mediaQuerryBurger: MediaQueryList = window.matchMedia('(min-width: 1024px)');
    const mediaQuerrySearch: MediaQueryList = window.matchMedia('(max-width: 768px)');
    const handleBurger = (e: MediaQueryListEvent): void => {
      if (e.matches) this.closeMenu();
    };
    // Redo later---
    const handleSearch = (e: MediaQueryListEvent): void => {
      if (!this.$searchLine) return;
      if (e.matches) {
        this.$sideBar?.appendChild(this.$searchLine);
        this.$searchLine.classList.add('search_aside');
      } else {
        this.$element?.appendChild(this.$searchLine);
        this.$searchLine.classList.remove('search_aside');
      }
    };
    mediaQuerryBurger.addEventListener('change', handleBurger);
    mediaQuerrySearch.addEventListener('change', handleSearch);
  }

  private closeMenu(): void {
    const overlay: HTMLElement | null = document.querySelector('custom-overlay');
    const burger = this.$burgerBtn as HTMLElement;
    this.$sideBar?.classList.remove('open');
    overlay?.removeEventListener('click', this.bindedCloseMenu);
    overlay?.setAttribute('active', 'false');
  }

  private openMenu(): void {
    const overlay: HTMLElement | null = document.querySelector('custom-overlay');
    const burger = this.$burgerBtn as HTMLElement;
    this.$sideBar?.classList.add('open');
    overlay?.addEventListener('click', this.bindedCloseMenu, { once: true });
    overlay?.setAttribute('active', 'true');
  }
}
