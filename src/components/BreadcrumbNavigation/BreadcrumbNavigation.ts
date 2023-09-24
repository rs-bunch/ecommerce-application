import { CategoiesPathData } from '../../dto/types';
import { createElement } from '../../utils/createElement';
import styleshhet from './breadcrumb-navigation.module.scss';

export default class Breadcrumb extends HTMLElement {
  public $element: HTMLElement | null;

  constructor(data: CategoiesPathData, type: 'productList' | 'productDetails') {
    super();
    this.$element = createElement('div', 'breadcrumb__line', []);
    this.createLinks(data, type);
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [styleshhet];
  }

  private static get observedAttributes(): string[] {
    return ['name'];
  }

  private createLinks(data: CategoiesPathData, type: 'productList' | 'productDetails'): void {
    for (let i = 0; i < data.length; i += 1) {
      const link = createElement('a', `breadcrumb-nav__link breadcrumb-nav__link_${type}`, [
        ['href', `/products/${data[i].id}`],
      ]);
      link?.setAttribute('href', '#');
      if (link) {
        link.textContent = data[i].name;
        this.$element?.append(link);
      }
      if (i === data.length - 1) return;
      const arrow = createElement('span', `breadcrumb-nav__arrow breadcrumb-nav__arrow_${type}`, []);
      if (arrow) {
        arrow.textContent = '>';
        this.$element?.append(arrow);
      }
    }
  }
}
