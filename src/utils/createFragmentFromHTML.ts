export default (html: string): DocumentFragment => {
  const $template = document.createElement('template');
  $template.innerHTML = html;
  return $template.content.cloneNode(true) as DocumentFragment;
};
