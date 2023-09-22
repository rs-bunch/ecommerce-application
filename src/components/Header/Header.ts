import { Dispatch } from 'redux';
import ElementHTML from './header.html';
import SideBarHTML from './side-bar.html';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import stylesheet from './header.module.scss';
import store, { RootState } from '../Store/store';
import { logout } from '../Store/slices/authSlice';
import { changeLocation } from '../Store/slices/locationSlice';
import DropdownNav from './DropdownNav/DropdownNav';
import { createElement } from '../../utils/createElement';

customElements.define('dropdown-nav', DropdownNav);

const toCloseDropdownNav = ['main', 'error', 'signup', 'login', 'favourites', 'about-us'];

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

  public $joinBtn: HTMLElement | null | undefined;

  public $signInBtn: HTMLElement | null | undefined;

  public $loginGreetText: HTMLElement | null | undefined;

  public $logOutBtn: HTMLElement | null | undefined;

  public $myAccBtn: HTMLElement | null | undefined;

  public $myOrdersBtn: HTMLElement | null | undefined;

  public $men: HTMLElement | null | undefined;

  public $women: HTMLElement | null | undefined;

  public $dropdownNav: DropdownNav | null | undefined;

  public $dropdownNavSide: DropdownNav;

  public $menSide: Element | null | undefined;

  public $womenSide: Element | null | undefined;

  public $cartCounter: HTMLSpanElement | null | undefined;

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
    this.$joinBtn = this.$element?.querySelector('.login__link_signup');
    this.$signInBtn = this.$element?.querySelector('.login__link_login');
    this.$loginGreetText = this.$element?.querySelector('.login__hello');
    this.$logOutBtn = this.$element?.querySelector('.login__link_logout');
    this.$myAccBtn = this.$element?.querySelector('.login__button_my-account');
    this.$myOrdersBtn = this.$element?.querySelector('.login__button_my-cart');
    this.$men = this.$element?.querySelector('.link__men');
    this.$women = this.$element?.querySelector('.link__women');
    this.$menSide = this.$sideBar?.querySelector('.link__men');
    this.$womenSide = this.$sideBar?.querySelector('.link__women');
    this.$dropdownNav = this.$element?.querySelector('.dropdown-nav_main');
    this.$cartCounter = this.$element?.querySelector('#cart-counter');
    this.$dropdownNavSide = createElement('dropdown-nav', 'dropdown-nav_side', []) as DropdownNav;
    this.bindedCloseMenu = this.closeMenu.bind(this);
    this.initButtons();
    this.initSizeChangeListener();
    this.initSearchListen();
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.node) this.shadowRoot?.append(this.node);
    if (this.$sideBar) {
      this.shadowRoot?.append(this.$sideBar);
      this.$sideBar.append(this.$dropdownNavSide);
    }
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet];
  }

  private disconnectedCallback(): void {}

  private async attributeChangedCallback(
    attributeName: string,
    oldValue: string | null,
    newValue: string | null
  ): Promise<void> {
    if (
      attributeName === 'id' &&
      this.$logOutBtn &&
      this.$loginGreetText &&
      this.$signInBtn &&
      this.$joinBtn &&
      this.$myAccBtn
    ) {
      this.$logOutBtn.style.display = newValue ? '' : 'none';
      this.$myAccBtn.style.display = newValue ? '' : 'none';
      this.$loginGreetText.style.display = newValue ? '' : 'none';
      this.$signInBtn.style.display = newValue ? 'none' : '';
      this.$joinBtn.style.display = newValue ? 'none' : '';
    }
    if (attributeName === 'firstName' && this.$loginGreetText) {
      this.$loginGreetText.textContent = newValue ? `Hello, ${newValue}` : '';
    }
  }

  private mapStateToProps(oldState: RootState, newState: RootState): void {
    if (!oldState) {
      this.attributeChangedCallback('id', null, null);
      return;
    }
    if (oldState.auth.id !== newState.auth.id) this.attributeChangedCallback('id', oldState.auth.id, newState.auth.id);
    if (oldState.auth.firstName !== newState.auth.firstName)
      this.attributeChangedCallback('firstName', oldState.auth.firstName || null, newState.auth.firstName || null);
    if (
      oldState.location.location !== newState.location.location &&
      toCloseDropdownNav.includes(newState.location.location)
    )
      this.$dropdownNav?.setAttribute('category', 'none');

    if (oldState?.cart?.cart?.version !== newState.cart.cart.version) {
      if (this.$cartCounter) this.$cartCounter.textContent = `${newState.cart.cart.totalLineItemQuantity || 0}`;
    }
  }

  private mapDispatchToProps(dispatch: Dispatch): { [index: string]: () => ReturnType<Dispatch> } {
    return {
      logout: () => dispatch(logout()),
      changeLocation: () => dispatch(changeLocation({ location: 'main' })),
    };
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['auth'];
  }

  private initButtons(): void {
    if (this.$dropdownNavSide instanceof DropdownNav) {
      this.$dropdownNavSide.$element
        .querySelectorAll('.dropdown-nav__link')
        .forEach((link: Element) => link.addEventListener('click', this.bindedCloseMenu));
    }
    this.$profileBtn?.addEventListener('click', () => this.$loginDropdown?.classList.toggle('active'));
    [this.$joinBtn, this.$myOrdersBtn, this.$myAccBtn, this.$signInBtn].forEach(
      (btn) => btn?.addEventListener('click', this.closeLoginDropdown.bind(this))
    );
    this.$burgerBtn?.addEventListener('click', () => this.openMenu());
    this.$burgerCloseBtn?.addEventListener('click', this.bindedCloseMenu);
    this.$logOutBtn?.addEventListener('click', () => {
      store.dispatch(logout());
      store.dispatch(changeLocation({ location: 'main' }));
      window.history.pushState({}, '', String('/'));
    });
    this.$men?.addEventListener('click', () => this.$dropdownNav?.setAttribute('category', 'men'));
    this.$women?.addEventListener('click', () => this.$dropdownNav?.setAttribute('category', 'women'));
    this.$menSide?.addEventListener('click', () => {
      this.$dropdownNavSide?.setAttribute('category', 'men');
      this.$dropdownNavSide?.setAttribute('side', 'true');
    });
    this.$womenSide?.addEventListener('click', () => {
      this.$dropdownNavSide?.setAttribute('category', 'women');
      this.$dropdownNavSide?.setAttribute('side', 'true');
    });
  }

  private initSizeChangeListener(): void {
    const mediaQuerryBurger: MediaQueryList = window.matchMedia('(min-width: 1024px)');
    const handleBurger = (e: MediaQueryListEvent): void => {
      if (e.matches && this.$sideBar?.classList.contains('open')) this.closeMenu();
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

    const $searchIcon = this.$searchLine?.querySelector('.search__icon');
    if ($searchIcon) {
      $searchIcon.addEventListener('click', () => {
        const { value } = $input;
        // if (value) window.location.href = `${window.location.origin}${window.location.pathname}?text.en="${value}"`;
        if (value) window.location.href = `${window.location.origin}/search?text.en=${value}`;
      });

      $input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;

        const { value } = $input;
        if (value) window.location.href = `${window.location.origin}/search?text.en=${value}`;
      });

      $inputSide.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;

        const { value } = $input;
        if (value) window.location.href = `${window.location.origin}/search?text.en=${value}`;
      });
    }

    const $searchSideIcon = this.$searchLineSide?.querySelector('.search__icon');
    if ($searchSideIcon) {
      $searchSideIcon.addEventListener('click', () => {
        const { value } = $inputSide;
        if (value) window.location.href = `${window.location.origin}/search?text.en=${value}`;
      });
    }
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

  private closeLoginDropdown(): void {
    this.$loginDropdown?.classList.remove('active');
  }
}
