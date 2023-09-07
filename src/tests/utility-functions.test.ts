/**
 * @jest-environment jsdom
 */
import { createElement } from '../utils/createElement';
import { createElementFromHTML } from '../utils/createElementFromHTML';
import createNodeFromHtml from '../utils/createNodeFromHtml';
import { removeAllChildNodes } from '../utils/removeAllChildNodes';

describe('Testing createNodeFromHTML', () => {
  it('Test with empty string', () => {
    const node = createNodeFromHtml('');
    expect(node instanceof DocumentFragment).toEqual(true);
  });
  it('Test with random letters', () => {
    const node = createNodeFromHtml('"№;%:');
    expect(node instanceof DocumentFragment).toEqual(true);
  });
  it('Test with html code', () => {
    const node = createNodeFromHtml(`<div>test</div>`);
    const element = node.firstChild;
    expect(element instanceof HTMLElement).toEqual(true);
  });
  it('Test with bigger html code', () => {
    const element = createElementFromHTML(`<div><p class="testclass">Test</p></div>`);
    const child = element.firstChild as HTMLElement;
    expect(child?.querySelector('.testclass')?.textContent).toEqual('Test');
  });
});

describe('Testing createElementFromHTML', () => {
  it('Test with empty string', () => {
    const element = createElementFromHTML('');
    expect(element instanceof DocumentFragment).toEqual(true);
  });
  it('Test with random letters', () => {
    const element = createElementFromHTML('"№;%:');
    expect(element instanceof DocumentFragment).toEqual(true);
  });
  it('Test with simple html code', () => {
    const element = createElementFromHTML(`<div>test</div>`);
    const child = element.firstChild;
    expect(child instanceof HTMLElement).toEqual(true);
  });
});

describe('Testing remove all child nodes', () => {
  it('All child elements and text should be removed', () => {
    const element = document.createElement('div');
    element.append(document.createElement('div'), document.createElement('h3'), document.createElement('p'));
    element.textContent = 'Test string';
    removeAllChildNodes(element);
    expect(!element.firstChild && !element.textContent).toEqual(true);
  });
});

describe('Testing createElement', () => {
  const element1 = createElement('', 'class1 class2', [['id', 'testid']]);
  const element2 = createElement('img', 'class1 class2', [
    ['id', 'testid'],
    ['src', 'url'],
  ]);
  it('Element should be div by default', () => {
    expect(element1?.tagName === 'DIV').toEqual(true);
  });
  it('Element should have nesessary classes', () => {
    expect(element1?.classList.contains('class1') && element1?.classList.contains('class2')).toEqual(true);
  });
  it('Element should have nesessary id', () => {
    expect(element1?.getAttribute('id') === 'testid').toEqual(true);
  });
  it('Testing img tag element', () => {
    expect(element2 instanceof HTMLImageElement).toEqual(true);
  });
  it('Testing src attribute', () => {
    expect(element2?.getAttribute('src') === 'url').toEqual(true);
  });
});
