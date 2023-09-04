import ElementHTML from './address-modal.html';
import stylesheet from './address-modal.module.scss';
import { bootstrap } from '../../../styles/styles';
import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';

export default class extends HTMLElement {
  private $element: DocumentFragment;

  private $title: HTMLElement | null;

  private $zip: HTMLInputElement | null;

  private $city: HTMLInputElement | null;

  private $street: HTMLInputElement | null;

  private $country: HTMLSelectElement | null;

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

    this.$closeButton = this.$element.querySelector('#close');
    this.$saveButton = this.$element.querySelector('#save');

    this.$closeButton?.addEventListener('click', () => this.closeHandler());
    this.$saveButton?.addEventListener('click', () => this.saveHandler());
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [bootstrap, stylesheet];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'name' && this.$title) this.$title.innerText = newValue;
    if (attributeName === 'zip' && this.$zip) this.$zip.value = newValue;
    if (attributeName === 'city' && this.$city) this.$city.value = newValue;
    if (attributeName === 'street' && this.$street) this.$street.value = newValue;
    if (attributeName === 'country' && this.$country) this.$country.value = newValue;
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['name', 'zip', 'country', 'city', 'street'];
  }

  private closeHandler(): void {
    this.remove();
  }

  private saveHandler(): void {
    this.remove();
  }
}
