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
  if (/[!#$%^&*]/.test(value)) throw new Error(`Must NOT include special characters (!#$%^&*)`);
};

// Characters
const hasLowerCaseCharacter = (value: string): Error | void => {
  if (!/[a-z]/g.test(value)) throw new Error(`Must include a lowercase character`);
};

const hasUpperCaseCharacter = (value: string): Error | void => {
  if (!/[A-Z]/g.test(value)) throw new Error(`Must include a uppercase character`);
};

const hasDomainSyntax = (value: string): Error | void => {
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) throw new Error(`Must include a domain name`);
};

const hasNoWitespaces = (value: string): Error | void => {
  if (value !== value.trim()) throw new Error(`Must NOT start and end witespaces`);
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
const hasPostalCode = (value: string): Error | void => {
  if (!/^(\d{5})$|^([a-zA-Z]\d){3}$/gi.test(value)) throw new Error(`Format must be 12345 or A1B2C3`);
};

const validateEmail = (value: string): Error | void => {
  hasNoWitespaces(value);
  hasNoSpecialSymbol(value);
  hasMinimunLength(value, 1);
  hasSymbol(value, '@');
  hasDomainSyntax(value);
};

const validatePassword = (value: string): Error | void => {
  hasNoWitespaces(value);
  hasMinimunLength(value, 8);
  hasLowerCaseCharacter(value);
  hasUpperCaseCharacter(value);
  hasDigit(value);
  hasSpecialSymbol(value);
};

const validateName = (value: string): Error | void => {
  hasNoWitespaces(value);
  hasMinimunLength(value, 1);
  hasNoSpecialSymbol(value);
  hasNoSymbol(value, '@');
  hasNoDigit(value);
};

const validateYearOld = (value: string, years = 13): Error | void => {
  moreThanYearsOld(new Date(value).valueOf(), years);
};

const validateStreet = (value: string): Error | void => {
  hasMinimunLength(value, 1);
  hasNoWitespaces(value);
};

const validateZipCode = (value: string): Error | void => {
  hasNoWitespaces(value);
  hasMinimunLength(value, 1);
  hasPostalCode(value);
};

export { validateEmail, validatePassword, validateName, validateStreet, validateYearOld, validateZipCode };
