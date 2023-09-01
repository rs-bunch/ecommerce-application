export const createElement = (el: string, classNames: string, dataAttr: [string, string][]): HTMLElement | null => {
  const element: HTMLElement = document.createElement(el || 'div');
  if (classNames) {
    element.classList.add(...classNames.split(' '));
  }

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]: [string, string]) => {
      if (!attrValue) element.setAttribute(attrName, '');
      if (
        attrName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck|contenteditable|src|alt|type|aria-label/)
      ) {
        element.setAttribute(attrName, attrValue);
      } else {
        element.dataset[attrName] = attrValue;
      }
    });
  }
  return element;
};
