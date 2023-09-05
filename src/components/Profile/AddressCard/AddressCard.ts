import type { Customer, CustomerUpdate } from '@commercetools/platform-sdk';
import ElementHTML from './address-card.html';
import stylesheet from './address-card.module.scss';
import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';
import { CountryCodes } from '../../../dto/types';
import { updateCustomerBindAction } from '../../Store/store';
import AddressModal from '../AddressModal/AddressModal';

export default class extends HTMLElement {
  private $element: DocumentFragment;

  private $zip: HTMLSpanElement | null;

  private $country: HTMLSpanElement | null;

  private $street: HTMLSpanElement | null;

  private $city: HTMLSpanElement | null;

  private $shipping: HTMLElement | null;

  private $billing: HTMLElement | null;

  private $defaultShipping: HTMLElement | null;

  private $defaultBilling: HTMLElement | null;

  private $setDefaultShipping: HTMLButtonElement | null;

  private $setDefaultBilling: HTMLButtonElement | null;

  private $remove: HTMLButtonElement | null;

  private $edit: HTMLButtonElement | null;

  private countryCode: string | undefined;

  private customer: Customer | undefined;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$zip = this.$element.querySelector('#zip');
    this.$country = this.$element.querySelector('#country');
    this.$street = this.$element.querySelector('#street');
    this.$city = this.$element.querySelector('#city');
    this.$shipping = this.$element.querySelector('#shipping');
    this.$billing = this.$element.querySelector('#billing');
    this.$defaultShipping = this.$element.querySelector('#default-shipping');
    this.$defaultBilling = this.$element.querySelector('#default-billing');
    this.$setDefaultShipping = this.$element.querySelector('#set-default-shipping');
    this.$setDefaultBilling = this.$element.querySelector('#set-default-billing');
    this.$remove = this.$element.querySelector('#remove');
    this.$edit = this.$element.querySelector('#edit');

    this.$remove?.addEventListener('click', () => this.removeHandler());
    this.$edit?.addEventListener('click', () => this.editHandler());

    this.$setDefaultShipping?.addEventListener('click', () => this.setDefaultShippingAddress());
    this.$setDefaultBilling?.addEventListener('click', () => this.setDefaultBillingAddress());
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
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'zip' && this.$zip) this.$zip.innerText = newValue;
    if (attributeName === 'country' && this.$country) {
      this.countryCode = newValue;
      this.$country.innerText = CountryCodes[newValue as keyof typeof CountryCodes];
    }
    if (attributeName === 'street' && this.$street) this.$street.innerText = newValue;
    if (attributeName === 'city' && this.$city) this.$city.innerText = newValue;

    if (attributeName === 'type') {
      switch (newValue) {
        case 'shipping':
          if (this.$shipping) this.$shipping.style.display = 'inline';
          if (this.$setDefaultShipping) this.$setDefaultShipping.style.display = 'inline';
          break;
        case 'billing':
          if (this.$billing) this.$billing.style.display = 'inline';
          if (this.$setDefaultBilling) this.$setDefaultBilling.style.display = 'inline';
          break;
        default:
          break;
      }
    }

    if (attributeName === 'default') {
      switch (newValue) {
        case 'shipping':
          if (this.$defaultShipping) this.$defaultShipping.style.display = 'inline';
          if (this.$setDefaultShipping) this.$setDefaultShipping.style.display = '';
          break;
        case 'billing':
          if (this.$defaultBilling) this.$defaultBilling.style.display = 'inline';
          if (this.$setDefaultBilling) this.$setDefaultBilling.style.display = '';
          break;
        default:
          break;
      }
    }
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['zip', 'country', 'city', 'street', 'type', 'default', 'customer-id', 'customer-version', 'address-id'];
  }

  private removeHandler(): void {
    const query: CustomerUpdate = {
      version: Number(this.getAttribute('customer-version')),
      actions: [
        {
          action: 'removeAddress',
          addressId: String(this.getAttribute('address-id')),
        },
      ],
    };
    const payload = {
      id: String(this.getAttribute('customer-id')),
      query,
    };
    updateCustomerBindAction(payload);
  }

  private editHandler(): void {
    const $modal = new AddressModal();
    if (this.customer) $modal.currentCustomer = this.customer;
    $modal.setAttribute('type', 'edit');
    $modal.setAttribute('zip', `${this.$zip?.innerHTML}`);
    $modal.setAttribute('city', `${this.$city?.innerHTML}`);
    $modal.setAttribute('street', `${this.$street?.innerHTML}`);
    $modal.setAttribute('country', `${this.countryCode}`);
    $modal.setAttribute('address-id', `${this.getAttribute('address-id')}`);
    $modal.setAttribute('customer-id', `${this.customer?.id}`);
    $modal.setAttribute('customer-version', `${this.customer?.version}`);
    document.querySelector('#body')?.appendChild($modal);
  }

  private setDefaultShippingAddress(): void {
    updateCustomerBindAction({
      id: String(this.customer?.id),
      query: {
        version: Number(this.customer?.version),
        actions: [
          {
            action: 'setDefaultShippingAddress',
            addressId: String(this.getAttribute('address-id')),
          },
        ],
      },
    });
  }

  private setDefaultBillingAddress(): void {
    updateCustomerBindAction({
      id: String(this.customer?.id),
      query: {
        version: Number(this.customer?.version),
        actions: [
          {
            action: 'setDefaultBillingAddress',
            addressId: String(this.getAttribute('address-id')),
          },
        ],
      },
    });
  }
}
