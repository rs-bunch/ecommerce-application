import { Image } from '@commercetools/platform-sdk';
import { createElement } from '../../../utils/createElement';
import { removeAllChildNodes } from '../../../utils/removeAllChildNodes';
import carouselBtnHTML from './carousel-buttons.html';
import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';
import { bootstrap } from '../../../styles/styles';

export default class Carousel extends HTMLElement {
  public $element: HTMLElement | null;

  private $carouselIndicators: HTMLElement;

  private $carouselInner: HTMLElement;

  private $carouselBtns: DocumentFragment;

  private $btnPrev: Element | null;

  private $btnNext: Element | null;

  private bindedSlidePrev: () => void;

  private bindedSlideNext: () => void;

  constructor() {
    super();
    this.$element = createElement('div', 'carousel carousel-dark slide', [['id', 'product-carousel']]);
    this.$carouselIndicators = createElement('div', 'carousel-indicators', []) as HTMLElement;
    this.$carouselInner = createElement('div', 'carousel-inner', []) as HTMLElement;
    this.$carouselBtns = createFragmentFromHTML(carouselBtnHTML);
    this.$btnPrev = this.$carouselBtns.querySelector('.carousel-control-prev');
    this.$btnNext = this.$carouselBtns.querySelector('.carousel-control-next');
    this.bindedSlidePrev = this.slidePrev.bind(this);
    this.bindedSlideNext = this.slideNext.bind(this);
    this.initArrowBtns();
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [bootstrap];
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {}

  private adoptedCallback(): void {}

  private initArrowBtns(): void {
    this.$btnPrev?.addEventListener('click', this.bindedSlidePrev);
    this.$btnNext?.addEventListener('click', this.bindedSlideNext);
  }

  private slidePrev(): void {
    const activeSlide = this.$carouselInner.querySelector('.active');
    const activeSelector = this.$carouselIndicators.querySelector('.active');

    activeSlide?.classList.remove('active');
    if (activeSlide?.previousElementSibling) activeSlide.previousElementSibling?.classList.add('active');
    else this.$carouselInner.lastElementChild?.classList.add('active');

    activeSelector?.classList.remove('active');
    if (activeSelector?.previousElementSibling) activeSelector.previousElementSibling?.classList.add('active');
    else this.$carouselIndicators.lastElementChild?.classList.add('active');
  }

  private slideNext(): void {
    const activeSlide = this.$carouselInner.querySelector('.active');
    const activeSelector = this.$carouselIndicators.querySelector('.active');

    activeSlide?.classList.remove('active');
    if (activeSlide?.nextElementSibling) activeSlide.nextElementSibling?.classList.add('active');
    else this.$carouselInner.firstElementChild?.classList.add('active');

    activeSelector?.classList.remove('active');
    if (activeSelector?.nextElementSibling) activeSelector.nextElementSibling?.classList.add('active');
    else this.$carouselIndicators.firstElementChild?.classList.add('active');
  }

  public updateImages(images: Image[] | undefined): void {
    if (!this.$element) return;
    this.resetCarousel();
    if (!images) {
      this.putPlaceholderImage();
      return;
    }

    const multipleImg = images.length > 1;
    if (multipleImg) this.$element.append(this.$carouselBtns);

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
          ['type', 'button'],
          ['bsTarget', 'product-carousel'],
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
    if (multipleImg) this.initIndicators(this.$carouselInner, this.$carouselIndicators);
  }

  private resetCarousel(): void {
    if (!this.$element) return;
    removeAllChildNodes(this.$element);
    removeAllChildNodes(this.$carouselInner);
    removeAllChildNodes(this.$carouselIndicators);
    this.$element.append(this.$carouselIndicators, this.$carouselInner);
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

  private initIndicators(slidesElement: Element, indicatorElement: Element): void {
    const slides = slidesElement.querySelectorAll('.carousel-item');
    const indicators = indicatorElement.querySelectorAll('button');
    indicators.forEach((indicator) =>
      indicator.addEventListener('click', (event: Event) => {
        if (event.target instanceof HTMLElement) {
          const slideNumber = event.target.dataset.bsSlideTo;
          if (!Number.isNaN(Number(slideNumber))) {
            slidesElement.querySelector('.active')?.classList.remove('active');
            const currIndicator = indicatorElement.querySelector('.active');
            currIndicator?.classList.remove('active');
            currIndicator?.removeAttribute('aria-current');
            slides[Number(slideNumber)]?.classList.add('active');
            indicators[Number(slideNumber)]?.classList.add('active');
            indicators[Number(slideNumber)]?.setAttribute('aria-current', 'true');
          }
        }
      })
    );
  }

  private static get observedAttributes(): string[] {
    return ['name'];
  }
}

customElements.define('carousel-element', Carousel);
