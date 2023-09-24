import type { BaseAddress, Customer, CustomerUpdateAction } from '@commercetools/platform-sdk';
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

  private customer: Customer | undefined;

  private $shipping: HTMLInputElement | null;

  private $shippingAsDefault: HTMLInputElement | null;

  private $billing: HTMLInputElement | null;

  private $billingAsDefault: HTMLInputElement | null;

  private $shippingField: HTMLElement | null;

  private $shippingAsDefaultField: HTMLElement | null;

  private $billingField: HTMLElement | null;

  private $billingAsDefaultField: HTMLElement | null;

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

    this.$shipping = this.$element.querySelector('#shipping');
    this.$shippingAsDefault = this.$element.querySelector('#shipping-as-default');
    this.$billing = this.$element.querySelector('#billing');
    this.$billingAsDefault = this.$element.querySelector('#billing-as-default');

    this.$shippingField = this.$element.querySelector('#shipping-field');
    this.$shippingAsDefaultField = this.$element.querySelector('#shipping-as-default-field');
    this.$billingField = this.$element.querySelector('#billing-field');
    this.$billingAsDefaultField = this.$element.querySelector('#billing-as-default-field');

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

    this.$shipping?.addEventListener('change', () => this.shippingCheckboxHandle());
    this.$billing?.addEventListener('change', () => this.billingCheckboxHandle());
  }

  private shippingCheckboxHandle(): void {
    if (this.$shipping?.checked) {
      if (this.$shippingAsDefaultField) this.$shippingAsDefaultField.style.display = 'flex';

      if (this.$billingField) this.$billingField.style.display = 'none';
      if (this.$billingAsDefaultField) this.$billingAsDefaultField.style.display = 'none';

      if (this.$billing) this.$billing.checked = false;
      if (this.$billingAsDefault) this.$billingAsDefault.checked = false;
    }
    if (!this.$shipping?.checked) {
      if (this.$shippingAsDefaultField) this.$shippingAsDefaultField.style.display = 'none';

      if (this.$billingField) this.$billingField.style.display = 'flex';
      if (this.$billingAsDefaultField) this.$billingAsDefaultField.style.display = 'none';

      if (this.$billing) this.$billing.checked = false;
      if (this.$billingAsDefault) this.$billingAsDefault.checked = false;
      if (this.$shippingAsDefault) this.$shippingAsDefault.checked = false;
    }
  }

  private billingCheckboxHandle(): void {
    if (this.$billing?.checked) {
      if (this.$billingAsDefaultField) this.$billingAsDefaultField.style.display = 'flex';

      if (this.$shippingField) this.$shippingField.style.display = 'none';
      if (this.$shippingAsDefaultField) this.$shippingAsDefaultField.style.display = 'none';

      if (this.$shipping) this.$shipping.checked = false;
      if (this.$shippingAsDefault) this.$shippingAsDefault.checked = false;
    }
    if (!this.$billing?.checked) {
      if (this.$billingAsDefaultField) this.$billingAsDefaultField.style.display = 'none';

      if (this.$shippingField) this.$shippingField.style.display = 'flex';
      if (this.$shippingAsDefaultField) this.$shippingAsDefaultField.style.display = 'none';

      if (this.$shipping) this.$shipping.checked = false;
      if (this.$shippingAsDefault) this.$shippingAsDefault.checked = false;
      if (this.$billingAsDefault) this.$billingAsDefault.checked = false;
    }
  }

  public get currentCustomer(): Customer {
    return this.customer as Customer;
  }

  public set currentCustomer(obj: Customer) {
    this.customer = obj;
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
          if (this.$shippingAsDefaultField) this.$shippingAsDefaultField.style.display = 'none';
          if (this.$billingAsDefaultField) this.$billingAsDefaultField.style.display = 'none';
          break;
        case 'edit':
          this.$title.innerText = 'Edit Address';
          break;
        default:
          break;
      }
    }

    if (attributeName === 'address-type') {
      switch (newValue) {
        case 'shipping':
          if (this.$billingField) this.$billingField.style.display = 'none';
          if (this.$billingAsDefaultField) this.$billingAsDefaultField.style.display = 'none';
          break;
        case 'billing':
          if (this.$shippingField) this.$shippingField.style.display = 'none';
          if (this.$shippingAsDefaultField) this.$shippingAsDefaultField.style.display = 'none';
          break;
        case 'none':
          if (this.$shippingAsDefaultField) this.$shippingAsDefaultField.style.display = 'none';
          if (this.$billingAsDefaultField) this.$billingAsDefaultField.style.display = 'none';
          break;
        default:
          break;
      }
    }
    if (attributeName === 'zip' && this.$zip) this.$zip.value = newValue;
    if (attributeName === 'city' && this.$city) this.$city.value = newValue;
    if (attributeName === 'street' && this.$street) this.$street.value = newValue;
    if (attributeName === 'country' && this.$country) this.$country.value = newValue;

    if (attributeName === 'address-id' && newValue) {
      if (this.customer?.shippingAddressIds?.find((el) => el === newValue)) {
        if (this.$shipping) this.$shipping.checked = true;
      }
      if (this.customer?.defaultShippingAddressId === newValue) {
        if (this.$shippingAsDefault) this.$shippingAsDefault.checked = true;
      }
      if (this.customer?.billingAddressIds?.find((el) => el === newValue)) {
        if (this.$billing) this.$billing.checked = true;
      }
      if (this.customer?.defaultBillingAddressId === newValue) {
        if (this.$billingAsDefault) this.$billingAsDefault.checked = true;
      }
    }
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['name', 'zip', 'country', 'city', 'street', 'type', 'address-id', 'address-type'];
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
      const address: BaseAddress = {
        country: `${this.$country?.value}`,
        city: `${this.$city?.value}`,
        streetName: `${this.$street?.value}`,
        postalCode: `${this.$zip?.value}`,
      };

      const actions: CustomerUpdateAction[] = [];

      if (this.getAttribute('type') === 'new') {
        const addressKey = String(Math.random).slice(0, 9);
        Object.assign(address, { key: addressKey });

        actions.push({ action: 'addAddress', address });

        if (this.$shipping?.checked) actions.push({ action: 'addShippingAddressId', addressKey });
        if (this.$shippingAsDefault?.checked && this.$shipping?.checked)
          actions.push({ action: 'setDefaultShippingAddress', addressKey });

        if (this.$billing?.checked) actions.push({ action: 'addBillingAddressId', addressKey });
        if (this.$billingAsDefault?.checked && this.$billing?.checked)
          actions.push({ action: 'setDefaultBillingAddress', addressKey });
      }

      if (this.getAttribute('type') === 'edit') {
        const addressId = String(this.getAttribute('address-id'));
        actions.push({
          action: 'changeAddress',
          addressId: String(addressId),
          address,
        });

        if (this.customer?.shippingAddressIds?.find((el) => el === addressId) && !this.$shipping?.checked)
          actions.push({ action: 'removeShippingAddressId', addressId });
        if (this.customer?.billingAddressIds?.find((el) => el === addressId) && !this.$billing?.checked)
          actions.push({ action: 'removeBillingAddressId', addressId });

        if (!this.customer?.shippingAddressIds?.find((el) => el === addressId) && this.$shipping?.checked)
          actions.push({ action: 'addShippingAddressId', addressId });
        if (!this.customer?.billingAddressIds?.find((el) => el === addressId) && this.$billing?.checked)
          actions.push({ action: 'addBillingAddressId', addressId });

        if (
          this.customer?.defaultShippingAddressId !== addressId &&
          this.$shippingAsDefault?.checked &&
          this.$shipping?.checked
        )
          actions.push({ action: 'setDefaultShippingAddress', addressId });

        if (
          this.customer?.defaultBillingAddressId !== addressId &&
          this.$billingAsDefault?.checked &&
          this.$billing?.checked
        )
          actions.push({ action: 'setDefaultBillingAddress', addressId });
      }

      const payload = {
        id: String(this.customer?.id),
        query: {
          version: Number(this.customer?.version),
          actions,
        },
      };

      updateCustomerBindAction(payload);

      document.getElementById('body')?.style.setProperty('position', 'static');
      this.remove();
    }
  }

  private createNewAddress(payload: BaseAddress): void {
    updateCustomerBindAction({
      id: String(this.customer?.id),
      query: {
        version: Number(this.customer?.version),
        actions: [
          {
            action: 'addAddress',
            address: payload,
          },
        ],
      },
    });
  }

  private changeAddress(payload: BaseAddress): void {
    updateCustomerBindAction({
      id: String(this.customer?.id),
      query: {
        version: Number(this.customer?.version),
        actions: [
          {
            action: 'changeAddress',
            addressId: String(this.getAttribute('address-id')),
            address: payload,
          },
        ],
      },
    });
  }

  private addShippingAddressId(addressId: string): void {
    updateCustomerBindAction({
      id: String(this.customer?.id),
      query: {
        version: Number(this.customer?.version),
        actions: [
          {
            action: 'addShippingAddressId',
            addressId,
          },
        ],
      },
    });
  }

  private removeShippingAddressId(addressId: string): void {
    updateCustomerBindAction({
      id: String(this.customer?.id),
      query: {
        version: Number(this.customer?.version),
        actions: [
          {
            action: 'removeShippingAddressId',
            addressId,
          },
        ],
      },
    });
  }

  private setDefaultShippingAddress(addressId: string): void {
    updateCustomerBindAction({
      id: String(this.customer?.id),
      query: {
        version: Number(this.customer?.version),
        actions: [
          {
            action: 'setDefaultShippingAddress',
            addressId,
          },
        ],
      },
    });
  }

  private addBillingAddressId(addressId: string): void {
    updateCustomerBindAction({
      id: String(this.customer?.id),
      query: {
        version: Number(this.customer?.version),
        actions: [
          {
            action: 'addBillingAddressId',
            addressId,
          },
        ],
      },
    });
  }

  private removeBillingAddressId(addressId: string): void {
    updateCustomerBindAction({
      id: String(this.customer?.id),
      query: {
        version: Number(this.customer?.version),
        actions: [
          {
            action: 'removeShippingAddressId',
            addressId,
          },
        ],
      },
    });
  }

  private setDefaultBillingAddress(addressId: string): void {
    updateCustomerBindAction({
      id: String(this.customer?.id),
      query: {
        version: Number(this.customer?.version),
        actions: [
          {
            action: 'setDefaultBillingAddress',
            addressId,
          },
        ],
      },
    });
  }
}
