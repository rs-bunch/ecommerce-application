import ElementHTML from './product-card.html';
import { createElementFromHTML } from '../../utils/createElementFromHTML';
import { productCard } from '../../styles/styles';

export default class ProductCard extends HTMLElement {
  private $element: HTMLElement | null;

  private $productImage: HTMLElement | null;

  private $productName: HTMLElement | null;

  private $productBrand: HTMLElement | null;

  private $productPrice: HTMLElement | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createElementFromHTML(ElementHTML);

    this.$productImage = this.$element.querySelector('#product-image');
    this.$productName = this.$element.querySelector('#product-name');
    this.$productBrand = this.$element.querySelector('#product-brand');
    this.$productPrice = this.$element.querySelector('#product-price');

    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
      this.shadowRoot.adoptedStyleSheets = [productCard];
    }
  }

  private render(): void {
    const imageUrl = this.getAttribute('data-image');
    const name = this.getAttribute('data-name');
    const brand = this.getAttribute('data-brand');
    const price = this.getAttribute('data-price');

    if (this.$productImage) this.$productImage.style.backgroundImage = `url("${imageUrl}")`;
    if (this.$productName) this.$productName.textContent = name;
    if (this.$productBrand) this.$productBrand.textContent = brand;
    if (this.$productPrice) this.$productPrice.textContent = price;
  }

  public connectedCallback(): void {
    this.render();
  }

  public static get observedAttributes(): string[] {
    return ['data-image', 'data-name', 'data-brand', 'data-price'];
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    this.render();
  }
}
