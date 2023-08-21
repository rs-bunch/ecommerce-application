import type { CustomerDraft } from '@commercetools/platform-sdk';
import createFragmentFromHTML from '../../utils/createFragmentFromHTML';
import type { RootState, AppDispatch } from '../Store/store';
import ElementHTML from './signup-form.html';
import signupStyleSheet from './signup-form.module.scss';
import { bootstrap } from '../../styles/styles';
import { signup } from '../Store/authSlice';
import { changeLocation } from '../Store/locationSlice';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateStreet,
  validateYearOld,
  validateZipCode,
} from '../../utils/validation/textValidation';
import { notifyError } from '../../utils/notify/notify';

export default class extends HTMLElement {
  private signup: ((payload: CustomerDraft) => void) | undefined;

  private changeLocation: (() => void) | undefined;

  private $element: DocumentFragment;

  private $form: HTMLFormElement | null;

  private $email: HTMLInputElement | null;

  private $emailField: HTMLElement | null;

  private $password: HTMLInputElement | null;

  private $passwordField: HTMLElement | null;

  private $firstNameField: HTMLElement | null;

  private $lastNameField: HTMLElement | null;

  private $dateField: HTMLElement | null;

  private $streetField: HTMLElement | null;

  private $cityField: HTMLElement | null;

  private $zipField: HTMLElement | null;

  private $country: HTMLSelectElement | null;

  private $defultShipAddressCheckbox: HTMLInputElement | null;

  private $defultBillAddressCheckbox: HTMLInputElement | null;

  private $billingAddressBlock: HTMLElement | null;

  private $billingStreetField: HTMLElement | null;

  private $billingCityField: HTMLElement | null;

  private $billingZipField: HTMLElement | null;

  private $billingCountry: HTMLSelectElement | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);

    this.$form = this.$element.querySelector('#form');

    this.$email = this.$element.querySelector('#email');
    this.$emailField = this.$element.querySelector('#email-field');

    this.$password = this.$element.querySelector('#password');
    this.$passwordField = this.$element.querySelector('#password-field');

    this.$firstNameField = this.$element.querySelector('#firstname-field');
    this.$lastNameField = this.$element.querySelector('#lastname-field');
    this.$dateField = this.$element.querySelector('#date-field');

    this.$streetField = this.$element.querySelector('#street-field');
    this.$cityField = this.$element.querySelector('#city-field');
    this.$zipField = this.$element.querySelector('#zip-field');
    this.$country = this.$element.querySelector('#country');

    this.$defultShipAddressCheckbox = this.$element.querySelector('#default-shipping');
    this.$defultBillAddressCheckbox = this.$element.querySelector('#default-billing');

    this.$billingAddressBlock = this.$element.querySelector('#billing-address-block');
    this.$billingStreetField = this.$element.querySelector('#billing-street-field');
    this.$billingCityField = this.$element.querySelector('#billing-city-field');
    this.$billingZipField = this.$element.querySelector('#billing-zip-field');
    this.$billingCountry = this.$element.querySelector('#billing-country');

    this.$emailField?.addEventListener('input', () => this.validateTextInput(this.$emailField, validateEmail));
    this.$password?.addEventListener('input', () => this.validateTextInput(this.$passwordField, validatePassword));
    this.$firstNameField?.addEventListener('input', () => this.validateTextInput(this.$firstNameField, validateName));
    this.$lastNameField?.addEventListener('input', () => this.validateTextInput(this.$lastNameField, validateName));
    this.$dateField?.addEventListener('input', () => this.validateTextInput(this.$dateField, validateYearOld));

    this.$streetField?.addEventListener('input', () => this.validateTextInput(this.$streetField, validateStreet));
    this.$cityField?.addEventListener('input', () => this.validateTextInput(this.$cityField, validateName));
    this.$zipField?.addEventListener('input', () => this.validateTextInput(this.$zipField, validateZipCode));

    this.$billingStreetField?.addEventListener('input', () =>
      this.validateTextInput(this.$billingStreetField, validateStreet)
    );
    this.$billingCityField?.addEventListener('input', () =>
      this.validateTextInput(this.$billingCityField, validateName)
    );
    this.$billingZipField?.addEventListener('input', () =>
      this.validateTextInput(this.$billingZipField, validateZipCode)
    );

    this.$form?.addEventListener('submit', (e) => this.submitHandler(e));
    this.$defultBillAddressCheckbox?.addEventListener('click', () => this.defaultShipHahler());
  }

  private defaultShipHahler(): void {
    if (this.$billingAddressBlock) {
      this.$billingAddressBlock.style.display = this.$defultBillAddressCheckbox?.checked ? 'none' : '';
    }
  }

  private submitHandler(event: SubmitEvent): void {
    event.preventDefault();
    if (this.$form) {
      const selectorQueryString = this.$defultBillAddressCheckbox?.checked
        ? '.block_initial input, select'
        : 'input, select';
      const formInputList = this.$form?.querySelectorAll(selectorQueryString);
      console.log(formInputList);
      const checkQueryString = this.$defultBillAddressCheckbox?.checked
        ? '.block_initial input.valid, select'
        : '.valid';
      const isValid = formInputList?.length === this.$form?.querySelectorAll(checkQueryString).length;
      if (isValid) {
        let payload = { email: '', addresses: [] };

        const formDataObj = Object.fromEntries(new FormData(this.$form).entries());
        if (this.$country) Object.assign(formDataObj, { country: this.$country.value });

        const personalFields = ['email', 'password', 'firstName', 'lastName', 'dateOfBirth'];
        const pesonal = Object.fromEntries(personalFields.map((el) => [el, formDataObj[el] || '']));

        const addressFields = ['country', 'city', 'streetName', 'postalCode'];
        const address = Object.fromEntries(addressFields.map((el) => [el, formDataObj[el] || '']));

        payload = Object.assign(payload, pesonal, { addresses: [address] });

        if (this.$defultShipAddressCheckbox?.checked) Object.assign(payload, { defaultShippingAddress: 0 });
        if (this.$defultBillAddressCheckbox?.checked) Object.assign(payload, { defaultBillingAddress: 0 });

        if (!this.$defultBillAddressCheckbox?.checked) {
          const billingAddress = {
            city: formDataObj.billingCity || '',
            streetName: formDataObj.billingStreetName || '',
            postalCode: formDataObj.billingPostalCode || '',
            country: this.$billingCountry?.value || '',
          };
          Object.assign(payload, { addresses: [...payload.addresses, billingAddress] }, { defaultBillingAddress: 1 });
        }

        console.log(payload);
        if (this.signup) this.signup(payload);
      } else {
        notifyError('Please provide correct data!').showToast();
      }
    }
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [bootstrap, signupStyleSheet];
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
  }

  private validateTextInput(field: HTMLElement | null, validator: (value: string) => Error | void): void {
    if (field) {
      const input = field.querySelector('input');
      const invalidTooltip = field.querySelector('.invalid-tooltip');
      try {
        validator(input?.value || '');
        if (input) input.classList.remove('invalid');
        if (input) input.classList.add('valid');
      } catch (error) {
        if (input && invalidTooltip && error instanceof Error) {
          invalidTooltip.innerHTML = error.message;
          if (input) input.classList.remove('valid');
          if (input) input.classList.add('invalid');
        }
      }
    }
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'location') {
      this.style.display = newValue === 'signup' ? '' : 'none';
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    const { location } = newState.location;
    const { id } = newState.auth;
    if (location !== undefined) {
      // this.$form?.querySelectorAll('input, select, button').forEach((el) => el.setAttribute('disabled', ''));
      this.attributeChangedCallback('location', '', String(location));
    }
    if (id && location === 'signup') {
      window.history.pushState({}, '', '/');
      if (this.changeLocation) this.changeLocation();
    }
  }

  // redux dispath action
  private mapDispatchToProps(dispatch: AppDispatch): { [index: string]: ReturnType<AppDispatch> } {
    return {
      signup: (payload: { email: string; password: string }) => dispatch(signup(payload)),
      changeLocation: () => dispatch(changeLocation({ location: 'main' })),
    };
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['name', 'location'];
  }
}
