import { login, bootstrap } from '../../styles/styles';
import ElementHTML from './login-form.html';
import { createElementFromHTML } from '../../utils/create-element';
import { validateEmail } from '../../utils/validation/validateEmail';
import { validatePassword } from '../../utils/validation/validatePassword';

import { signin } from '../Store/authSlice';
import type { RootState, AppDispatch } from '../Store/store';

import { changeLocation } from '../Store/locationSlice';

export default class LoginForm extends HTMLElement {
  private $element: HTMLElement | null;

  private $emailField: HTMLInputElement | null;

  private $passwordField: HTMLInputElement | null;

  private $hideBtn: HTMLElement | null;

  private $emailTootlip: HTMLElement | null;

  private $passwordTootlip: HTMLElement | null;

  private $submitBtn: HTMLInputElement | null;

  private signin: ((payload: { [index: string]: string }) => void) | undefined;

  private changeLocation: (() => void) | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createElementFromHTML(ElementHTML);
    this.$emailField = this.$element.querySelector('#sign-in-email');
    this.$passwordField = this.$element.querySelector('#sign-in-password');
    this.$hideBtn = this.$element.querySelector('#password-hide-btn');

    this.$emailTootlip = this.$element.querySelector('#email-tooltip');
    this.$passwordTootlip = this.$element.querySelector('#password-tooltip');
    this.$submitBtn = this.$element.querySelector('#sign-in-submit');

    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
      this.shadowRoot.adoptedStyleSheets = [login, bootstrap];
    }

    this.$emailField?.addEventListener('input', () => this.validateEmail());
    this.$passwordField?.addEventListener('input', () => this.validatePassword());
    this.$hideBtn?.addEventListener('click', () => this.togglePassVisibility());
    this.$submitBtn?.addEventListener('click', (e) => {
      if (!this.$emailTootlip || !this.$passwordTootlip) return;
      if (this.$emailTootlip.textContent || this.$passwordTootlip.textContent) return;
      this.submitHandler();
      e.preventDefault();
    });
  }

  public connectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'location') {
      this.style.display = newValue === 'login' ? '' : 'none';
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    const { location } = newState.location;
    const { id } = newState.auth;
    if (location !== undefined) {
      this.attributeChangedCallback('location', '', String(location));
    }
    if (id && location === 'login') {
      window.history.pushState({}, '', String('/'));
      if (this.changeLocation) {
        this.changeLocation();
      }
    }
  }

  // redux dispath action
  private mapDispatchToProps(dispatch: AppDispatch): { [index: string]: ReturnType<AppDispatch> } {
    return {
      signin: (payload: { email: string; password: string }) => dispatch(signin(payload)),
      changeLocation: () => dispatch(changeLocation({ location: '/' })),
    };
  }

  private submitHandler(): void {
    if (this.$emailField?.value && this.$passwordField?.value) {
      const payload = { email: this.$emailField.value, password: this.$passwordField.value };
      if (this.signin) this.signin(payload);
    }
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
