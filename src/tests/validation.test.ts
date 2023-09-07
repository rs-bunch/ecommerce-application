/**
 * @jest-environment jsdom
 */

import { validateEmail } from '../utils/validation/validateEmail';

describe('Testing email validation', () => {
  it('Test emty string', () => {
    const email = '';
    expect(() => validateEmail(email)).toThrow();
  });
  it('Test whitespaces', () => {
    const email = 'hello@wor ld.com';
    expect(() => validateEmail(email)).toThrow();
  });
  it('Test for special symbols', () => {
    const email = 'abc!de@email.com';
    expect(() => validateEmail(email)).toThrow();
  });
  it('Test has @', () => {
    const email = 'abcde.ru';
    expect(() => validateEmail(email)).toThrow();
  });
  it('Test has domain', () => {
    const email = 'abcde@.ru';
    expect(() => validateEmail(email)).toThrow();
  });
  it('Test has domain', () => {
    const email = 'abcde@abcd.';
    expect(() => validateEmail(email)).toThrow();
  });
});
