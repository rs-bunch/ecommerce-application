import ElementHTML from './contact-card.html';
import stylesheet from './contact-card.module.scss';
import { bootstrap } from '../../styles/styles';
import createFragmentFromHTML from '../../utils/createFragmentFromHTML';

export default class extends HTMLElement {
  private $element: DocumentFragment;

  private $content: HTMLElement | null;

  private $firstName: HTMLSpanElement | null;

  private $lastName: HTMLSpanElement | null;

  private $birthDate: HTMLSpanElement | null;

  private $saveFirstNameButton: HTMLButtonElement | null;

  private $saveLasttNameButton: HTMLButtonElement | null;

  private $saveBirthDateButton: HTMLButtonElement | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$content = this.$element.querySelector('#content');
    this.$firstName = this.$element.querySelector('#first-name');
    this.$lastName = this.$element.querySelector('#last-name');
    this.$birthDate = this.$element.querySelector('#birth-date');
    this.$saveFirstNameButton = this.$element.querySelector('#save-first-name');
    this.$saveLasttNameButton = this.$element.querySelector('#save-last-name');
    this.$saveBirthDateButton = this.$element.querySelector('#save-birth-date');

    this.$content?.addEventListener('click', (e) => this.handleLineElements(e));
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.$element) this.shadowRoot?.appendChild(this.$element);
    if (this.shadowRoot) this.shadowRoot.adoptedStyleSheets = [bootstrap, stylesheet];
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'first-name' && this.$firstName) this.$firstName.innerText = newValue;
    if (attributeName === 'last-name' && this.$lastName) this.$lastName.innerText = newValue;
    if (attributeName === 'birth-date' && this.$birthDate) this.$birthDate.innerText = newValue;
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['first-name', 'last-name', 'birth-date'];
  }

  private handleLineElements(e: Event): void {
    if (e.target instanceof HTMLButtonElement && e.target.closest('.line')) {
      const $saveButton = e.target.closest('.line')?.querySelector('.line__save');
      const $editButton = e.target.closest('.line')?.querySelector('.line__edit');
      const $lineContent = e.target.closest('.line')?.querySelector('.line__content');
      const $lineInput = e.target.closest('.line')?.querySelector('.line__input');
      if (e.target.classList.contains('line__edit')) {
        if ($editButton instanceof HTMLButtonElement) $editButton.style.display = 'none';
        if ($saveButton instanceof HTMLButtonElement) $saveButton.style.display = 'inline';
        if ($lineContent instanceof HTMLElement && $lineInput instanceof HTMLInputElement) {
          $lineInput.value = $lineContent.innerHTML;
          $lineContent.style.display = 'none';
          $lineInput.style.display = 'inline';
        }
      }
      if (e.target.classList.contains('line__save')) {
        if ($editButton instanceof HTMLButtonElement) $editButton.style.display = 'inline';
        if ($saveButton instanceof HTMLButtonElement) $saveButton.style.display = '';
        if ($lineContent instanceof HTMLElement && $lineInput instanceof HTMLInputElement) {
          $lineContent.innerHTML = $lineInput.value;
          $lineContent.style.display = '';
          $lineInput.style.display = 'none';
        }
      }
    }
  }
}
