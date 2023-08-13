import { Dispatch } from 'redux';
import ElementHTML from './index.html';
import createNodeFromHtml from '../../utils/createNodeFromHtml';
import { StateLocation } from '../../types';

export default class CustomOverlay extends HTMLElement {
  public $element: HTMLElement | null;

  private node: Node | null;

  constructor() {
    super();
    this.node = createNodeFromHtml(ElementHTML);
    if (this.node?.firstChild instanceof HTMLElement) this.$element = this.node.firstChild;
    else this.$element = null;
  }

  private connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (this.node) this.shadowRoot?.append(this.node);
    this.setAttribute('active', 'false');
  }

  private disconnectedCallback(): void {}

  private attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
    if (attributeName === 'active') {
      switch (newValue) {
        case 'true':
          this.$element?.classList.add('active');
          break;
        case 'false':
          this.$element?.classList.remove('active');
          break;
        default:
          break;
      }
    }
  }

  private mapStateToProps(oldState: StateLocation, newState: StateLocation): void {}

  private mapDispatchToProps(dispatch: Dispatch): { [index: string]: () => ReturnType<Dispatch> } {
    return {
      action: () => dispatch({ type: 'ACTION' }),
    };
  }

  private adoptedCallback(): void {}

  private static get observedAttributes(): string[] {
    return ['active'];
  }
}
