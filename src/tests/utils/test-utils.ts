export default class TestUtils {
  /**
   * Renders a given element with provided attributes
   * and returns a promise which resolves as soon as
   * rendered element becomes available.
   * @param {string} tag
   * @param {object} attributes
   * @returns {Promise<HTMLElement>}
   */
  public static render(tag: string, attributes = {}): Promise<HTMLElement> {
    TestUtils.renderToDocument(tag, attributes);
    return TestUtils.waitForComponentToRender(tag);
  }

  /**
   * Replaces document's body with provided element
   * including given attributes.
   * @param {string} tag
   * @param {object} attributes
   */
  public static renderToDocument(tag: string, attributes: Record<string, string>): void {
    const htmlAttributes = TestUtils.mapObjectToHTMLAttributes(attributes);
    document.body.innerHTML = `<${tag} ${htmlAttributes}></${tag}>`;
  }

  /**
   * Converts an object to HTML string representation of attributes.
   *
   * For example: `{ foo: "bar", baz: "foo" }`
   * becomes `foo="bar" baz="foo"`
   *
   * @param {object} attributes
   * @returns {string}
   */
  public static mapObjectToHTMLAttributes(attributes: Record<string, string>): string {
    return Object.entries(attributes).reduce((previous, current) => {
      return `${previous} ${current[0]}="${current[1]}"`;
    }, '');
  }

  /**
   * Returns a promise which resolves as soon as
   * requested element becomes available.
   * @param {string} tag
   * @returns {Promise<HTMLElement>}
   */
  public static async waitForComponentToRender(tag: string): Promise<HTMLElement> {
    return new Promise((resolve) => {
      function requestComponent(): void {
        const element: HTMLElement | null = document.querySelector(tag);
        if (element) {
          resolve(element);
        } else {
          window.requestAnimationFrame(requestComponent);
        }
      }
      requestComponent();
    });
  }
}
