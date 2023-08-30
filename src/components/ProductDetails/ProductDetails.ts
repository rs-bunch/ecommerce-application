import { DiscountedPrice, Image, Price, ProductData, ProductVariant } from '@commercetools/platform-sdk';
import createFragmentFromHTML from '../../utils/createFragmentFromHTML';
import type { RootState } from '../Store/store';
import ElementHTML from './product-details.html';
import carouselBtnHTML from './carousel-buttons.html';
import stylesheet from './product-details.module.scss';
import { bootstrap } from '../../styles/styles';
import { removeAllChildNodes } from '../../utils/removeAllChildNodes';
import { createElement } from '../../utils/createElement';
import { ProductState } from '../../dto/types';
import store from '../Store/store';
import { selectProductVariant } from '../Store/productSlice';

export default class ProductDetails extends HTMLElement {
  private $element: DocumentFragment;

  private $carouselBtns: DocumentFragment;

  private $carousel: Element | null;

  private $carouselIndicators: HTMLElement;

  private $carouselInner: HTMLElement;

  private $productPath: Element | null;

  private $productName: Element | null;

  private $productDescr: Element | null;

  private $productPrice: Element | null;

  private $productPriceSale: Element | null;

  private $sizeBtns: Element | null;

  private $btnSizeXS: Element | null;

  private $btnSizeS: Element | null;

  private $btnSizeM: Element | null;

  private $btnSizeL: Element | null;

  private $btnSizeXL: Element | null;

  private sizeBtns: { [key: string]: Element | null };

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
    this.$sizeBtns = this.$element.querySelector('.size-select__buttons');
    this.$btnSizeXS = this.$element.querySelector('.size-select__button_xs');
    this.$btnSizeS = this.$element.querySelector('.size-select__button_s');
    this.$btnSizeM = this.$element.querySelector('.size-select__button_m');
    this.$btnSizeL = this.$element.querySelector('.size-select__button_l');
    this.$btnSizeXL = this.$element.querySelector('.size-select__button_xl');
    this.sizeBtns = {
      XS: this.$btnSizeXS,
      S: this.$btnSizeS,
      M: this.$btnSizeM,
      L: this.$btnSizeL,
      XL: this.$btnSizeXL,
    };
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet, bootstrap];
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: ProductState, newValue: ProductState): void {
    if (attributeName === 'product') {
      if (newValue.product && oldValue.product !== newValue.product) this.updateProductDetails(newValue.product);
      else if (newValue.id && oldValue.id !== newValue.id) {
        const data =
          newValue.id === 1
            ? newValue.product?.masterVariant
            : newValue.product?.variants.find((e) => e.id === newValue.id);
        const oldData =
          oldValue.id === 1
            ? oldValue.product?.masterVariant
            : oldValue.product?.variants.find((e) => e.id === oldValue.id);
        if (data && data.price) this.updatePrices(data.price);
        if (data && !this.checkForSameUrls(oldData?.images, data.images)) this.updateImages(data.images);
      }
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    if (!oldState) return;
    if (oldState.product !== newState.product)
      this.attributeChangedCallback('product', oldState.product, newState.product);
    if (oldState.location !== newState.location)
      this.style.display = newState.location.location === 'test' ? '' : 'none';
  }

  private static get observedAttributes(): string[] {
    return ['location', 'product'];
  }

  private async updateProductDetails(data: ProductData): Promise<void> {
    const name: string = data.name['en-US'];
    const descr: string | null = data.description ? data.description['en-US'] : null;
    const prices: Price | null = data.masterVariant.prices ? data.masterVariant.prices[0] : null;
    const { images } = data.masterVariant;

    if (this.$productName) this.$productName.textContent = name;
    if (this.$productDescr && descr) this.$productDescr.textContent = descr;
    if (prices) this.updatePrices(prices, prices.discounted);
    if (images) this.updateImages(images);
    this.initSizes(data);
  }

  private updatePrices(prices: Price, discount?: DiscountedPrice | undefined): void {
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

  private checkForSameUrls(oldimages: Image[] | undefined, newimages: Image[] | undefined): boolean {
    if (!oldimages || !newimages) return false;
    if (oldimages.length !== newimages.length) return false;
    if (oldimages.every((element, index) => element.url === newimages[index].url)) return true;
    return false;
  }

  private updateImages(images: Image[] | undefined): void {
    if (!this.$carousel) return;
    this.resetCarousel();
    if (!images) {
      this.putPlaceholderImage();
      return;
    }

    const multipleImg = images.length > 1;
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

  private resetCarousel(): void {
    if (!this.$carousel) return;
    removeAllChildNodes(this.$carousel);
    removeAllChildNodes(this.$carouselInner);
    removeAllChildNodes(this.$carouselIndicators);
    this.$carousel.append(this.$carouselIndicators, this.$carouselInner);
  }

  private putPlaceholderImage(): void {
    const carouselItem = createElement('div', 'carousel-item', []) as HTMLElement;
    const img = createElement('img', 'd-block w-100', [
      ['src', 'https://placehold.jp/569x1200.png?text=No%20Image'],
      ['alt', `Image 1`],
    ]) as HTMLImageElement;
    carouselItem.appendChild(img);
    this.$carouselInner.appendChild(carouselItem);
  }

  private initSizes(data: ProductData): void {
    this.resetSizeBtns();
    data.variants.forEach((variant: ProductVariant) => {
      variant.attributes?.forEach((attr: { name: string; value: string }) => {
        if (attr.name === 'Size') {
          this.sizeBtns[attr.value]?.classList.add('shown');
          this.sizeBtns[attr.value]?.addEventListener('click', (event: Event) => {
            store.dispatch(selectProductVariant({ id: variant.id }));
            Object.values(this.sizeBtns).forEach((btn) => btn?.classList.remove('selected'));
            if (event.target instanceof HTMLElement) event.target.classList.add('selected');
          });
        }
      });
    });
    data.masterVariant.attributes?.forEach((attr: { name: string; value: string }) => {
      if (attr.name === 'Size') this.sizeBtns[attr.value]?.classList.add('shown', 'selected');
      this.sizeBtns[attr.value]?.addEventListener('click', (event: Event) => {
        store.dispatch(selectProductVariant({ id: data.masterVariant.id }));
        Object.values(this.sizeBtns).forEach((btn) => btn?.classList.remove('selected'));
        if (event.target instanceof HTMLElement) event.target.classList.add('selected');
      });
    });
  }

  private resetSizeBtns(): void {
    if (this.$sizeBtns) removeAllChildNodes(this.$sizeBtns);
    Object.entries(this.sizeBtns).forEach(([key, el]) => {
      const copy = el?.cloneNode(true);
      if (copy instanceof Element) {
        this.sizeBtns[key] = copy;
        this.$sizeBtns?.appendChild(copy);
      }
    });
  }
}
