import type { TextValidator } from '../../dto/types';

// Length
const hasMinimunLength = (value: string, length: number): Error | void => {
  if (value.length < length)
    throw new Error(length > 1 ? `Field length must be more than ${length} characters` : `Field must not be empty`);
};

// Symbols
const hasSymbol = (value: string, symbol: string): Error | void => {
  if (!value.includes(symbol)) throw new Error(`Must include a '${symbol}' symbol`);
};

const hasNoSymbol = (value: string, symbol: string): Error | void => {
  if (value.includes(symbol)) throw new Error(`Must NOT include a '${symbol}' symbol`);
};

const hasSpecialSymbol = (value: string): Error | void => {
  if (!/[!@#$%^&*]/.test(value)) throw new Error(`Must include at least one special character (!@#$%^&*)`);
};

const hasNoSpecialSymbol = (value: string): Error | void => {
  if (/[!#$%^&*?]/.test(value)) throw new Error(`Must NOT include special characters (!#$%^&*)`);
};

// Characters
const hasLowerCaseCharacter = (value: string): Error | void => {
  if (!/[a-z]/g.test(value)) throw new Error(`Must include a lowercase character on English`);
};

const hasUpperCaseCharacter = (value: string): Error | void => {
  if (!/[A-Z]/g.test(value)) throw new Error(`Must include a uppercase character on English`);
};

const hasDomainSyntax = (value: string): Error | void => {
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) throw new Error(`Incorrect. Example: "email@domain.com"`);
};

const hasNoWitespacesAround = (value: string): Error | void => {
  if (value !== value.trim()) throw new Error(`Must NOT start and end witespaces`);
};

const hasNoWitespacesInside = (value: string): Error | void => {
  if (value.split(' ').length > 1) throw new Error(`Must NOT witespaces inside`);
};

const hasCharsOnly = (value: string): Error | void => {
  if (!/[a-zA-Z]/g.test(value)) throw new Error(`English characters only`);
};

// Digits
const hasDigit = (value: string): Error | void => {
  if (!/[0-9]/.test(value)) throw new Error(`Must include at least one digit`);
};

const hasNoDigit = (value: string): Error | void => {
  if (/[0-9]/.test(value)) throw new Error(`Must NOT include digits`);
};

// Date
const moreThanYearsOld = (value: number, years: number): Error | void => {
  const timeNow = new Date();
  const timeYearsAgo = timeNow.setFullYear(timeNow.getFullYear() - years).valueOf();
  if (value > timeYearsAgo) throw new Error(`Must be older than ${years} years old`);
};

// Postcode
const hasPostalCodeUS = (value: string): Error | void => {
  if (!/^(\d{5})$/gi.test(value)) throw new Error(`Format must be 12345`);
};
const hasPostalCodeCA = (value: string): Error | void => {
  if (!/^[a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d$/gi.test(value)) throw new Error(`Format must be "A1B 2C3"`);
};

const validateEmail = (value: string): Error | void => {
  hasNoWitespacesAround(value);
  hasNoWitespacesInside(value);
  hasNoSpecialSymbol(value);
  hasMinimunLength(value, 1);
  hasSymbol(value, '@');
  hasDomainSyntax(value);
};

const validatePassword = (value: string): Error | void => {
  hasNoWitespacesAround(value);
  hasNoWitespacesInside(value);
  hasMinimunLength(value, 8);
  hasLowerCaseCharacter(value);
  hasUpperCaseCharacter(value);
  hasDigit(value);
  hasSpecialSymbol(value);
};

const validateName = (value: string): Error | void => {
  hasNoWitespacesAround(value);
  hasMinimunLength(value, 1);
  hasCharsOnly(value);
  hasNoDigit(value);
  hasNoSpecialSymbol(value);
};

const validateYearOld = (value: string, payload?: string | number): Error | void => {
  moreThanYearsOld(new Date(value).valueOf(), Number(payload));
};

const validateStreet = (value: string): Error | void => {
  hasMinimunLength(value, 1);
  hasNoWitespacesAround(value);
};

const validateZipCode = (value: string, payload?: string | number): Error | void => {
  switch (payload) {
    case 'US':
      hasPostalCodeUS(value);
      break;
    case 'CA':
      hasPostalCodeCA(value);
      break;
    default:
  }
  hasNoWitespacesAround(value);
  hasMinimunLength(value, 1);
};

export { validateEmail, validatePassword, validateName, validateStreet, validateYearOld, validateZipCode };
