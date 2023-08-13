export const createElementFromHTML = (html: string): HTMLElement => {
  const $template = document.createElement('template');
  $template.innerHTML = html;
  return $template.content.cloneNode(true) as HTMLElement;
};
