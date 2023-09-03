/**
 * @jest-environment jsdom
 */
import { createElementFromHTML } from '../utils/createElementFromHTML';
import createNodeFromHtml from '../utils/createNodeFromHtml';

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
