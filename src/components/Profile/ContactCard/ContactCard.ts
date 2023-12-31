import { CustomerUpdate } from '@commercetools/platform-sdk';
import ElementHTML from './contact-card.html';
import stylesheet from './contact-card.module.scss';
import { bootstrap } from '../../../styles/styles';
import createFragmentFromHTML from '../../../utils/createFragmentFromHTML';
import { updateCustomerBindAction, updatePasswordBindAction } from '../../Store/store';
import createCustomerUpdateAction from '../../../utils/createCustomerUpdateAction';
import { TextValidator } from '../../../dto/types';
import {
  validateName,
  validateYearOld,
  validateEmail,
  validatePassword,
} from '../../../utils/validation/textValidation';

const ALLOWED_YEARS_OLD = 13;

export default class extends HTMLElement {
  private $element: DocumentFragment;

  private $content: HTMLElement | null;

  private $firstName: HTMLSpanElement | null;

  private $lastName: HTMLSpanElement | null;

  private $birthDate: HTMLSpanElement | null;

  private $email: HTMLSpanElement | null;

  private $password: HTMLSpanElement | null;

  private $firstNameField: HTMLElement | null;

  private $lastNameField: HTMLElement | null;

  private $birthDateField: HTMLElement | null;

  private $emailField: HTMLElement | null;

  private $currentPasswordField: HTMLElement | null;

  private $newPasswordField: HTMLElement | null;

  private $saveFirstNameButton: HTMLButtonElement | null;

  private $saveLasttNameButton: HTMLButtonElement | null;

  private $saveBirthDateButton: HTMLButtonElement | null;

  constructor() {
    super();
    this.$element = createFragmentFromHTML(ElementHTML);
    this.$content = this.$element.querySelector('#content');

    this.$firstNameField = this.$element.querySelector('#first-name-field');
    this.$lastNameField = this.$element.querySelector('#last-name-field');
    this.$birthDateField = this.$element.querySelector('#birth-date-field');
    this.$emailField = this.$element.querySelector('#email-field');
    this.$currentPasswordField = this.$element.querySelector('#current-password-field');
    this.$newPasswordField = this.$element.querySelector('#new-password-field');

    this.$firstName = this.$element.querySelector('#first-name');
    this.$lastName = this.$element.querySelector('#last-name');
    this.$birthDate = this.$element.querySelector('#birth-date');
    this.$email = this.$element.querySelector('#email');
    this.$password = this.$element.querySelector('#password');

    this.$saveFirstNameButton = this.$element.querySelector('#save-first-name');
    this.$saveLasttNameButton = this.$element.querySelector('#save-last-name');
    this.$saveBirthDateButton = this.$element.querySelector('#save-birth-date');

    this.$content?.addEventListener('click', (e) => this.handleLineElements(e));

    this.$firstNameField?.addEventListener('input', () => this.validateHandle(this.$firstNameField));
    this.$lastNameField?.addEventListener('input', () => this.validateHandle(this.$lastNameField));
    this.$birthDateField?.addEventListener('input', () => this.validateHandle(this.$birthDateField));
    this.$emailField?.addEventListener('input', () => this.validateHandle(this.$emailField));
    this.$currentPasswordField?.addEventListener('input', () => this.validateHandle(this.$currentPasswordField));
    this.$newPasswordField?.addEventListener('input', () => this.validateHandle(this.$newPasswordField));
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
    if (attributeName === 'email' && this.$email) this.$email.innerText = newValue;
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['first-name', 'last-name', 'birth-date', 'email'];
  }

  private handleLineElements(e: Event): void {
    if (e.target instanceof HTMLButtonElement && e.target.closest('.line')) {
      const $saveButton = e.target.closest('.line')?.querySelector('.line__save');
      const $editButton = e.target.closest('.line')?.querySelector('.line__edit');
      const $cancelButton = e.target.closest('.line')?.querySelector('.line__cancel');
      const $lineContent = e.target.closest('.line')?.querySelector('.line__content');
      const $lineFields = e.target.closest('.line')?.querySelectorAll('.line__field') as NodeListOf<HTMLElement>;
      const $lineInput = e.target.closest('.line')?.querySelector('.line__input');
      const $newPasswordInput = e.target.closest('.line')?.querySelector('#new-password');

      if (e.target.classList.contains('line__edit')) {
        if ($editButton instanceof HTMLButtonElement) $editButton.style.display = 'none';
        if ($saveButton instanceof HTMLButtonElement) $saveButton.style.display = 'inline';
        if ($cancelButton instanceof HTMLButtonElement) $cancelButton.style.display = 'inline';
        if ($lineContent instanceof HTMLElement && $lineInput instanceof HTMLInputElement) {
          if ($lineInput.getAttribute('name') !== 'currentPassword') {
            $lineInput.value = $lineContent.innerHTML;
          } else {
            $lineInput.value = '';
            if ($newPasswordInput instanceof HTMLInputElement) $newPasswordInput.value = '';
          }
          $lineContent.style.display = 'none';
          if ($lineFields.item(0)) $lineFields.item(0).style.display = 'inline';
          if ($lineFields.item(1)) $lineFields.item(1).style.display = 'inline';
        }
      }
      if (e.target.classList.contains('line__save')) {
        if ($lineContent instanceof HTMLElement && $lineInput instanceof HTMLInputElement) {
          if ($lineInput.getAttribute('name') !== 'currentPassword') {
            if ($lineContent.innerHTML !== $lineInput.value) {
              this.validateHandle(e.target.closest('.line__field'));
              if (!$lineInput.classList.contains('invalid')) {
                this.updateHandle($lineInput.name, $lineInput.value);
              }
            }
            if (!$lineInput.classList.contains('invalid')) {
              if ($cancelButton instanceof HTMLButtonElement) $cancelButton.style.display = '';
              if ($editButton instanceof HTMLButtonElement) $editButton.style.display = 'inline';
              if ($saveButton instanceof HTMLButtonElement) $saveButton.style.display = '';
              $lineContent.style.display = 'inline';
              if ($lineFields.item(0)) $lineFields.item(0).style.display = 'none';
            }
          }
          if ($lineInput.getAttribute('name') === 'currentPassword') {
            const currenFieldInput = $lineFields.item(0).querySelector('input');
            const newFieldInput = $lineFields.item(1).querySelector('input');
            this.validateHandle($lineFields.item(0));
            this.validateHandle($lineFields.item(1));

            if (currenFieldInput?.value && newFieldInput?.value) {
              if (!currenFieldInput.classList.contains('invalid') && !newFieldInput.classList.contains('invalid')) {
                this.updatePasswordHandle(currenFieldInput.value, newFieldInput.value);
              }
            }
          }
        }
      }
      if (e.target.classList.contains('line__cancel')) {
        if ($lineContent instanceof HTMLElement && $lineInput instanceof HTMLInputElement) {
          if ($cancelButton instanceof HTMLButtonElement) $cancelButton.style.display = '';
          if ($editButton instanceof HTMLButtonElement) $editButton.style.display = 'inline';
          if ($saveButton instanceof HTMLButtonElement) $saveButton.style.display = '';

          $lineContent.style.display = 'inline';
          $lineFields.item(0).style.display = 'none';
          $lineFields.item(0).querySelector('input')?.classList.remove('valid');
          $lineFields.item(0).querySelector('input')?.classList.remove('invalid');

          if ($lineFields.item(1)) {
            $lineFields.item(1).style.display = 'none';
            $lineFields.item(1).querySelector('input')?.classList.remove('valid');
            $lineFields.item(1).querySelector('input')?.classList.remove('invalid');
          }
        }
      }
    }
  }

  private updateHandle(attrName: string, attrValue: string): void {
    const id = String(this.getAttribute('customer-id'));
    const version = Number(this.getAttribute('customer-version'));
    const customerUpdateAction = createCustomerUpdateAction(attrName, attrValue);
    const query: CustomerUpdate = {
      version,
      actions: [],
    };
    if (customerUpdateAction) query.actions.push(customerUpdateAction);
    const payload = { id, query };
    if (payload) updateCustomerBindAction(payload);
  }

  private updatePasswordHandle(currentPassword: string, newPassword: string): void {
    const payload = {
      id: String(this.getAttribute('customer-id')),
      version: Number(this.getAttribute('customer-version')),
      currentPassword,
      newPassword,
    };
    if (payload) updatePasswordBindAction(payload);
  }

  private validateTextInput(field: HTMLElement | null, validator: TextValidator, payload?: string | number): void {
    if (field) {
      const input = field.querySelector('input');
      const invalidTooltip = field.querySelector('.invalid-tooltip');
      try {
        validator(input?.value || '', payload);
        if (input) input.classList.remove('invalid');
        if (input) input.classList.add('valid');
      } catch (error) {
        if (input && invalidTooltip && error instanceof Error) {
          invalidTooltip.innerHTML = error.message;
          if (input) input.classList.remove('valid');
          if (input) input.classList.add('invalid');
        }
      }
    }
  }

  private validateHandle(field: HTMLElement | null): void {
    const $input = field?.querySelector('input');
    if ($input && $input.hasAttribute('name')) {
      const name = $input.getAttribute('name');
      switch (name) {
        case 'firstName':
          this.validateTextInput(field, validateName);
          break;
        case 'lastName':
          this.validateTextInput(field, validateName);
          break;
        case 'dateOfBirth':
          this.validateTextInput(field, validateYearOld, ALLOWED_YEARS_OLD);
          break;
        case 'email':
          this.validateTextInput(field, validateEmail);
          break;
        case 'currentPassword':
          this.validateTextInput(field, validatePassword);
          break;
        case 'newPassword':
          this.validateTextInput(field, validatePassword);
          break;
        default:
          break;
      }
    }
  }
}
