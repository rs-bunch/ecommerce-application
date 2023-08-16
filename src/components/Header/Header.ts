import { Dispatch } from 'redux';
import ElementHTML from './index.html';
import SideBarHTML from './side-bar.html';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import { StateLocation } from '../../types';
import stylesheet from './styles.module.scss';

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

  public $burgerCloseBtn: Element | null | undefined;

  public $elementWrapper: HTMLElement | null | undefined;

  public $searchLineSide: Element | null | undefined;

  constructor() {
    super();
    this.node = createNodeFromHtml(ElementHTML);
    if (this.node?.firstChild instanceof HTMLElement) this.$element = this.node.firstChild;
    else this.$element = null;
    this.$sideBar = createNodeFromHtml(SideBarHTML)?.firstChild as HTMLElement;
    this.$elementWrapper = this.$element?.querySelector('.wrapper');
    this.$favBtn = this.$element?.querySelector('.button.button__fav');
    this.$profileBtn = this.$element?.querySelector('.button.button__profile');
    this.$cartBtn = this.$element?.querySelector('.button.button__cart');
    this.$loginDropdown = this.$element?.querySelector('.header__login');
    this.$burgerBtn = this.$element?.querySelector('.header__burger');
    this.$burgerCloseBtn = this.$sideBar.querySelector('.header__burger.close');
    this.$searchLine = this.$element?.querySelector('.header__search');
    this.$searchLineSide = this.$sideBar.querySelector('.header__search.search_aside');
    this.bindedCloseMenu = this.closeMenu.bind(this);
    this.initButtons();
    this.initSizeChangeListener();
    this.initSearchListen();
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
    this.$burgerCloseBtn?.addEventListener('click', this.bindedCloseMenu);
    if (sideLinks) sideLinks.forEach((link: Element) => link.addEventListener('click', this.bindedCloseMenu));
  }

  private initSizeChangeListener(): void {
    const mediaQuerryBurger: MediaQueryList = window.matchMedia('(min-width: 1024px)');
    const handleBurger = (e: MediaQueryListEvent): void => {
      if (e.matches) this.closeMenu();
    };
    mediaQuerryBurger.addEventListener('change', handleBurger);
  }

  private initSearchListen(): void {
    const $input = this.$searchLine?.querySelector('#header__search');
    const $inputSide = this.$searchLineSide?.querySelector('#header__search');
    if (!($input instanceof HTMLInputElement) || !($inputSide instanceof HTMLInputElement)) return;
    $input?.addEventListener('input', () => {
      const { value } = $input;
      $inputSide.value = value;
    });
    $inputSide?.addEventListener('input', () => {
      const { value } = $inputSide;
      $input.value = value;
    });
  }

  private closeMenu(): void {
    const overlay: HTMLElement | null = document.querySelector('custom-overlay');
    this.$sideBar?.classList.remove('open');
    overlay?.removeEventListener('click', this.bindedCloseMenu);
    overlay?.setAttribute('active', 'false');
  }

  private openMenu(): void {
    const overlay: HTMLElement | null = document.querySelector('custom-overlay');
    this.$sideBar?.classList.add('open');
    overlay?.addEventListener('click', this.bindedCloseMenu, { once: true });
    overlay?.setAttribute('active', 'true');
  }
}
