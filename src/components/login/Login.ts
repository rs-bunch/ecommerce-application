import './login.scss';
import { Dispatch } from 'redux';
import { login, bootstrap } from '../../styles/styles';

import ElementHTML from './login.html';
import { createElementFromHTML } from '../../utils/create-element';
import { validateEmail } from '../../utils/validation/validateEmail';
import { validatePassword } from '../../utils/validation/validatePassword';
import { StateLocation } from '../../types';

export default class Login extends HTMLElement {
  private $element: HTMLElement | null;

  private $emailField: HTMLElement | null;

  private $passwordField: HTMLElement | null;

  private $hideBtn: HTMLElement | null;

  private $emailTootlip: HTMLElement | null;

  private $passwordTootlip: HTMLElement | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createElementFromHTML(ElementHTML);
    this.$emailField = this.$element.querySelector('.sign-in__email');
    this.$passwordField = this.$element.querySelector('.sign-in__password');
    this.$hideBtn = this.$element.querySelector('.sign-in__password-field__label__hide-btn');

    this.$emailTootlip = this.$element.querySelector('.sign-in__email__tooltip');
    this.$passwordTootlip = this.$element.querySelector('.sign-in__password__tooltip');
  }

  public connectedCallback(): void {
    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
      this.shadowRoot.adoptedStyleSheets = [login, bootstrap];
    }

    this.$emailField?.addEventListener('input', () => this.validateEmail());
    this.$passwordField?.addEventListener('input', () => this.validatePassword());
    this.$hideBtn?.addEventListener('click', () => this.togglePassVisibility());
  }

  private attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void {
    if (attributeName === 'location') {
      this.style.display = newValue === 'login' ? '' : 'none';
    }
  }

  private mapStateToProps(oldState: StateLocation, newState: StateLocation): void {
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

  private validateEmail(): void {
    const emailInput = this.$emailField;
    if (!emailInput || !(emailInput instanceof HTMLInputElement)) return;
    if (!this.$emailTootlip) return;
    const email = emailInput.value;

    const tooltip = validateEmail(email);

    if (tooltip === '') {
      this.$emailTootlip.textContent = tooltip;
      return;
    }

    this.$emailTootlip.textContent = tooltip;
    emailInput.focus();
  }

  private validatePassword(): void {
    const passwordInput = this.$passwordField;
    if (!passwordInput || !(passwordInput instanceof HTMLInputElement)) return;
    if (!this.$passwordTootlip) return;
    const password = passwordInput.value;

    const tooltip = validatePassword(password);

    if (tooltip === '') {
      this.$passwordTootlip.textContent = tooltip;
      return;
    }

    this.$passwordTootlip.textContent = tooltip;
    passwordInput.focus();
  }

  private togglePassVisibility(): void {
    const typeValue = this.$passwordField?.getAttribute('type');
    if (!typeValue) return;
    this.$passwordField?.setAttribute('type', typeValue === 'password' ? 'text' : 'password');
  }
}
