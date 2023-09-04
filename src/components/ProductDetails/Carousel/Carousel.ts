import { Image } from '@commercetools/platform-sdk';
import { createElement } from '../../../utils/createElement';
import { removeAllChildNodes } from '../../../utils/removeAllChildNodes';
import carouselBtnHTML from './carousel-buttons.html';
import sliderBtnHTML from './slider-buttons.html';
import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';
import { bootstrap } from '../../../styles/styles';
import ImageModal from '../ImageModal/ImageModal';

export default class Carousel extends HTMLElement {
  public $element: HTMLElement | null;

  private idString: string;

  public $modalContainer: ImageModal;

  private $carouselIndicators: HTMLElement;

  private $carouselInner: HTMLElement;

  private $carouselBtns: DocumentFragment;

  private $sliderBtns: DocumentFragment;

  private $btnPrev: Element | null;

  private $btnNext: Element | null;

  private bindedClosedModal: () => void;

  private bindedSlidePrev: () => void;

  private bindedSlideNext: () => void;

  constructor(id: string, modalContainer: ImageModal) {
    super();
    this.idString = id;
    this.$element = createElement('div', 'carousel carousel-dark slide', [['id', id]]);
    this.$modalContainer = modalContainer;
    this.$carouselIndicators = createElement('div', 'carousel-indicators', []) as HTMLElement;
    this.$carouselInner = createElement('div', 'carousel-inner', []) as HTMLElement;
    this.$carouselBtns = createFragmentFromHTML(carouselBtnHTML);
    this.$sliderBtns = createFragmentFromHTML(sliderBtnHTML);
    this.$btnPrev =
      id === 'productCarousel'
        ? this.$carouselBtns.querySelector('.carousel-control-prev')
        : this.$sliderBtns.querySelector('.carousel-control-prev');
    this.$btnNext =
      id === 'productCarousel'
        ? this.$carouselBtns.querySelector('.carousel-control-next')
        : this.$sliderBtns.querySelector('.carousel-control-next');
    this.bindedSlidePrev = this.slidePrev.bind(this);
    this.bindedSlideNext = this.slideNext.bind(this);
    this.bindedClosedModal = this.closeModal.bind(this);
    this.initArrowBtns();
  }

  private connectedCallback(): void {}

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

  public updateImages(images: Image[] | undefined, options: { carouselName: string; isModal: boolean }): void {
    if (!this.$element) return;
    this.resetCarousel();
    if (!images) {
      this.putPlaceholderImage();
      return;
    }

    const multipleImg = images.length > 1;
    if (multipleImg) {
      if (this.idString === 'productCarousel') this.$element.append(this.$carouselBtns);
      if (this.idString === 'modalSlider') this.$element.append(this.$sliderBtns);
    }

    for (let i = 0; i < images.length; i += 1) {
      const { url } = images[i];
      const img = createElement('img', 'd-block w-100', [
        ['src', url],
        ['alt', `Image ${i + 1}`],
        ['data-target-slide', `${i}`],
      ]) as HTMLImageElement;
      const carouselItem = createElement('div', 'carousel-item', [['data-target-slide', `${i}`]]) as HTMLElement;
      carouselItem.appendChild(img);
      this.$carouselInner.appendChild(carouselItem);
      if (!options.isModal) carouselItem.addEventListener('click', this.openModal.bind(this));
      if (multipleImg) {
        const indicator = createElement('button', '', [
          ['type', 'button'],
          ['bsTarget', options.carouselName],
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
    const carouselItem = createElement('div', 'carousel-item', [['data-target-slide', `0`]]) as HTMLElement;
    const img = createElement('img', 'd-block w-100', [
      ['src', 'https://placehold.jp/569x1200.png?text=No%20Image'],
      ['alt', `Image 1`],
      ['data-target-slide', `0`],
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

  private openModal(event: Event): void {
    const overlay: HTMLElement | null = document.querySelector('custom-overlay');
    if (this.$modalContainer.$closeBtn)
      this.$modalContainer.$closeBtn.addEventListener('click', this.bindedClosedModal);
    document.querySelector('body')?.append(this.$modalContainer);

    overlay?.addEventListener('click', this.bindedClosedModal, { once: true });
    overlay?.setAttribute('active', 'true');

    if (!this.$carouselIndicators.firstChild || !(event.target instanceof HTMLElement)) return;
    this.syncImageInModal(event.target);
  }

  public closeModal(): void {
    const overlay: HTMLElement | null = document.querySelector('custom-overlay');
    document.querySelector('image-modal')?.remove();
    overlay?.removeEventListener('click', this.bindedClosedModal);
    overlay?.setAttribute('active', 'false');
  }

  private static get observedAttributes(): string[] {
    return ['name'];
  }

  private syncImageInModal(element: HTMLElement): void {
    const slideNumber = element.dataset.targetSlide;
    if (!Number.isNaN(Number(slideNumber))) {
      this.$modalContainer.$element?.querySelectorAll('.active')?.forEach((el) => {
        el.classList.remove('active');
      });
      const slides = this.$modalContainer.$element?.querySelectorAll('.carousel-item');
      const indicators = this.$modalContainer.$element?.querySelectorAll('.carousel-indicators > *');
      if (slides?.length && indicators?.length) {
        indicators[Number(slideNumber)]?.classList.add('active');
        slides[Number(slideNumber)]?.classList.add('active');
        slides[Number(slideNumber)]?.setAttribute('aria-current', 'true');
      }
    }
  }
}

customElements.define('carousel-element', Carousel);
