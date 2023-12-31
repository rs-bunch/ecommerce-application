import { Cart, DiscountedPrice, Image, Price, ProductData, ProductVariant } from '@commercetools/platform-sdk';
import createFragmentFromHTML from '../../utils/createFragmentFromHTML';
import type { AppDispatch, RootState } from '../Store/store';
import ElementHTML from './product-details.html';
import stylesheet from './product-details.module.scss';
import { bootstrap } from '../../styles/styles';
import { removeAllChildNodes } from '../../utils/removeAllChildNodes';
import { createElement } from '../../utils/createElement';
import { LineItemPayload, ProductState } from '../../dto/types';
import store from '../Store/store';
import { selectProductVariant } from '../Store/slices/productSlice';
import Carousel from './Carousel/Carousel';
import ImageModal from './ImageModal/ImageModal';
import { getCategoriesPath } from '../Api/rest/productList';
import { addLineItem, removeLineItem } from '../Store/slices/cartSlice';

const LOCALE_STRING = 'en-US';

customElements.define('image-modal', ImageModal);

export default class ProductDetails extends HTMLElement {
  private $element: DocumentFragment;

  public $modalElement: ImageModal;

  private carousel: Carousel;

  private modalSlider: Carousel;

  private $carouselIndicators: HTMLElement;

  private $carouselInner: HTMLElement;

  private $modalInner: HTMLElement;

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

  private $carouselContainer: HTMLElement | null;

  private $modalContainer: HTMLElement | null;

  private productState: ProductState | undefined;

  private $addToCartButton: HTMLButtonElement | null;

  private $removeFromCartButton: HTMLButtonElement | null;

  private addLineItem: ((payload: LineItemPayload) => void) | undefined;

  private removeLineItem: ((payload: { lineItemId: string }) => void) | undefined;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$modalElement = document.createElement('image-modal') as ImageModal;
    this.$carouselContainer = this.$element.querySelector('.content-gallery__carousel-container');
    this.$modalContainer = this.$modalElement.$element;
    this.carousel = new Carousel('productCarousel', this.$modalElement);
    this.modalSlider = new Carousel('modalSlider', this.$modalElement);
    if (this.carousel.$element) this.$carouselContainer?.appendChild(this.carousel.$element);
    if (this.modalSlider.$element) this.$modalContainer?.appendChild(this.modalSlider.$element);
    this.$carouselIndicators = createElement('div', 'carousel-indicators', []) as HTMLElement;
    this.$carouselInner = createElement('div', 'carousel-inner', []) as HTMLElement;
    this.$modalInner = createElement('div', 'carousel-inner', []) as HTMLElement;
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

    this.$addToCartButton = this.$element.querySelector('#add-to-cart');
    this.$addToCartButton?.addEventListener('click', () => this.addToCartHandler());

    this.$removeFromCartButton = this.$element.querySelector('#remove-from-cart');
    this.$removeFromCartButton?.addEventListener('click', () => this.removeFromCartHandler());
  }

  private addToCartHandler(): void {
    const payload: LineItemPayload = {
      productId: `${this.productState?.productId}`,
      variantId: this.productState?.variantId || 1,
      quantity: 1,
    };
    if (this.addLineItem) this.addLineItem(payload);
  }

  private removeFromCartHandler(): void {
    if (this.productState?.lineItemId && this.removeLineItem)
      this.removeLineItem({ lineItemId: this.productState.lineItemId });
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [stylesheet, bootstrap];
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: ProductState, newValue: ProductState): void {
    this.carousel.closeModal();
    if (attributeName === 'product') {
      if (newValue.product && oldValue.product !== newValue.product) this.updateProductDetails(newValue.product);
      else if (newValue.variantId && oldValue.variantId !== newValue.variantId) {
        const data =
          newValue.variantId === 1
            ? newValue.product?.masterVariant
            : newValue.product?.variants.find((variant) => variant.id === newValue.variantId);
        if (data && data.prices) this.updatePrices(data.prices[0], data.prices[0].discounted);
        if (data && data.images?.length) {
          this.carousel.updateImages(data.images, { carouselName: 'productCarousel', isModal: false });
          this.modalSlider.updateImages(data.images, { carouselName: 'modalSlider', isModal: true });
        }
        if (data && !data.images?.length && newValue.product?.masterVariant.images) {
          this.carousel.updateImages(newValue.product?.masterVariant.images, {
            carouselName: 'productCarousel',
            isModal: false,
          });
          this.modalSlider.updateImages(newValue.product?.masterVariant.images, {
            carouselName: 'modalSlider',
            isModal: true,
          });
        }
      }
    }
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    if (!oldState) return;
    if (
      oldState.product !== newState.product ||
      oldState.cart.cart.lineItems.length !== newState.cart.cart.lineItems.length
    ) {
      this.productState = { ...newState.product };

      const lineItemId = this.getLineItemId(newState.product.productId, newState.cart.cart);
      if (lineItemId) {
        Object.assign(this.productState, { lineItemId });
        if (this.$addToCartButton) this.$addToCartButton.style.display = 'none';
        if (this.$removeFromCartButton) this.$removeFromCartButton.style.display = '';
      }

      if (!lineItemId) {
        if (this.$addToCartButton) this.$addToCartButton.style.display = '';
        if (this.$removeFromCartButton) this.$removeFromCartButton.style.display = 'none';
      }

      this.attributeChangedCallback('product', oldState.product, newState.product);
    }
    if (oldState.location !== newState.location)
      this.style.display = newState.location.location === 'product' ? '' : 'none';
  }

  // redux dispath action
  private mapDispatchToProps(dispatch: AppDispatch): { [index: string]: ReturnType<AppDispatch> } {
    return {
      addLineItem: (payload: LineItemPayload) => dispatch(addLineItem(payload)),
      removeLineItem: (payload: { lineItemId: string }) => dispatch(removeLineItem(payload)),
    };
  }

  private static get observedAttributes(): string[] {
    return ['location', 'product'];
  }

  private async updateProductDetails(data: ProductData): Promise<void> {
    const name: string = data.name[LOCALE_STRING];
    const descr: string | null = data.description ? data.description[LOCALE_STRING] : null;
    const prices: Price | null = data.masterVariant.prices ? data.masterVariant.prices[0] : null;
    const { images } = data.masterVariant;

    if (this.$productName) this.$productName.textContent = name;
    if (this.$productDescr && descr) this.$productDescr.textContent = descr;
    if (prices) this.updatePrices(prices, prices.discounted);
    if (images) {
      this.carousel.updateImages(images, { carouselName: 'productCarousel', isModal: false });
      this.modalSlider.updateImages(images, { carouselName: 'modalSlider', isModal: true });
    }
    this.initSizes(data);
    this.updateCategoriesPath(data.categories[0].id);
  }

  private updatePrices(prices: Price, discount?: DiscountedPrice | undefined): void {
    if (!this.$productPrice || !this.$productPriceSale) return;

    const priceString = (prices.value.centAmount / 10 ** prices.value.fractionDigits).toLocaleString(LOCALE_STRING, {
      style: 'currency',
      currency: prices.value.currencyCode,
    });
    this.$productPrice.textContent = priceString;

    if (discount) {
      const discountString = (discount.value.centAmount / 10 ** discount.value.fractionDigits).toLocaleString(
        LOCALE_STRING,
        {
          style: 'currency',
          currency: prices.value.currencyCode,
        }
      );
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

  private initSizes(data: ProductData): void {
    this.resetSizeBtns();
    data.variants.forEach((variant: ProductVariant) => {
      variant.attributes?.forEach((attr: { name: string; value: string }) => {
        if (attr.name === 'Size') {
          this.sizeBtns[attr.value]?.classList.add('shown');
          this.sizeBtns[attr.value]?.addEventListener('click', (event: Event) => {
            store.dispatch(selectProductVariant({ variantId: variant.id }));
            Object.values(this.sizeBtns).forEach((btn) => btn?.classList.remove('selected'));
            if (event.target instanceof HTMLElement) event.target.classList.add('selected');
          });
        }
      });
    });
    data.masterVariant.attributes?.forEach((attr: { name: string; value: string }) => {
      if (attr.name === 'Size') this.sizeBtns[attr.value]?.classList.add('shown', 'selected');
      this.sizeBtns[attr.value]?.addEventListener('click', (event: Event) => {
        store.dispatch(selectProductVariant({ variantId: data.masterVariant.id }));
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
        copy.classList.remove('selected', 'shown');
      }
    });
  }

  private async updateCategoriesPath(id: string): Promise<void> {
    this.$productPath?.querySelector('breadcrumb-nav')?.remove();
    this.$productPath?.querySelector('breadcrumb-element')?.remove();
    const $breadcrumbElement = document.createElement('breadcrumb-element');
    getCategoriesPath(id, LOCALE_STRING).then((res) => {
      res.forEach((category) => {
        const $link = document.createElement('span');
        $link.setAttribute('slot', 'link');
        $link.setAttribute('data-href', `/products/${category.id}`);
        $link.innerText = category.name;
        $breadcrumbElement.appendChild($link);
      });
    });
    this.$productPath?.append($breadcrumbElement);
  }

  private getLineItemId(productId: string, cart: Cart): string | null {
    return cart.lineItems.find((item) => item.productId === productId)?.id || null;
  }
}
