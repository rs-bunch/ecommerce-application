import elementHTML from './product-pagination.html';
import { createElementFromHTML } from '../../utils/createElementFromHTML';
import productPagination from './product-pagination.module.scss';
import type { RootState, AppDispatch } from '../Store/store';
import { changeLocation } from '../Store/slices/locationSlice';
import { bootstrap } from '../../styles/styles';
import { PAGE_SIZE } from '../../dto/constants';

export default class ProductsFilter extends HTMLElement {
  private $element: HTMLElement | null;

  private $prevBtn: HTMLElement | null;

  private $firstBtn: HTMLElement | null;

  private $nextBtn: HTMLElement | null;

  private $lastBtn: HTMLElement | null;

  private $pageNumber: HTMLElement | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.$element = createElementFromHTML(elementHTML);
    this.$prevBtn = this.$element.querySelector('#prev-btn');
    this.$nextBtn = this.$element.querySelector('#next-btn');
    this.$firstBtn = this.$element.querySelector('#first-btn');
    this.$lastBtn = this.$element.querySelector('#last-btn');
    this.$pageNumber = this.$element.querySelector('#page-number');

    if (!this.shadowRoot) return;
    if (this.$element) {
      this.shadowRoot?.appendChild(this.$element);
      this.shadowRoot.adoptedStyleSheets = [productPagination, bootstrap];
    }

    this.$firstBtn?.addEventListener('click', () => {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('page', '0');
      window.location.search = urlParams.toString();
    });

    this.$nextBtn?.addEventListener('click', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page');
      urlParams.set('page', `${Number(page) + 1}`);
      window.location.search = urlParams.toString();
    });

    this.$prevBtn?.addEventListener('click', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page');
      urlParams.set('page', `${Number(page) - 1}`);
      window.location.search = urlParams.toString();
    });
  }

  public connectedCallback(): void {}

  // redux state change observer
  private mapStateToProps(oldState: RootState, newState: RootState): void {
    const { location } = newState.location;
    const { productList } = newState;
    const { products } = productList;
    if (location !== undefined) {
      this.attributeChangedCallback('location', '', String(location));
    }

    if (products) {
      const productTotal = (products as { total: number }).total;
      const totalPages = Math.ceil(productTotal / PAGE_SIZE) - 1;

      this.$lastBtn?.addEventListener('click', () => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', `${totalPages}`);
        window.location.search = urlParams.toString();
      });

      const searchParams = new URLSearchParams(window.location.search);
      const currentPage = Number(searchParams.get('page'));

      if (this.$pageNumber) this.$pageNumber.textContent = `${currentPage + 1}`;
      console.log(totalPages, currentPage);

      if (currentPage === 0 && totalPages === 0) {
        if (!this.$prevBtn?.classList.contains('disabled')) {
          this.$prevBtn?.classList.add('disabled');
        }
        if (!this.$firstBtn?.classList.contains('disabled')) {
          this.$firstBtn?.classList.add('disabled');
        }
        if (!this.$nextBtn?.classList.contains('disabled')) {
          this.$nextBtn?.classList.add('disabled');
        }
        if (!this.$lastBtn?.classList.contains('disabled')) {
          this.$lastBtn?.classList.add('disabled');
        }
      } else if (currentPage === 0) {
        if (!this.$prevBtn?.classList.contains('disabled')) {
          this.$prevBtn?.classList.add('disabled');
        }
        if (!this.$firstBtn?.classList.contains('disabled')) {
          this.$firstBtn?.classList.add('disabled');
        }
        if (this.$nextBtn?.classList.contains('disabled')) {
          this.$nextBtn?.classList.remove('disabled');
        }
        if (this.$lastBtn?.classList.contains('disabled')) {
          this.$lastBtn?.classList.remove('disabled');
        }
      } else if (currentPage === totalPages) {
        if (this.$prevBtn?.classList.contains('disabled')) {
          this.$prevBtn?.classList.remove('disabled');
        }
        if (this.$firstBtn?.classList.contains('disabled')) {
          this.$firstBtn?.classList.remove('disabled');
        }
        if (!this.$nextBtn?.classList.contains('disabled')) {
          this.$nextBtn?.classList.add('disabled');
        }
        if (!this.$lastBtn?.classList.contains('disabled')) {
          this.$lastBtn?.classList.add('disabled');
        }
      }

      // if (currentPage === 0 && currentPage === totalPages) {
      //   this.$prevBtn?.classList.toggle('disabled');
      //   this.$firstBtn?.classList.toggle('disabled');
      //   this.$nextBtn?.classList.toggle('disabled');
      //   this.$lastBtn?.classList.toggle('disabled');
      // } else if (currentPage === 0) {
      //   this.$prevBtn?.classList.toggle('disabled');
      //   this.$firstBtn?.classList.toggle('disabled');
      //   if (this.$nextBtn?.classList.contains('disabled')) {
      //     this.$nextBtn?.classList.toggle('disabled');
      //     this.$lastBtn?.classList.toggle('disabled');
      //   }
      // } else if (currentPage === totalPages) {
      //   this.$nextBtn?.classList.toggle('disabled');
      //   this.$lastBtn?.classList.toggle('disabled');
      //   if (this.$prevBtn?.classList.contains('disabled')) {
      //     this.$prevBtn?.classList.toggle('disabled');
      //     this.$firstBtn?.classList.toggle('disabled');
      //   }
      // }
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
      this.style.display = newValue === 'products' || newValue === 'search' ? '' : 'none';
    }
  }
}

/* 
Проверить граничное значение
Отключить переход если страница = последняя страница - 1
*/
