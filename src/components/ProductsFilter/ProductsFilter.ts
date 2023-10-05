import elementHTML from './products-filter.html';
import { createElementFromHTML } from '../../utils/createElementFromHTML';
import productsFilter from './products-filter.module.scss';
import type { RootState, AppDispatch } from '../Store/store';
import { changeLocation } from '../Store/slices/locationSlice';
import { bootstrap } from '../../styles/styles';

function dumpPage(searchParams: URLSearchParams): void {
  // Dump page number when filtering
  let page = searchParams.get('page');
  if (page) {
    page = '0';
    searchParams.set('page', page);
  }
}

export default class ProductsFilter extends HTMLElement {
  private $element: HTMLElement | null;

  private $priceRange: HTMLInputElement | null;

  private $priceLabel: HTMLElement | null;

  private $sortName: HTMLElement | null;

  private $sortPrice: HTMLElement | null;

  private $clearBtn: HTMLButtonElement | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createElementFromHTML(elementHTML);
    this.$priceRange = this.$element.querySelector('#price-range');
    this.$priceLabel = this.$element.querySelector('#price-label');
    this.$sortName = this.$element.querySelector('#sort-name');
    this.$sortPrice = this.$element.querySelector('#sort-price');
    this.$clearBtn = this.$element.querySelector('#clear-btn');

    const sizeCheckArr = this.$element.querySelectorAll('.products-filter__size-check');
    sizeCheckArr.forEach((check) => {
      (check as HTMLElement).addEventListener('click', () => {
        const val = check.textContent;
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('size', `${val}`);

        dumpPage(searchParams);

        window.location.search = searchParams.toString();
      });
    });

    const colorCheckArr = this.$element.querySelectorAll('.products-filter__color-check');
    colorCheckArr.forEach((check) => {
      (check as HTMLElement).addEventListener('click', () => {
        const val = (check as HTMLElement).dataset.color;
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('color', `${val}`);

        dumpPage(searchParams);

        window.location.search = searchParams.toString();
      });
    });

    if (this.$clearBtn) {
      this.$clearBtn.addEventListener('click', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get('text.en');
        window.location.href = `${window.location.origin}${window.location.pathname}${
          search ? `?text.en=${search}` : ''
        }`;
      });
    }

    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
      this.shadowRoot.adoptedStyleSheets = [productsFilter, bootstrap];
    }
  }

  public connectedCallback(): void {
    if (!this.$priceRange || !this.$priceLabel) return;

    this.$priceRange.addEventListener('input', () => {
      if (!this.$priceRange || !this.$priceLabel) return;

      const val = this.$priceRange.value;
      this.$priceLabel.textContent = `${val}$`;
    });

    this.$priceRange.addEventListener('mouseup', () => {
      if (!this.$priceRange) return;

      const val = this.$priceRange.value;
      if (+val === 0) return;
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('price', `${Number(val) * 100}`);

      dumpPage(urlParams);

      window.location.search = urlParams.toString();
    });
  }

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    const { location } = newState.location;
    if (location !== undefined) {
      this.attributeChangedCallback('location', '', String(location));
    }
  }

  // redux dispath action
  private mapDispatchToProps(dispatch: AppDispatch): { [index: string]: ReturnType<AppDispatch> } {
    return {
      changeLocation: () => dispatch(changeLocation({ location: 'main' })),
    };
  }

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (!this.$element) return;
    if (attributeName === 'location') {
      const searchParams = new URLSearchParams(window.location.search);
      const path = `${window.location.origin}${window.location.pathname}`;
      if (!searchParams.size) {
        if (!this.$sortName || !this.$sortPrice) return;
        this.$sortName.dataset.href = `${path}?sort=name.en-US&order=asc`;
        this.$sortPrice.dataset.href = `${path}?sort=price&order=asc`;
      } else if (searchParams.size) {
        if (!this.$sortName || !this.$sortPrice) return;
        const order = searchParams.get('order');

        const price = searchParams.get('price');
        if (price && this.$priceRange && this.$priceLabel) {
          this.$priceRange.value = `${+price / 100}`;
          this.$priceLabel.textContent = `${+price / 100}$`;
        }

        if (!order) {
          this.$sortName.dataset.href = `${path}?${searchParams.toString()}&sort=name.en-US&order=asc`;
          this.$sortPrice.dataset.href = `${path}?${searchParams.toString()}&sort=price&order=asc`;
          return;
        }

        searchParams.delete('sort');
        searchParams.delete('order');
        this.$sortName.dataset.href = `${path}?${searchParams.toString()}&sort=name.en-US&order=${
          order === 'asc' ? 'desc' : 'asc'
        }`;
        this.$sortPrice.dataset.href = `${path}?${searchParams.toString()}&sort=price&order=${
          order === 'asc' ? 'desc' : 'asc'
        }`;
      }
      this.style.display = newValue === 'products' || newValue === 'search' ? '' : 'none';
    }
  }
}
