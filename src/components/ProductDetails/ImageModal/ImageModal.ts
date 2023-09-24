import stylesheet from './image-modal.module.scss';
import { bootstrap } from '../../../styles/styles';
import { createElement } from '../../../utils/createElement';

export default class ImageModal extends HTMLElement {
  public $element: HTMLElement | null;

  public $closeBtn: HTMLElement | null;

  constructor() {
    super();
    this.$element = createElement('div', 'image-modal__container', []);
    this.$closeBtn = createElement('div', 'close-btn', []);
    this.attachShadow({ mode: 'open' });
    if (this.$element && this.$closeBtn) this.shadowRoot?.append(this.$element, this.$closeBtn);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [bootstrap, stylesheet];
  }

  private static get observedAttributes(): string[] {
    return ['name'];
  }
}
