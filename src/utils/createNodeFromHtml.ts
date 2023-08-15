const createNodeFromHtml = (html: string): Node | null => {
  const template: HTMLTemplateElement = document.createElement('template');
  template.innerHTML = html;
  return template.content.cloneNode(true);
};

export default createNodeFromHtml;
