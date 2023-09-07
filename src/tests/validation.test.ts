/**
 * @jest-environment jsdom
 */

import {
  validateEmail,
  validatePassword,
  validateName,
  validateStreet,
  validateZipCode,
} from '../utils/validation/textValidation';

describe('Testing email validation', () => {
  it('Test emty string', () => {
    const email = '';
    expect((): void | Error => validateEmail(email)).toThrow();
  });
  it('Test whitespaces', () => {
    const email = 'hello@wor ld.com';
    expect((): void | Error => validateEmail(email)).toThrow();
  });
  it('Test for special symbols', () => {
    const email = 'abc!de@email.com';
    expect((): void | Error => validateEmail(email)).toThrow();
  });
  it('Test without @', () => {
    const email = 'abcde.ru';
    expect((): void | Error => validateEmail(email)).toThrow();
  });
  it('Test has domain', () => {
    const email = 'abcde@.ru';
    expect((): void | Error => validateEmail(email)).toThrow();
  });
  it('Test has domain', () => {
    const email = 'abcde@abcd.';
    expect((): void | Error => validateEmail(email)).toThrow();
  });
  it('Test with backwards email', () => {
    const email = 'abcde.ru@abcd';
    expect((): void | Error => validateEmail(email)).toThrow();
  });
});

describe('Testing password validation', () => {
  it('Test empty string', () => {
    const password = '';
    expect((): void | Error => validatePassword(password)).toThrow();
  });
  it('Test whitespaces', () => {
    const password = 'Abc12345 !123';
    expect((): void | Error => validatePassword(password)).toThrow();
  });
  it('Test for special symbols', () => {
    const password = 'Abc12345__32';
    expect((): void | Error => validatePassword(password)).toThrow();
  });
  it('Test min length', () => {
    const password = 'Ab12!';
    expect((): void | Error => validatePassword(password)).toThrow();
  });
  it('Test has lower case', () => {
    const password = 'ABCDE12345!';
    expect((): void | Error => validatePassword(password)).toThrow();
  });
  it('Test has upper case', () => {
    const password = 'abcdeabcd123!45';
    expect((): void | Error => validatePassword(password)).toThrow();
  });
});

describe('Testing name validation', () => {
  it('Test whitespaces', () => {
    const name = 'Test Name';
    expect((): void | Error => validateName(name)).toThrow();
  });
  it('Test empty string', () => {
    const name = '';
    expect((): void | Error => validateName(name)).toThrow();
  });
  it('Test with numbers', () => {
    const name = 'Testname123';
    expect((): void | Error => validateName(name)).toThrow();
  });
  it('Test with special symbols', () => {
    const name = 'Test!';
    expect((): void | Error => validateName(name)).toThrow();
  });
});

describe('Testing street validation', () => {
  it('Test whitespaces', () => {
    const street = 'Test street';
    expect((): void | Error => validateStreet(street)).not.toThrow();
  });
  it('Test empty string', () => {
    const street = '';
    expect((): void | Error => validateStreet(street)).toThrow();
  });
});

describe('Testing zip code validation', () => {
  it('Test whitespaces with US', () => {
    const zipcode = 'Test zip code';
    expect((): void | Error => validateZipCode(zipcode, 'US')).toThrow();
  });
  it('Test empty string US', () => {
    const zipcode = '';
    expect((): void | Error => validateZipCode(zipcode, 'US')).toThrow();
  });
  it('Test empty string CA', () => {
    const zipcode = '';
    expect((): void | Error => validateZipCode(zipcode, 'CA')).toThrow();
  });
  it('Test letters string US', () => {
    const zipcode = 'abcde';
    expect((): void | Error => validateZipCode(zipcode, 'US')).toThrow();
  });
  it('Test letters string CA', () => {
    const zipcode = 'abcde';
    expect((): void | Error => validateZipCode(zipcode, 'CA')).toThrow();
  });
  it('Test correct code US', () => {
    const zipcode = '00000';
    expect((): void | Error => validateZipCode(zipcode, 'US')).not.toThrow();
  });
  it('Test correct code CA', () => {
    const zipcode = 'Z0Z 0Z0';
    expect((): void | Error => validateZipCode(zipcode, 'CA')).not.toThrow();
  });
});
