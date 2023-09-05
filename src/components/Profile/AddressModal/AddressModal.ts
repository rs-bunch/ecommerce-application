import type { BaseAddress } from '@commercetools/platform-sdk';
import ElementHTML from './address-modal.html';
import stylesheet from './address-modal.module.scss';
import { bootstrap } from '../../../styles/styles';
import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';
import { validateStreet, validateZipCode, validateName } from '../../../utils/validation/textValidation';
import type { TextValidator } from '../../../dto/types';
import { updateCustomerBindAction } from '../../Store/store';

export default class extends HTMLElement {
  private $element: DocumentFragment;

  private $title: HTMLElement | null;

  private $zip: HTMLInputElement | null;

  private $city: HTMLInputElement | null;

  private $street: HTMLInputElement | null;

  private $country: HTMLSelectElement | null;

  private $zipField: HTMLElement | null;

  private $cityField: HTMLElement | null;

  private $streetField: HTMLElement | null;

  private $countryField: HTMLElement | null;

  private $closeButton: HTMLButtonElement | null;

  private $saveButton: HTMLButtonElement | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$title = this.$element.querySelector('#title');
    this.$zip = this.$element.querySelector('#zip');
    this.$city = this.$element.querySelector('#city');
    this.$street = this.$element.querySelector('#street');
    this.$country = this.$element.querySelector('#country');

    this.$zipField = this.$element.querySelector('#zip-field');
    this.$cityField = this.$element.querySelector('#city-field');
    this.$streetField = this.$element.querySelector('#street-field');
    this.$countryField = this.$element.querySelector('#country-field');

    this.$closeButton = this.$element.querySelector('#close');
    this.$saveButton = this.$element.querySelector('#save');

    this.$closeButton?.addEventListener('click', () => this.closeHandler());
    this.$saveButton?.addEventListener('click', () => this.saveHandler());

    this.$streetField?.addEventListener('input', () => this.validateHandle(this.$streetField));
    this.$cityField?.addEventListener('input', () => this.validateHandle(this.$cityField));
    this.$zip?.addEventListener('input', () => {
      const payload = this.$country?.value || '';
      this.validateHandle(this.$zipField, payload);
    });
    this.$country?.addEventListener('change', () => {
      const payload = this.$country?.value || '';
      this.validateHandle(this.$zipField, payload);
    });
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [bootstrap, stylesheet];
    document.getElementById('body')?.style.setProperty('position', 'fixed');
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'type' && this.$title) {
      switch (newValue) {
        case 'new':
          this.$title.innerText = 'Add New Address';
          break;
        case 'edit':
          this.$title.innerText = 'Edit Address';
          break;
        default:
          break;
      }
    }
    if (attributeName === 'zip' && this.$zip) this.$zip.value = newValue;
    if (attributeName === 'city' && this.$city) this.$city.value = newValue;
    if (attributeName === 'street' && this.$street) this.$street.value = newValue;
    if (attributeName === 'country' && this.$country) this.$country.value = newValue;
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['name', 'zip', 'country', 'city', 'street', 'type', 'customer-id', 'customer-version'];
  }

  private validateTextInput(field: HTMLElement | null, validator: TextValidator, payload?: string | number): void {
    if (field) {
      const input = field.querySelector('input');
      const invalidTooltip = field.querySelector('.invalid-tooltip');
      try {
        validator(input?.value || '', payload);
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

  private validateHandle(field: HTMLElement | null, payload?: string | number): void {
    const $input = field?.querySelector('input');
    if ($input && $input.hasAttribute('name')) {
      const name = $input.getAttribute('name');
      switch (name) {
        case 'city':
          this.validateTextInput(field, validateName);
          break;
        case 'streetName':
          this.validateTextInput(field, validateStreet);
          break;
        case 'zip':
          this.validateTextInput(field, validateZipCode, payload);
          break;
        default:
          break;
      }
    }
  }

  private closeHandler(): void {
    document.getElementById('body')?.style.setProperty('position', 'static');
    this.remove();
  }

  private saveHandler(): void {
    const country = this.$country?.value || '';
    this.validateHandle(this.$zipField, country);
    this.validateHandle(this.$streetField);
    this.validateHandle(this.$cityField);

    if (
      !this.$zip?.classList.contains('invalid') &&
      !this.$city?.classList.contains('invalid') &&
      !this.$street?.classList.contains('invalid')
    ) {
      const payload: BaseAddress = {
        country: `${this.$country?.value}`,
        city: `${this.$city?.value}`,
        streetName: `${this.$street?.value}`,
        postalCode: `${this.$zip?.value}`,
      };
      updateCustomerBindAction({
        id: String(this.getAttribute('customer-id')),
        query: {
          version: Number(this.getAttribute('customer-version')),
          actions: [
            {
              action: 'addAddress',
              address: payload,
            },
          ],
        },
      });
      document.getElementById('body')?.style.setProperty('position', 'static');
      this.remove();
    }
  }
}
