import type { Customer } from '@commercetools/platform-sdk';
import ElementHTML from './profile-page.html';
import stylesheet from './profile-page.module.scss';
// import { bootstrap } from '../../styles/styles';
import createFragmentFromHTML from '../../utils/createFragmentFromHTML';
import { RootState, AppDispatch } from '../Store/store';
import MenuCard from './MenuCard/MenuCard';
import AddressCard from './AddressCard/AddressCard';
import ContactCard from './ContactCard/ContactCard';
import AddressModal from './AddressModal/AddressModal';
import { changeLocation } from '../Store/locationSlice';

customElements.define('menu-card', MenuCard);
customElements.define('address-card', AddressCard);
customElements.define('contact-card', ContactCard);
customElements.define('address-modal', AddressModal);

export default class extends HTMLElement {
  private changeLocation: ((payload: { location: string }) => void) | undefined;

  private $element: DocumentFragment;

  private $profileMenu: HTMLElement | null;

  private $contacts: HTMLElement | null;

  private $addresses: HTMLElement | null;

  private $addNewButton: HTMLButtonElement | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$profileMenu = this.$element.querySelector('#profile-menu');
    this.$contacts = this.$element.querySelector('#contacts');
    this.$addresses = this.$element.querySelector('#addresses');
    this.$addNewButton = this.$element.querySelector('#add-new');

    this.$addNewButton?.addEventListener('click', () => this.addNewHandle());
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'location') {
      this.style.display = newValue === 'profile' ? '' : 'none';
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    if (!oldState) return;
    if (oldState.location.location !== newState.location.location) {
      if (newState.location.location === 'profile' && newState.auth.id) {
        this.render(newState.auth);
      }
      this.attributeChangedCallback('location', oldState.location.location, newState.location.location);
      document.querySelectorAll('address-modal').forEach(($el) => $el.remove());
    }
    if (newState.location.location === 'profile' && !newState.auth.id && this.changeLocation) {
      this.style.display = 'none';
      window.history.pushState({}, '', String('/login'));
      this.changeLocation({ location: 'login' });
    }
    if (newState.location.location === 'profile' && oldState.auth.version !== newState.auth.version) {
      this.render(newState.auth);
    }
  }

  // redux dispath action
  private mapDispatchToProps(dispatch: AppDispatch): { [index: string]: ReturnType<AppDispatch> } {
    return {
      changeLocation: (payload: { location: string }) => dispatch(changeLocation(payload)),
    };
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['name'];
  }

  private render(customer: Customer): void {
    if (this.$profileMenu) {
      this.$profileMenu.innerHTML = '';
      const $menu = document.createElement('menu-card');
      $menu.setAttribute('first-name', customer.firstName || 'Default');
      this.$profileMenu.appendChild($menu);
    }

    if (this.$contacts) {
      this.$contacts.innerHTML = '';
      const $contact = document.createElement('contact-card');
      $contact.setAttribute('first-name', customer.firstName || 'Default');
      $contact.setAttribute('last-name', customer.lastName || 'Default');
      $contact.setAttribute('birth-date', customer.dateOfBirth || 'Default');
      $contact.setAttribute('email', customer.email || 'Default');
      $contact.setAttribute('customer-id', `${customer.id}`);
      $contact.setAttribute('customer-version', `${customer.version}`);
      this.$contacts.appendChild($contact);
    }

    if (this.$addresses) {
      this.$addresses.innerHTML = '';
      customer.addresses.forEach((address) => {
        const $address = document.createElement('address-card');
        $address.classList.add('block__card');
        $address.setAttribute('zip', `${address.postalCode}`);
        $address.setAttribute('country', `${address.country}`);
        $address.setAttribute('city', `${address.city}`);
        $address.setAttribute('street', `${address.streetName}`);
        $address.setAttribute('customer-id', `${customer.id}`);
        $address.setAttribute('customer-version', `${customer.version}`);

        if (customer.shippingAddressIds?.find((id) => id === address.id)) {
          $address.setAttribute('type', 'shipping');
        } else if (customer.billingAddressIds?.find((id) => id === address.id)) {
          $address.setAttribute('type', 'billing');
        } else {
          $address.setAttribute('type', 'none');
        }

        if (address.id === customer.defaultShippingAddressId) {
          $address.setAttribute('default', 'shipping');
        }
        if (address.id === customer.defaultBillingAddressId) {
          $address.setAttribute('default', 'billing');
        }

        this.$addresses?.appendChild($address);
      });
    }
  }

  private addNewHandle(): void {
    const $modal = document.createElement('address-modal');
    $modal.setAttribute('type', 'new');
    document.querySelector('#body')?.appendChild($modal);
  }
}
