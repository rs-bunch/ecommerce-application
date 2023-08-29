import { ClientResponse, DiscountedPrice, Image, Price, Product } from '@commercetools/platform-sdk';
import createFragmentFromHTML from '../../utils/createFragmentFromHTML';
import type { RootState } from '../Store/store';
import ElementHTML from './product-details.html';
import carouselBtnHTML from './carousel-buttons.html';
import stylesheet from './product-details.module.scss';
import { bootstrap } from '../../styles/styles';
import { getProductDetails } from '../Api/product';
import { removeAllChildNodes } from '../../utils/removeAllChildNodes';
import { createElement } from '../../utils/createElement';

export default class ProductDetails extends HTMLElement {
  private $element: DocumentFragment;

  private $carouselBtns: DocumentFragment;

  private $carousel: Element | null;

  private $carouselIndicators: HTMLElement;

  private $carouselInner: HTMLElement;

  private productData: Promise<ClientResponse<Product>>;

  private $productPath: Element | null;

  private $productName: Element | null;

  private $productDescr: Element | null;

  private $productPrice: Element | null;

  private $productPriceSale: Element | null;

  private $btnSizeXS: Element | null;

  private $btnSizeS: Element | null;

  private $btnSizeM: Element | null;

  private $btnSizeL: Element | null;

  private $btnSizeXL: Element | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$carouselBtns = createFragmentFromHTML(carouselBtnHTML);
    this.$carousel = this.$element.querySelector('#product-carousel');
    this.$carouselIndicators = createElement('div', 'carousel-indicators', []) as HTMLElement;
    this.$carouselInner = createElement('div', 'carousel-inner', []) as HTMLElement;
    this.$productPath = this.$element.querySelector('.details-layout__path');
    this.$productName = this.$element.querySelector('.details-layout__product-name');
    this.$productDescr = this.$element.querySelector('.descr-section__descr-text');
    this.$productPrice = this.$element.querySelector('.prices__price');
    this.$productPriceSale = this.$element.querySelector('.prices__price_sale');
    this.$btnSizeXS = this.$element.querySelector('.size-select__button size-select__button_xs');
    this.$btnSizeS = this.$element.querySelector('.size-select__button size-select__button_s');
    this.$btnSizeM = this.$element.querySelector('.size-select__button size-select__button_m');
    this.$btnSizeL = this.$element.querySelector('.size-select__button size-select__button_l');
    this.$btnSizeXL = this.$element.querySelector('.size-select__button size-select__button_xl');
    this.productData = getProductDetails('jg-1');
    this.updateProductDetails();
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet, bootstrap];
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'location') {
      this.style.display = newValue === 'test' ? '' : 'none';
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    if (!oldState) return;
    if (oldState.location.location !== newState.location.location)
      this.attributeChangedCallback('location', oldState.location.location, newState.location.location);
  }

  private static get observedAttributes(): string[] {
    return ['name', 'location'];
  }

  private async updateProductDetails(): Promise<void> {
    const productDet = (await this.productData).body.masterData.current;
    const name: string = productDet.name['en-US'];
    const descr: string | null = productDet.description ? productDet.description['en-US'] : null;
    const prices: Price | null = productDet.masterVariant.prices ? productDet.masterVariant.prices[0] : null;
    const { images } = productDet.masterVariant;

    if (this.$productName) this.$productName.textContent = name;
    if (this.$productDescr && descr) this.$productDescr.textContent = descr;
    if (prices) this.updatePrice(prices, prices.discounted);
    if (images) this.updateImages(images);
  }

  private updatePrice(prices: Price, discount?: DiscountedPrice | undefined): void {
    if (!this.$productPrice || !this.$productPriceSale) return;

    const priceString = (prices.value.centAmount / 10 ** prices.value.fractionDigits).toLocaleString('en-US', {
      style: 'currency',
      currency: prices.value.currencyCode,
    });
    this.$productPrice.textContent = priceString;

    if (discount) {
      const discountString = (discount.value.centAmount / 10 ** discount.value.fractionDigits).toLocaleString('en-US', {
        style: 'currency',
        currency: prices.value.currencyCode,
      });
      this.$productPriceSale.textContent = discountString;
      this.$productPriceSale.classList.add('active');
      this.$productPrice.classList.add('inactive');
    } else {
      this.$productPriceSale.classList.remove('active');
      this.$productPrice.classList.remove('inactive');
    }
  }

  private updateImages(images: Image[]): void {
    const multipleImg = images.length > 1;
    if (!this.$carousel) return;
    removeAllChildNodes(this.$carousel);
    removeAllChildNodes(this.$carouselInner);
    removeAllChildNodes(this.$carouselIndicators);

    this.$carousel.append(this.$carouselIndicators, this.$carouselInner);
    if (multipleImg) this.$carousel.append(this.$carouselBtns);

    for (let i = 0; i < images.length; i += 1) {
      const { url } = images[i];
      const img = createElement('img', 'd-block w-100', [
        ['src', url],
        ['alt', `Image ${i + 1}`],
      ]) as HTMLImageElement;
      const carouselItem = createElement('div', 'carousel-item', []) as HTMLElement;
      carouselItem.appendChild(img);
      this.$carouselInner.appendChild(carouselItem);
      if (multipleImg) {
        const indicator = createElement('button', '', [
          ['bsTarget', '#product-carousel'],
          ['data-bs-slide-to', `${i}`],
          ['aria-label', `Slide ${i + 1}`],
        ]) as HTMLButtonElement;
        this.$carouselIndicators.appendChild(indicator);
      }
    }
    if (this.$carouselInner.firstChild instanceof HTMLElement) this.$carouselInner.firstChild.classList.add('active');
    if (this.$carouselIndicators.firstChild instanceof HTMLElement) {
      this.$carouselIndicators.firstChild.classList.add('active');
      this.$carouselIndicators.firstChild.setAttribute('aria-current', 'true');
    }
  }
}
