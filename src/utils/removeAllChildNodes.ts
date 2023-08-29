export const removeAllChildNodes = (parent: Element): void => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};
